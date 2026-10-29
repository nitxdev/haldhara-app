import { useState } from "react";
import "./DiseaseSupport.css";

const guidance: Record<string, { title: string; causes: string; steps: string[]; severity: string }> = {
  yellow: {
    title: "Yellowing leaves",
    causes: "Possible causes include nutrient deficiency, excess water, root stress, or disease.",
    steps: [
      "Check whether yellowing starts on older or newer leaves.",
      "Inspect soil drainage and moisture before watering.",
      "Check both sides of leaves for insects or unusual spots.",
      "Seek local agricultural advice before applying fertilizer or pesticides.",
    ],
    severity: "Needs inspection",
  },
  spots: {
    title: "Leaf spots",
    causes: "Leaf spots may be associated with fungal or bacterial disease, pests, or physical damage.",
    steps: [
      "Photograph affected leaves and note how quickly symptoms spread.",
      "Avoid handling healthy plants after touching affected plants.",
      "Keep tools clean and avoid unnecessary overhead watering.",
      "Get a local diagnosis before selecting any treatment.",
    ],
    severity: "Inspect soon",
  },
  wilting: {
    title: "Wilting plants",
    causes: "Wilting can result from drought, waterlogged roots, root damage, or disease.",
    steps: [
      "Check soil moisture near the roots.",
      "Inspect drainage and look for root damage.",
      "Compare affected plants with nearby healthy plants.",
      "Avoid adding water automatically if the soil is already wet.",
    ],
    severity: "Check promptly",
  },
  insects: {
    title: "Visible insects or pest damage",
    causes: "Chewed leaves, holes, webbing, or insects may indicate pest activity.",
    steps: [
      "Inspect leaf undersides, stems, and new growth.",
      "Take clear photos of the pest and the damage.",
      "Record how many plants are affected.",
      "Confirm pest identification with an agricultural expert before treatment.",
    ],
    severity: "Inspect soon",
  },
  rot: {
    title: "Rot or unusual mould",
    causes: "Rot may be associated with excess moisture, poor drainage, storage conditions, or infection.",
    steps: [
      "Separate visibly damaged harvested produce where practical.",
      "Check drainage and moisture around affected plants.",
      "Clean tools and containers appropriately.",
      "Ask an agricultural expert to confirm the cause and safe response.",
    ],
    severity: "Needs attention",
  },
};

export default function DiseaseSupport() {
  const [crop, setCrop] = useState("Ginger");
  const [symptom, setSymptom] = useState("spots");
  const [duration, setDuration] = useState("2–3 days");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(false);

  const selected = guidance[symptom];

  return (
    <main className="disease-page">
      <header className="disease-heading">
        <span className="disease-eyebrow">HALDHARA FARM ASSISTANT</span>
        <h1>Crop Disease & Pest Support</h1>
        <p>Record crop symptoms and explore safe first steps before choosing a treatment.</p>
      </header>

      <div className="disease-notice">
        <span aria-hidden="true">ⓘ</span>
        <div>
          <strong>Guidance tool — not a confirmed diagnosis</strong>
          <p>This demo uses general symptom guidance. It does not analyse crop images or identify a specific disease.</p>
        </div>
      </div>

      <section className="disease-form-card">
        <h2>Describe your crop problem</h2>
        <p className="disease-muted">Select the closest symptoms you can observe.</p>

        <div className="disease-form-grid">
          <label>
            Crop
            <select value={crop} onChange={e => { setCrop(e.target.value); setResult(false); }}>
              {["Ginger", "Potato", "Pineapple", "Orange", "Kiwi", "Turmeric", "Rice", "Maize", "Tomato", "Other"].map(item =>
                <option key={item}>{item}</option>
              )}
            </select>
          </label>

          <label>
            Main symptom
            <select value={symptom} onChange={e => { setSymptom(e.target.value); setResult(false); }}>
              <option value="yellow">Yellowing leaves</option>
              <option value="spots">Spots on leaves</option>
              <option value="wilting">Wilting plants</option>
              <option value="insects">Visible insects or pest damage</option>
              <option value="rot">Rot or unusual mould</option>
            </select>
          </label>

          <label>
            How long has this been happening?
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              <option>Started today</option>
              <option>2–3 days</option>
              <option>About a week</option>
              <option>More than a week</option>
            </select>
          </label>

          <label>
            Additional observations (optional)
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Example: spots on older leaves, recent heavy rain..."
              maxLength={500}
              rows={3}
            />
          </label>
        </div>

        <button className="disease-primary-button" onClick={() => setResult(true)} type="button">
          Get initial guidance
        </button>
      </section>

      {result && (
        <section className="disease-result" aria-live="polite">
          <div className="disease-result-header">
            <span className="disease-result-icon">🌿</span>
            <div>
              <span className="disease-result-label">INITIAL OBSERVATION GUIDE</span>
              <h2>{selected.title}</h2>
              <p>{crop} · Reported duration: {duration}</p>
            </div>
          </div>
          <div className="disease-severity">{selected.severity}</div>
          <p className="disease-cause">{selected.causes}</p>
          <h3>Recommended first steps</h3>
          <ol>
            {selected.steps.map(step => <li key={step}>{step}</li>)}
          </ol>
          {notes.trim() && (
            <div className="disease-observations">
              <strong>Your observations</strong>
              <p>{notes}</p>
            </div>
          )}
          <p className="disease-warning">
            Do not apply pesticides or mix chemicals based only on this result.
            For severe or spreading damage, contact a local agriculture extension
            officer or KVK for crop-specific diagnosis.
          </p>
        </section>
      )}

      <section className="disease-help">
        <span aria-hidden="true">👨‍🌾</span>
        <div>
          <h3>Need a reliable diagnosis?</h3>
          <p>Collect clear photos of the affected plant, note the crop variety and recent weather, and consult a local agricultural expert.</p>
        </div>
      </section>
    </main>
  );
}
