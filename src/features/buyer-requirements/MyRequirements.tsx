import { useEffect, useState } from "react";
import "./MyRequirements.css";

type Requirement = {
  _id: string;
  cropName: string;
  quantityKg: number;
  targetPricePerKg: number;
  deliveryLocation: string;
  requiredBy: string;
  notes?: string;
  status?: string;
};

export default function MyRequirements() {
  const [items, setItems] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const token = localStorage.getItem("haldhara_token");
        if (!token) throw new Error("Please log in to view your requirements.");

        const response = await fetch(
          "http://localhost:5001/api/buyer-requirements/mine",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Requirements load nahi hui.");
        }

        setItems(Array.isArray(result) ? result : result.data ?? result.requirements ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = `${item.cropName} ${item.deliveryLocation}`
      .toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" || (item.status || "open") === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <section className="my-requirements-page">
      <div className="my-requirements-heading">
        <span>HALDHARA MARKETPLACE</span>
        <h1>My Requirements</h1>
        <p>Apni posted buyer demands aur unka status ek jagah dekho.</p>
      </div>

      <div className="my-requirements-filters">
        <input
          aria-label="Search my requirements"
          placeholder="Search crop or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <p className="my-requirements-state">Loading your requirements...</p>}
      {!loading && error && <p className="my-requirements-state my-requirements-error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="my-requirements-empty">
          <span>📋</span>
          <h3>No requirements found</h3>
          <p>Post a requirement or change your search and filters.</p>
        </div>
      )}

      <div className="my-requirements-grid">
        {filtered.map((item) => (
          <article className="my-requirements-card" key={item._id}>
            <div className="my-requirements-card-top">
              <h2>{item.cropName}</h2>
              <span className={`my-requirements-status status-${item.status || "open"}`}>
                {item.status || "open"}
              </span>
            </div>
            <p className="my-requirements-price">
              ₹{Number(item.targetPricePerKg).toLocaleString("en-IN")}
              <small> / kg target</small>
            </p>
            <div className="my-requirements-details">
              <p><span>Quantity</span><strong>{Number(item.quantityKg).toLocaleString("en-IN")} kg</strong></p>
              <p><span>Delivery</span><strong>{item.deliveryLocation}</strong></p>
              <p><span>Required by</span><strong>{item.requiredBy ? new Date(item.requiredBy).toLocaleDateString("en-IN") : "Not specified"}</strong></p>
            </div>
            {item.notes && <p className="my-requirements-notes">{item.notes}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
