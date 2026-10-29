import { useState } from "react";
import "./CropRecommendation.css";

type Crop = {
  name: string;
  icon: string;
  seasons: string[];
  soils: string[];
  water: string[];
  note: string;
  caution: string;
};

const crops: Crop[] = [
  { name: "Ginger", icon: "🫚", seasons: ["Monsoon", "Spring"], soils: ["Loamy", "Silty"], water: ["Moderate", "High"], note: "Consider well-drained soil and access to suitable planting material.", caution: "Avoid waterlogging; confirm local disease pressure and market access." },
  { name: "Potato", icon: "🥔", seasons: ["Winter", "Autumn"], soils: ["Loamy", "Sandy"], water: ["Low", "Moderate"], note: "Assess seed-tuber availability, soil drainage and the locally suitable planting window.", caution: "Temperature and variety strongly affect suitability." },
  { name: "Pineapple", icon: "🍍", seasons: ["Monsoon", "Spring"], soils: ["Loamy", "Sandy"], water: ["Moderate", "High"], note: "Consider drainage, healthy planting material and transport to buyers.", caution: "Confirm local conditions and variety before large-scale planting." },
  { name: "Orange", icon: "🍊", seasons: ["Winter", "Spring", "Autumn"], soils: ["Loamy", "Silty"], water: ["Moderate"], note: "Consider orchard drainage, variety, slope and long-term maintenance.", caution: "Orchards require a longer investment horizon before returns." },
  { name: "Kiwi", icon: "🥝", seasons: ["Winter", "Spring"], soils: ["Loamy"], water: ["Moderate", "High"], note: "Check local altitude, suitable climate, support structures and pollination needs.", caution: "Climate suitability is highly location-specific; seek local horticulture advice." },
  { name: "Turmeric", icon: "🌿", seasons: ["Monsoon", "Spring"], soils: ["Loamy", "Silty"], water: ["Moderate", "High"], note: "Consider well-drained beds, healthy rhizomes and post-harvest processing access.", caution: "Plan storage and buyers before planting a large area." },
  { name: "Maize", icon: "🌽", seasons: ["Monsoon", "Spring"], soils: ["Loamy", "Silty"], water: ["Low", "Moderate"], note: "Assess rainfall timing, seed availability and local demand.", caution: "Avoid poorly drained fields and confirm the locally suitable variety." },
  { name: "Rice", icon: "🌾", seasons: ["Monsoon"], soils: ["Loamy", "Silty"], water: ["High"], note: "Consider local rice varieties, field conditions and available water management.", caution: "Water needs depend on production system and local rainfall." },
];

export default function CropRecommendation() {
  const [region, setRegion] = useState("Arunachal Pradesh");
  const [soil, setSoil] = useState("Loamy");
  const [water, setWater] = useState("Moderate");
  const [season, setSeason] = useState("Monsoon");
  const [budget, setBudget] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);

  const matches = crops
    .map(crop => {
      let score = 0;
      if (crop.soils.includes(soil)) score += 2;
      if (crop.water.includes(water)) score += 2;
      if (crop.seasons.includes(season)) score += 2;
      return { ...crop, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <main className="recommend-page">
      <header className="recommend-heading">
        <span className="recommend-eyebrow">HALDHARA FARM INTELLIGENCE</span>
        <h1>Smart Crop Recommendation</h1>
        <p>Explore crop options using your field conditions and farming plans.</p>
      </header>

      <div className="recommend-notice">
        <strong>Preliminary demo recommendations.</strong> Results use simple matching rules, not a trained AI model or verified agronomic dataset. Confirm crop suitability with your local KVK or agriculture department.
      </div>

      <section className="recommend-card">
        <h2>Tell us about your farm</h2>
        <p className="recommend-muted">Change the options and generate a new shortlist.</p>
        <div className="recommend-fields">
          <label>Region
            <select value={region} onChange={e => { setRegion(e.target.value); setSubmitted(false); }}>
              {["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Soil type
            <select value={soil} onChange={e => { setSoil(e.target.value); setSubmitted(false); }}>
              {["Loamy", "Clay", "Sandy", "Silty", "Unknown"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Water availability
            <select value={water} onChange={e => { setWater(e.target.value); setSubmitted(false); }}>
              {["Low", "Moderate", "High"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Planned season
            <select value={season} onChange={e => { setSeason(e.target.value); setSubmitted(false); }}>
              {["Monsoon", "Winter", "Spring", "Autumn"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Budget
            <select value={budget} onChange={e => { setBudget(e.target.value); setSubmitted(false); }}>
              {["Low", "Medium", "High"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
        </div>
        <button className="recommend-button" type="button" onClick={() => setSubmitted(true)}>Find suitable options</button>
      </section>

      {submitted && (
        <section className="recommend-results" aria-live="polite">
          <div className="recommend-results-heading">
            <div><h2>Your crop shortlist</h2><p>{region} · {soil} soil · {season} season</p></div>
            <span>RULE-BASED DEMO</span>
          </div>
          {matches.slice(0, 5).map((crop, index) => (
            <article className="recommend-result" key={crop.name}>
              <span className="recommend-crop-icon">{crop.icon}</span>
              <div className="recommend-result-body">
                <div className="recommend-result-title"><h3>{crop.name}</h3><span>{index === 0 ? "Top match" : `${crop.score}/6 match`}</span></div>
                <p>{crop.note}</p>
                <div className="recommend-caution"><strong>Check:</strong> {crop.caution}</div>
              </div>
            </article>
          ))}
          <p className="recommend-budget-note">Budget selected: {budget}. This demo does not calculate input costs, yield or profitability. Compare local input prices and confirmed buyer demand before choosing.</p>
        </section>
      )}
    </main>
  );
}
