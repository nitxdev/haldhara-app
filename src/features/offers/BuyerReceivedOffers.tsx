import { useCallback, useEffect, useState } from "react";
import "./BuyerReceivedOffers.css";

type ReceivedOffer = {
  _id: string;
  offeredQuantityKg: number;
  offeredPricePerKg: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  farmer?: { name?: string };
  listing?: {
    cropName?: string;
    quantityKg?: number;
    expectedPricePerKg?: number;
    location?: string;
    imageUrl?: string;
  };
  requirement?: {
    cropName?: string;
    quantityKg?: number;
    targetPricePerKg?: number;
    deliveryLocation?: string;
    requiredBy?: string;
  };
};

const API = "http://localhost:5001/api/offers";

export default function BuyerReceivedOffers() {
  const [offers, setOffers] = useState<ReceivedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("haldhara_token");
      if (!token) throw new Error("Please log in to view received offers.");

      const response = await fetch(`${API}/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Received offers load nahi hui.");

      setOffers(Array.isArray(result) ? result : result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load offers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  async function decide(offerId: string, status: "accepted" | "rejected") {
    try {
      setBusyId(offerId);
      setNotice("");
      setError("");

      const token = localStorage.getItem("haldhara_token");
      if (!token) throw new Error("Please log in again.");

      const response = await fetch(`${API}/${encodeURIComponent(offerId)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Offer update failed.");

      setOffers((current) =>
        current.map((offer) =>
          offer._id === offerId ? { ...offer, status } : offer
        )
      );
      setNotice(status === "accepted" ? "Offer accepted." : "Offer rejected.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update offer.");
    } finally {
      setBusyId("");
    }
  }

  const visible = offers.filter((offer) => filter === "all" || offer.status === filter);

  return (
    <main className="buyer-received-page">
      <header className="buyer-received-heading">
        <span>HALDHARA MARKETPLACE</span>
        <h1>Buyer Received Offers</h1>
        <p>Apni buyer requirements par aayi crop offers review karo.</p>
      </header>

      <div className="buyer-received-toolbar">
        <div><strong>{offers.length}</strong><span>Received offers</span></div>
        <select aria-label="Filter received offers" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {notice && <p className="buyer-received-notice" role="status">{notice}</p>}
      {loading && <p className="buyer-received-state">Loading received offers...</p>}
      {!loading && error && (
        <div className="buyer-received-state buyer-received-error">
          <p>{error}</p>
          <button type="button" onClick={() => void loadOffers()}>Try again</button>
        </div>
      )}
      {!loading && !error && visible.length === 0 && (
        <div className="buyer-received-empty">
          <span>🤝</span>
          <h3>No offers found</h3>
          <p>Offers sent by farmers against your open requirements will appear here.</p>
        </div>
      )}

      <div className="buyer-received-grid">
        {visible.map((offer) => {
          const crop = offer.listing?.cropName || offer.requirement?.cropName || "Crop offer";
          const isPending = offer.status === "pending";
          return (
            <article className="buyer-received-card" key={offer._id}>
              <div className="buyer-received-card-top">
                <h2>{crop}</h2>
                <span className={`buyer-received-status status-${offer.status}`}>{offer.status}</span>
              </div>

              <p className="buyer-received-farmer">
                Farmer: {offer.farmer?.name || "Haldhara farmer"}
              </p>
              <p className="buyer-received-price">
                ₹{Number(offer.offeredPricePerKg).toLocaleString("en-IN")}
                <small> / kg offered</small>
              </p>

              <div className="buyer-received-details">
                <p><span>Offered quantity</span><strong>{Number(offer.offeredQuantityKg).toLocaleString("en-IN")} kg</strong></p>
                <p><span>Your target price</span><strong>{offer.requirement?.targetPricePerKg != null ? `₹${Number(offer.requirement.targetPricePerKg).toLocaleString("en-IN")}/kg` : "—"}</strong></p>
                <p><span>Demand quantity</span><strong>{offer.requirement?.quantityKg != null ? `${Number(offer.requirement.quantityKg).toLocaleString("en-IN")} kg` : "—"}</strong></p>
                <p><span>Delivery location</span><strong>{offer.requirement?.deliveryLocation || "—"}</strong></p>
                <p><span>Offer received</span><strong>{new Date(offer.createdAt).toLocaleDateString("en-IN")}</strong></p>
              </div>

              {offer.message && <p className="buyer-received-message">{offer.message}</p>}

              {isPending && (
                <div className="buyer-received-actions">
                  <button
                    type="button"
                    disabled={!!busyId}
                    onClick={() => void decide(offer._id, "accepted")}
                  >
                    {busyId === offer._id ? "Updating..." : "Accept offer"}
                  </button>
                  <button
                    type="button"
                    className="reject"
                    disabled={!!busyId}
                    onClick={() => void decide(offer._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="buyer-received-disclaimer">
        Accepting an offer updates its status only. Confirm quality, delivery, payment and final terms separately.
      </p>
    </main>
  );
}
