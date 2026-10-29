import { useEffect, useMemo, useState } from "react";
import { demoBuyerRequirements, DEMO_MODE } from "../../demo/demoData";

type Requirement = {
  _id?: string;
  id?: string;
  cropName?: string;
  quantityKg?: number;
  targetPricePerKg?: number;
  deliveryLocation?: string;
  requiredBy?: string;
  notes?: string;
  status?: string;
};

export default function BuyerRequirementsList() {
  const [items, setItems] = useState<Requirement[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("deadline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const response = await fetch("http://localhost:5001/api/buyer-requirements");
        if (!response.ok) throw new Error("API unavailable");

        const result = await response.json();
        const records = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.requirements)
              ? result.requirements
              : Array.isArray(result?.data?.requirements)
                ? result.data.requirements
                : [];

        if (!alive) return;

        if (records.length) {
          setItems(records);
          setIsDemo(false);
        } else {
          setItems(DEMO_MODE ? demoBuyerRequirements as Requirement[] : []);
          setIsDemo(Boolean(DEMO_MODE));
        }
      } catch {
        if (!alive) return;
        setItems(DEMO_MODE ? demoBuyerRequirements as Requirement[] : []);
        setIsDemo(Boolean(DEMO_MODE));
        setError("Live buyer requirements are unavailable.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, []);

  const visible = useMemo(() => {
    const filtered = items.filter((item) =>
      `${item.cropName ?? ""} ${item.deliveryLocation ?? ""} ${item.notes ?? ""}`
        .toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sort === "price") return Number(b.targetPricePerKg ?? 0) - Number(a.targetPricePerKg ?? 0);
      if (sort === "quantity") return Number(b.quantityKg ?? 0) - Number(a.quantityKg ?? 0);
      return new Date(a.requiredBy ?? "2999-12-31").getTime() -
             new Date(b.requiredBy ?? "2999-12-31").getTime();
    });
  }, [items, search, sort]);

  return (
    <section style={{ padding: 24, color: "#203b2b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Buyer Requirements</h2>
          <p style={{ color: "#667568", marginTop: 0 }}>Find buyers looking for crops in your region.</p>
        </div>
        {isDemo && <strong style={{ background: "#fff0c2", color: "#795400", padding: "8px 12px", borderRadius: 20, fontSize: 12 }}>DEMO DATA — NOT LIVE</strong>}
      </div>

      {error && <p style={{ color: "#8b6412" }}>{error} Showing sample requirements.</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crop or location..." aria-label="Search requirements" style={{ flex: "1 1 220px", padding: 12, border: "1px solid #d5dfd5", borderRadius: 10 }} />
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort requirements" style={{ padding: 12, border: "1px solid #d5dfd5", borderRadius: 10, background: "white" }}>
          <option value="deadline">Soonest deadline</option>
          <option value="price">Highest target price</option>
          <option value="quantity">Largest quantity</option>
        </select>
      </div>

      {loading ? <p>Loading buyer requirements...</p> : visible.length === 0 ? (
        <p>No buyer requirements found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: 16 }}>
          {visible.map((item, index) => (
            <article key={item._id ?? item.id ?? `${item.cropName}-${index}`} style={{ border: "1px solid #e0e7dc", borderRadius: 14, padding: 18, background: "white" }}>
              <h3 style={{ marginTop: 0 }}>{item.cropName || "Crop requirement"}</h3>
              <p>📦 Quantity: <strong>{item.quantityKg ?? "—"} kg</strong></p>
              <p>💰 Target price: <strong style={{ color: "#287044" }}>{item.targetPricePerKg != null ? `₹${item.targetPricePerKg}/kg` : "Not specified"}</strong></p>
              <p>📍 Delivery: {item.deliveryLocation || "Not specified"}</p>
              <p>📅 Required by: {item.requiredBy ? new Date(item.requiredBy).toLocaleDateString("en-IN") : "Flexible / not specified"}</p>
              {item.notes && <p style={{ color: "#667568" }}>{item.notes}</p>}
              <p style={{ fontSize: 12, color: "#667568" }}>{isDemo ? "Illustrative sample requirement" : "Buyer requirement"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
