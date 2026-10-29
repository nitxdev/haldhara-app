import { useMemo, useState } from "react";
import "./MarketIntelligence.css";

type Crop = {
  name: string;
  price: number;
  change: number;
  demand: "High" | "Medium" | "Rising";
  season: string;
  unit: string;
};

const DEMO_CROPS: Crop[] = [
  { name: "Ginger", price: 85, change: 12, demand: "High", season: "Jun–Nov", unit: "kg" },
  { name: "Potato", price: 22, change: 8, demand: "Medium", season: "Oct–Mar", unit: "kg" },
  { name: "Pineapple", price: 35, change: 10, demand: "High", season: "May–Aug", unit: "kg" },
  { name: "Orange", price: 48, change: 6, demand: "Rising", season: "Nov–Feb", unit: "kg" },
  { name: "Kiwi", price: 120, change: 15, demand: "Rising", season: "Oct–Dec", unit: "kg" },
  { name: "Turmeric", price: 60, change: 4, demand: "Medium", season: "Jan–Apr", unit: "kg" },
];

type Tab = "All crops" | "High demand" | "Rising price" | "Seasonal";

export default function MarketIntelligence() {
  const [tab, setTab] = useState<Tab>("All crops");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Arunachal Pradesh");

  const crops = useMemo(() => DEMO_CROPS.filter((crop) => {
    const matchesQuery = crop.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesTab =
      tab === "All crops" ||
      (tab === "High demand" && crop.demand === "High") ||
      (tab === "Rising price" && crop.change >= 8) ||
      tab === "Seasonal";
    return matchesQuery && matchesTab;
  }), [tab, query]);

  return (
    <main className="market-intel">
      <header className="market-intel-header">
        <span>HALDHARA · MARKET DESK</span>
        <h1>Market Intelligence</h1>
        <p>Compare indicative crop prices, demand and seasonal windows.</p>
      </header>

      <div className="market-intel-toolbar">
        <label>
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>Arunachal Pradesh</option>
            <option>Assam</option>
            <option>Manipur</option>
            <option>Meghalaya</option>
            <option>Mizoram</option>
            <option>Nagaland</option>
            <option>Sikkim</option>
            <option>Tripura</option>
          </select>
        </label>
        <label className="market-intel-search">
          Search crops
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. ginger" />
        </label>
      </div>

      <nav className="market-intel-tabs" aria-label="Crop filters">
        {(["All crops", "High demand", "Rising price", "Seasonal"] as Tab[]).map((item) => (
          <button key={item} type="button" className={tab === item ? "selected" : ""}
            onClick={() => setTab(item)}>{item}</button>
        ))}
      </nav>

      <div className="market-intel-notice">
        <strong>Demo data</strong>
        <span>Illustrative values only for {region}. Not live mandi prices or verified regional forecasts.</span>
      </div>

      <section className="market-intel-grid">
        {crops.map((crop) => (
          <article className="market-intel-card" key={crop.name}>
            <div className="market-intel-card-top">
              <span className="market-intel-crop-icon">🌿</span>
              <span className={`market-intel-demand demand-${crop.demand.toLowerCase()}`}>{crop.demand} demand</span>
            </div>
            <h2>{crop.name}</h2>
            <p className="market-intel-price">₹{crop.price}<small> / {crop.unit}</small></p>
            <p className="market-intel-change">↑ {crop.change}% <span>illustrative change</span></p>
            <div className="market-intel-meta">
              <span>Seasonal window</span>
              <strong>{crop.season}</strong>
            </div>
          </article>
        ))}
      </section>

      {crops.length === 0 && <p className="market-intel-empty">No crops match your search.</p>}

      <p className="market-intel-footer">
        Prices and changes are placeholders. Connect verified market data before using them for selling decisions.
      </p>
    </main>
  );
}
