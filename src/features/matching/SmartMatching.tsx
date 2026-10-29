import { useEffect, useState } from "react";
import "./SmartMatching.css";

const API = "http://localhost:5001/api";

type Requirement = {
  _id?: string;
  id?: string;
  cropName: string;
  quantityKg: number;
  targetPricePerKg: number;
  deliveryLocation: string;
  requiredBy?: string;
  status?: string;
};

type Match = {
  listing: {
    _id: string;
    cropName: string;
    quantityKg: number;
    expectedPricePerKg: number;
    location: string;
    description?: string;
    imageUrl?: string;
  };
  match: {
    score: number;
    quantity: {
      availableKg: number;
      requiredKg: number;
      sufficient: boolean;
      coveragePercent: number;
    };
    price: {
      farmerPricePerKg: number;
      buyerTargetPerKg: number;
      withinTarget: boolean;
    };
    location: {
      farmerLocation: string;
      deliveryLocation: string;
      sameLocation: boolean;
    };
  };
};

function money(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

import SendOfferForm from "./SendOfferForm";
export default function SmartMatching() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingRequirements, setLoadingRequirements] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRequirements() {
      try {
        const response = await fetch(`${API}/buyer-requirements`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Buyer requirements load nahi hui.");
        }

        const rows: Requirement[] = Array.isArray(result)
          ? result
          : result.data ?? result.requirements ?? [];

        const openRows = rows.filter((item) => !item.status || item.status === "open");
        setRequirements(openRows);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoadingRequirements(false);
      }
    }

    loadRequirements();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMatches([]);
      setMatchError("");
      return;
    }

    const controller = new AbortController();

    async function loadMatches() {
      try {
        setLoadingMatches(true);
        setMatchError("");
        setMatches([]);

        const response = await fetch(
          `${API}/matching?requirementId=${encodeURIComponent(selectedId)}`,
          { signal: controller.signal }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Matching results load nahi hue.");
        }

        setMatches(Array.isArray(result.matches) ? result.matches : []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setMatchError(err.message);
        }
      } finally {
        setLoadingMatches(false);
      }
    }

    loadMatches();
    return () => controller.abort();
  }, [selectedId]);

  return (
    <main className="smart-matching-page">
      <header className="smart-matching-heading">
        <span className="smart-matching-eyebrow">HALDHARA • SMART MARKETPLACE</span>
        <h1>Smart Buyer–Farmer Matching</h1>
        <p>Buyer demand ke hisaab se suitable crop listings discover karo.</p>
      </header>

      <section className="smart-matching-select-panel">
        <label htmlFor="matching-requirement">Select a buyer requirement</label>
        {loadingRequirements ? (
          <p>Loading buyer requirements...</p>
        ) : error ? (
          <p className="smart-matching-error">{error}</p>
        ) : requirements.length === 0 ? (
          <p>No open buyer requirements available yet.</p>
        ) : (
          <select
            id="matching-requirement"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">Choose crop demand...</option>
            {requirements.map((item) => {
              const id = item._id ?? item.id ?? "";
              return (
                <option key={id} value={id}>
                  {item.cropName} · {item.quantityKg} kg · {item.deliveryLocation}
                </option>
              );
            })}
          </select>
        )}

        {selectedId && (() => {
          const requirement = requirements.find(
            (item) => (item._id ?? item.id) === selectedId
          );
          if (!requirement) return null;
          return (
            <div className="smart-matching-demand-summary">
              <div><span>Crop</span><strong>{requirement.cropName}</strong></div>
              <div><span>Quantity required</span><strong>{requirement.quantityKg} kg</strong></div>
              <div><span>Target price</span><strong>{money(requirement.targetPricePerKg)}/kg</strong></div>
              <div><span>Delivery location</span><strong>{requirement.deliveryLocation}</strong></div>
            </div>
          );
        })()}
      </section>

      {selectedId && (
        <section className="smart-matching-results">
          <div className="smart-matching-results-heading">
            <h2>Recommended crop listings</h2>
            <span>{matches.length} matches</span>
          </div>

          {loadingMatches && <p className="smart-matching-state">Finding suitable listings...</p>}
          {!loadingMatches && matchError && (
            <p className="smart-matching-state smart-matching-error">{matchError}</p>
          )}
          {!loadingMatches && !matchError && matches.length === 0 && (
            <div className="smart-matching-empty">
              <span>🌱</span>
              <h3>No matching listings found</h3>
              <p>Try again after a farmer posts an active listing for this crop.</p>
            </div>
          )}

          <div className="smart-matching-grid">
            {matches.map(({ listing, match }) => (
              <article className="smart-matching-card" key={listing._id}>
                {listing.imageUrl ? (
                  <img
                    className="smart-matching-photo"
                    src={`http://localhost:5001${listing.imageUrl}`}
                    alt={listing.cropName}
                    loading="lazy"
                  />
                ) : (
                  <div className="smart-matching-photo-placeholder">🌾</div>
                )}

                <div className="smart-matching-card-body">
                  <div className="smart-matching-card-title">
                    <h3>{listing.cropName}</h3>
                    <span className="smart-matching-score">{match.score}% match</span>
                  </div>

                  <p className="smart-matching-price">
                    {money(listing.expectedPricePerKg)}<small>/kg</small>
                  </p>

                  <div className="smart-matching-metric">
                    <span>Quantity coverage</span>
                    <strong>{match.quantity.coveragePercent}%</strong>
                  </div>
                  <div className="smart-matching-progress">
                    <span style={{ width: `${Math.min(100, Math.max(0, match.quantity.coveragePercent))}%` }} />
                  </div>

                  <div className="smart-matching-checks">
                    <p>
                      <span>Quantity</span>
                      <strong>{match.quantity.sufficient ? "Sufficient" : "Partial supply"}</strong>
                    </p>
                    <p>
                      <span>Price target</span>
                      <strong>{match.price.withinTarget ? "Within target" : "Above target"}</strong>
                    </p>
                    <p>
                      <span>Location</span>
                      <strong>{match.location.sameLocation ? "Same location" : listing.location || "Not specified"}</strong>
                    </p>
                  </div>

                  <p className="smart-matching-location">📍 {listing.location}</p>
                  {listing.description && (
                    <p className="smart-matching-description">{listing.description}</p>
                  )}
                  <SendOfferForm
                    requirementId={selectedId}
                    listingId={listing._id}
                    maxQuantityKg={listing.quantityKg}
                    targetPricePerKg={Number(requirements.find((item) => (item._id ?? item.id) === selectedId)?.targetPricePerKg ?? 0)}
                  />
                </div>
              </article>
            ))}
          </div>
          <p className="smart-matching-disclaimer">
            Recommendations only. Verify crop quality, transport, quantity and final price before agreeing to a deal.
          </p>
        </section>
      )}
    </main>
  );
}

