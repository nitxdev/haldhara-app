import { useEffect, useState } from "react";
import "./BuyerMarketplace.css";

type CropListing = {
  _id: string;
  cropName: string;
  quantityKg: number;
  expectedPricePerKg: number;
  location: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
};

type OrderForm = {
  quantityKg: string;
  deliveryAddress: string;
  phone: string;
  notes: string;
};

const API = "http://localhost:5001";

const emptyForm: OrderForm = {
  quantityKg: "1",
  deliveryAddress: "",
  phone: "",
  notes: "",
};

function getToken() {
  return localStorage.getItem("haldhara_token");
}

export default function BuyerMarketplace() {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [form, setForm] = useState<OrderForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  async function loadListings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/crops`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load crop listings.");
      }

      setListings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Marketplace load nahi ho paya. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadListings();
  }, []);

  const filtered = listings
    .filter((crop) =>
      `${crop.cropName} ${crop.location} ${crop.description ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((crop) => minPrice === "" || crop.expectedPricePerKg >= Number(minPrice))
    .filter((crop) => maxPrice === "" || crop.expectedPricePerKg <= Number(maxPrice))
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.expectedPricePerKg - b.expectedPricePerKg;
      if (sortOrder === "price-high") return b.expectedPricePerKg - a.expectedPricePerKg;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const quantity = Number(form.quantityKg);
  const totalAmount =
    selectedCrop && Number.isFinite(quantity) && quantity > 0
      ? Math.round(quantity * selectedCrop.expectedPricePerKg * 100) / 100
      : 0;

  function openOrderForm(crop: CropListing) {
    setSelectedCrop(crop);
    setForm({ ...emptyForm, quantityKg: "1" });
    setOrderMessage("");
    setOrderError("");
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderMessage("");
    setOrderError("");

    if (!selectedCrop) return;

    const token = getToken();
    if (!token) {
      setOrderError("Please log in first to place an order.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setOrderError("Enter a valid quantity.");
      return;
    }

    if (quantity > selectedCrop.quantityKg) {
      setOrderError(`Only ${selectedCrop.quantityKg} kg is listed as available.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: selectedCrop._id,
          quantityKg: quantity,
          deliveryAddress: form.deliveryAddress.trim(),
          phone: form.phone.trim(),
          notes: form.notes.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not place order.");
      }

      setOrderMessage(`Order placed successfully! Order ID: ${result.data?._id ?? "created"}`);
      setSelectedCrop(null);
      setForm(emptyForm);
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : "Order failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="buyer-marketplace">
      <header className="buyer-marketplace-header">
        <span className="buyer-marketplace-eyebrow">HALDHARA MARKETPLACE</span>
        <h1>Find Fresh Crops</h1>
        <p>Discover produce listed by farmers across the region.</p>

        <input
          type="search"
          aria-label="Search crops or locations"
          placeholder="Search crop or district..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="buyer-marketplace-filters">
          <label>
            Minimum ₹/kg
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Maximum ₹/kg
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Any"
            />
          </label>
          <label>
            Sort crops
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Recently listed</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
      </header>

      {orderMessage && <p role="status">{orderMessage}</p>}
      {orderError && !selectedCrop && <p role="alert">{orderError}</p>}

      {loading && <p role="status">Loading available crops...</p>}

      {!loading && error && (
        <div role="alert" className="buyer-marketplace-empty">
          <p>{error}</p>
          <button type="button" onClick={() => void loadListings()}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="buyer-marketplace-empty">
          <h2>No matching crops yet</h2>
          <p>Try another search or check again later.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <section className="buyer-marketplace-grid" aria-label="Available crops">
          {filtered.map((crop) => (
            <article className="buyer-crop-card" key={crop._id}>
              {crop.imageUrl ? (
                <img
                  className="buyer-crop-image"
                  src={`${API}${crop.imageUrl}`}
                  alt={crop.cropName}
                  loading="lazy"
                />
              ) : (
                <div className="buyer-crop-placeholder" aria-hidden="true">
                  🌿
                </div>
              )}

              <div className="buyer-crop-content">
                <div className="buyer-crop-title-row">
                  <h2>{crop.cropName}</h2>
                  <span className="buyer-crop-status">Available</span>
                </div>
                <p className="buyer-crop-location">📍 {crop.location}</p>
                <p className="buyer-crop-quantity">
                  {crop.quantityKg.toLocaleString("en-IN")} kg available
                </p>
                <p className="buyer-crop-price">
                  ₹{crop.expectedPricePerKg.toLocaleString("en-IN")}
                  <span>/kg expected</span>
                </p>
                {crop.description && (
                  <p className="buyer-crop-description">{crop.description}</p>
                )}
                <small>
                  Listed {new Date(crop.createdAt).toLocaleDateString("en-IN")}
                </small>
                <button
                  type="button"
                  onClick={() => openOrderForm(crop)}
                  style={{ marginTop: "12px", width: "100%" }}
                >
                  Place Order
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedCrop && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="place-order-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <form
            onSubmit={submitOrder}
            style={{
              background: "white",
              color: "#1f2937",
              padding: "24px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              display: "grid",
              gap: "12px",
              margin: "auto",
            }}
          >
            <h2 id="place-order-title">Place Order — {selectedCrop.cropName}</h2>
            <p>Farmer location: {selectedCrop.location}</p>
            <p>
              Price: ₹{selectedCrop.expectedPricePerKg.toLocaleString("en-IN")}/kg
            </p>

            <label>
              Quantity (kg)
              <input
                type="number"
                min="0.01"
                max={selectedCrop.quantityKg}
                step="0.01"
                required
                value={form.quantityKg}
                onChange={(event) =>
                  setForm({ ...form, quantityKg: event.target.value })
                }
              />
            </label>

            <p>
              <strong>Total: ₹{totalAmount.toLocaleString("en-IN")}</strong>
            </p>

            <label>
              Delivery address
              <textarea
                required
                minLength={3}
                maxLength={300}
                value={form.deliveryAddress}
                onChange={(event) =>
                  setForm({ ...form, deliveryAddress: event.target.value })
                }
                placeholder="Village, district, landmark"
              />
            </label>

            <label>
              Contact phone
              <input
                type="tel"
                required
                minLength={5}
                maxLength={20}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="Phone number"
              />
            </label>

            <label>
              Notes (optional)
              <textarea
                maxLength={500}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Preferred delivery time or other details"
              />
            </label>

            {orderError && <p role="alert">{orderError}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? "Placing order..." : "Confirm Order"}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setSelectedCrop(null);
                setOrderError("");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
