import { useEffect, useState } from "react";
import "./MyOffers.css";

type Offer = {
  _id: string;
  offeredQuantityKg: number;
  offeredPricePerKg: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  requirement?: {
    cropName?: string;
    deliveryLocation?: string;
    targetPricePerKg?: number;
  };
  listing?: {
    cropName?: string;
    location?: string;
  };
};

export default function MyOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = localStorage.getItem("haldhara_token");
        if (!token) throw new Error("Please log in to view your offers.");

        const response = await fetch("http://localhost:5001/api/offers/mine", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Offers load nahi hui.");

        setOffers(Array.isArray(result) ? result : result.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const visible = offers.filter((offer) => filter === "all" || offer.status === filter);

  return (
    <main className="my-offers-page">
      <header className="my-offers-heading">
        <span>HALDHARA MARKETPLACE</span>
        <h1>My Offers</h1>
        <p>Apni bheji hui crop offers aur unka current status dekho.</p>
      </header>

      <div className="my-offers-toolbar">
        <div><strong>{offers.length}</strong><span>Total offers</span></div>
        <select aria-label="Filter offers" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {loading && <p className="my-offers-state">Loading your offers...</p>}
      {!loading && error && <p className="my-offers-state my-offers-error">{error}</p>}
      {!loading && !error && visible.length === 0 && (
        <div className="my-offers-empty">
          <span>🤝</span>
          <h3>No offers found</h3>
          <p>Send an offer from Smart Matching and it will appear here.</p>
        </div>
      )}

      <div className="my-offers-grid">
        {visible.map((offer) => (
          <article className="my-offers-card" key={offer._id}>
            <div className="my-offers-card-top">
              <h2>{offer.listing?.cropName || offer.requirement?.cropName || "Crop offer"}</h2>
              <span className={`my-offers-status status-${offer.status}`}>{offer.status}</span>
            </div>
            <p className="my-offers-price">
              ₹{Number(offer.offeredPricePerKg).toLocaleString("en-IN")}
              <small> / kg offered</small>
            </p>
            <div className="my-offers-details">
              <p><span>Quantity offered</span><strong>{Number(offer.offeredQuantityKg).toLocaleString("en-IN")} kg</strong></p>
              <p><span>Buyer target</span><strong>{offer.requirement?.targetPricePerKg != null ? `₹${Number(offer.requirement.targetPricePerKg).toLocaleString("en-IN")}/kg` : "—"}</strong></p>
              <p><span>Delivery location</span><strong>{offer.requirement?.deliveryLocation || "—"}</strong></p>
              <p><span>Sent on</span><strong>{new Date(offer.createdAt).toLocaleDateString("en-IN")}</strong></p>
            </div>
            {offer.message && <p className="my-offers-message">{offer.message}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
