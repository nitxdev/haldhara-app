import { useState } from "react";
import "./SoilPlanner.css";

export default function SoilPlanner() {
  const [crop, setCrop] = useState("Ginger");
  const [soil, setSoil] = useState("Loamy");
  const [ph, setPh] = useState("6.0");
  const [moisture, setMoisture] = useState("Moderate");
  const [checked, setChecked] = useState<string[]>([]);

  const tasks = [
    "Check soil moisture before irrigation",
    "Inspect drainage after heavy rainfall",
    "Remove weeds without damaging crop roots",
    "Record fertilizer and compost applications",
    "Arrange a soil test through a recognised laboratory",
  ];

  const phValue = Number(ph);
  const phMessage = phValue < 5.5
    ? "Soil is on the acidic side. Confirm with a soil test before considering amendments."
    : phValue > 7.5
      ? "Soil is on the alkaline side. Confirm the result and crop requirements with a soil test."
      : "This pH is within a commonly suitable range for many crops, but crop-specific needs differ.";

  return (
    <main className="soil-page">
      <header className="soil-header">
        <span className="soil-eyebrow">HALDHARA SMART FARMING</span>
        <h1>Soil Health & Farm Planner</h1>
        <p>Organise soil observations and everyday farm-care tasks.</p>
      </header>

      <div className="soil-notice">
        <strong>Important:</strong> This is a planning demo, not a laboratory soil analysis.
        Fertilizer and soil amendments should be based on tested soil and crop-specific advice.
      </div>

      <section className="soil-card">
        <h2>Your field observations</h2>
        <div className="soil-fields">
          <label>Crop
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              {["Ginger", "Potato", "Pineapple", "Orange", "Kiwi", "Turmeric", "Rice", "Maize", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Soil type
            <select value={soil} onChange={e => setSoil(e.target.value)}>
              {["Loamy", "Clay", "Sandy", "Silty", "Unknown"].map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Soil pH (if tested)
            <select value={ph} onChange={e => setPh(e.target.value)}>
              {["4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map(v => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label>Observed moisture
            <select value={moisture} onChange={e => setMoisture(e.target.value)}>
              {["Dry", "Moderate", "Wet", "Waterlogged", "Unknown"].map(v => <option key={v}>{v}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="soil-summary">
        <article><span>🌾</span><small>Selected crop</small><strong>{crop}</strong></article>
        <article><span>🪴</span><small>Soil type</small><strong>{soil}</strong></article>
        <article><span>🧪</span><small>Entered pH</small><strong>{ph}</strong></article>
        <article><span>💧</span><small>Moisture</small><strong>{moisture}</strong></article>
      </section>

      <section className="soil-card">
        <h2>Soil observation</h2>
        <p>{phMessage}</p>
        <p className="soil-muted">Crop selected: {crop}. Soil type: {soil}. These entries alone cannot determine the exact fertilizer dose.</p>
        {moisture === "Waterlogged" && <div className="soil-warning">Waterlogging observed: inspect drainage and avoid adding irrigation until field conditions are assessed.</div>}
        {moisture === "Dry" && <div className="soil-tip">Dry soil observed: check moisture around the root zone and consider crop stage before irrigating.</div>}
      </section>

      <section className="soil-card">
        <div className="soil-task-heading">
          <div><h2>Farm-care checklist</h2><p className="soil-muted">Tick off tasks as you complete them.</p></div>
          <strong>{checked.length}/{tasks.length}</strong>
        </div>
        <div className="soil-progress"><div style={{width: `${checked.length / tasks.length * 100}%`}} /></div>
        <div className="soil-tasks">
          {tasks.map(task => (
            <label key={task} className={checked.includes(task) ? "soil-task completed" : "soil-task"}>
              <input type="checkbox" checked={checked.includes(task)} onChange={e => setChecked(old => e.target.checked ? [...old, task] : old.filter(t => t !== task))} />
              <span>{task}</span>
            </label>
          ))}
        </div>
      </section>

      <p className="soil-footnote">Demo only: checklist progress is not saved. For reliable nutrient recommendations, use a recognised soil test and local agricultural extension guidance.</p>
    </main>
  );
}
