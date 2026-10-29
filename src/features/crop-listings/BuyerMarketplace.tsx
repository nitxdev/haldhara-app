import { useEffect, useMemo, useState } from "react";
import { demoCrops, DEMO_MODE } from "../../demo/demoData";

type Crop = {
  _id?: string;
  id?: string;
  cropName?: string;
  name?: string;
  quantityKg?: number;
  quantity?: number;
  expectedPricePerKg?: number;
  pricePerKg?: number;
  price?: number;
  location?: string;
  description?: string;
  imageUrl?: string;
  demo?: boolean;
};

const API = "http://localhost:5001/api/crops";

export default function BuyerMarketplace() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadCrops() {
      try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Marketplace API unavailable");

        const result = await response.json();
        const records = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.crops)
              ? result.crops
              : Array.isArray(result?.data?.crops)
                ? result.data.crops
                : [];

        if (!alive) return;

        if (records.length > 0) {
          setCrops(records);
          setIsDemo(false);
        } else {
          setCrops(DEMO_MODE ? (demoCrops as Crop[]) : []);
          setIsDemo(Boolean(DEMO_MODE));
        }
      } catch {
        if (!alive) return;
        setCrops(DEMO_MODE ? (demoCrops as Crop[]) : []);
        setIsDemo(Boolean(DEMO_MODE));
        setError("Live listings could not be loaded.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadCrops();
    return () => { alive = false; };
  }, []);

  const visibleCrops = useMemo(() => {
    const filtered = crops.filter((crop) => {
      const name = crop.cropName ?? crop.name ?? "";
      const location = crop.location ?? "";
      return `${name} ${location}`.toLowerCase().includes(search.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.expectedPricePerKg ?? a.pricePerKg ?? a.price ?? 0);
      const priceB = Number(b.expectedPricePerKg ?? b.pricePerKg ?? b.price ?? 0);
      if (sort === "low") return priceA - priceB;
      if (sort === "high") return priceB - priceA;
      return 0;
    });
  }, [crops, search, sort]);

  const money = (value: unknown) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0
      ? `₹${number.toLocaleString("en-IN")}`
      : "Price not set";
  };

  return (
    <section style={{ padding: 24, color: "#203b2b" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Find Fresh Crops</h2>
          <p style={{ color: "#667568", marginTop: 0 }}>Discover crops offered by farmers.</p>
        </div>
        {isDemo && (
          <span style={{ background: "#fff0c2", color: "#795400", padding: "8px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            DEMO DATA — NOT LIVE
          </span>
        )}
      </div>

      {error && <p style={{ color: "#8b6412" }}>{error} Showing sample listings instead.</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crop or location..."
          aria-label="Search crops"
          style={{ flex: "1 1 220px", minWidth: 0, padding: 12, border: "1px solid #d5dfd5", borderRadius: 10 }}
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort crops by price"
          style={{ padding: 12, border: "1px solid #d5dfd5", borderRadius: 10, background: "white" }}
        >
          <option value="newest">Default order</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      {loading ? <p>Loading crop listings...</p> : (
        <>
          <p style={{ color: "#667568", fontSize: 13 }}>{visibleCrops.length} listing(s)</p>
          {visibleCrops.length === 0 ? (
            <div style={{ padding: 24, background: "#f5f7f1", borderRadius: 12 }}>
              No matching crops found. Try another search.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))", gap: 16 }}>
              {visibleCrops.map((crop, index) => {
                const name = crop.cropName ?? crop.name ?? "Crop";
                const quantity = crop.quantityKg ?? crop.quantity;
                const price = crop.expectedPricePerKg ?? crop.pricePerKg ?? crop.price;

                return (
                  <article key={crop._id ?? crop.id ?? `${name}-${index}`} style={{ border: "1px solid #e0e7dc", borderRadius: 14, overflow: "hidden", background: "white" }}>
                    {crop.imageUrl ? (
                      <img src={crop.imageUrl} alt={name} style={{ width: "100%", height: 145, objectFit: "cover" }} />
                    ) : (
                      <div style={{ height: 95, background: "#edf3e8", display: "grid", placeItems: "center", fontSize: 36 }}>🌾</div>
                    )}
                    <div style={{ padding: 15 }}>
                      <h3 style={{ margin: "0 0 8px" }}>{name}</h3>
                      <p style={{ margin: "5px 0", color: "#667568", fontSize: 13 }}>📍 {crop.location || "Location not specified"}</p>
                      <p style={{ margin: "8px 0" }}>Available: {quantity != null ? `${quantity} kg` : "Quantity not specified"}</p>
                      <p style={{ fontWeight: 700, fontSize: 20, margin: "10px 0", color: "#287044" }}>
                        {money(price)}<span style={{ fontSize: 12, fontWeight: 400 }}>/kg</span>
                      </p>
                      {crop.description && <p style={{ color: "#667568", fontSize: 13 }}>{crop.description}</p>}
                      <p style={{ fontSize: 12, color: "#667568", marginBottom: 0 }}>
                        {isDemo ? "Illustrative sample listing" : "Farmer listing"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
