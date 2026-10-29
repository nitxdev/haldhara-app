import { useState } from "react";
import "./CropCalendar.css";

type Task = {
  stage: string;
  period: string;
  icon: string;
  details: string;
};

const calendars: Record<string, Task[]> = {
  Ginger: [
    { stage: "Land preparation", period: "Before planting", icon: "🌱", details: "Prepare well-drained soil and plan suitable planting beds." },
    { stage: "Planting", period: "Seasonal rains", icon: "🌿", details: "Use healthy planting material suited to the local variety and season." },
    { stage: "Crop care", period: "Growing period", icon: "💧", details: "Monitor weeds, soil moisture, drainage and crop health." },
    { stage: "Harvest planning", period: "When mature", icon: "🧺", details: "Check crop maturity and plan labour and transport before harvesting." },
    { stage: "Storage", period: "After harvest", icon: "📦", details: "Handle produce carefully and use clean, suitable storage conditions." },
  ],
  Potato: [
    { stage: "Field preparation", period: "Before planting", icon: "🚜", details: "Prepare suitable soil and check drainage and seed-tuber quality." },
    { stage: "Planting", period: "Locally suitable season", icon: "🌱", details: "Use healthy seed tubers and locally recommended planting practices." },
    { stage: "Crop care", period: "Growing period", icon: "🌿", details: "Monitor moisture, weeds, pests and signs of disease." },
    { stage: "Harvest", period: "At maturity", icon: "🥔", details: "Harvest when mature and avoid unnecessary damage to tubers." },
    { stage: "Storage", period: "After harvest", icon: "📦", details: "Sort damaged tubers and use suitable ventilated storage." },
  ],
  Pineapple: [
    { stage: "Field preparation", period: "Before planting", icon: "🌱", details: "Assess drainage, planting material and field access." },
    { stage: "Planting", period: "Suitable local window", icon: "🍍", details: "Select healthy planting material and follow local spacing advice." },
    { stage: "Crop maintenance", period: "Growing period", icon: "💧", details: "Manage weeds and monitor soil moisture and plant health." },
    { stage: "Harvest planning", period: "At fruit maturity", icon: "🧺", details: "Assess fruit maturity and coordinate buyers and transport." },
    { stage: "Post-harvest", period: "After harvest", icon: "📦", details: "Handle fruit gently and minimise time in unsuitable conditions." },
  ],
  Orange: [
    { stage: "Orchard inspection", period: "Throughout the year", icon: "🌳", details: "Inspect tree health, drainage and signs of pests or disease." },
    { stage: "Flowering", period: "Variety and location dependent", icon: "🌼", details: "Monitor flowering and follow local orchard management advice." },
    { stage: "Fruit development", period: "Growing period", icon: "🍊", details: "Check moisture, nutrition and fruit health." },
    { stage: "Harvest", period: "When fruit matures", icon: "🧺", details: "Check maturity and plan careful picking and grading." },
    { stage: "Marketing", period: "Before and after harvest", icon: "🤝", details: "Compare buyer offers and arrange packaging and transport." },
  ],
  Kiwi: [
    { stage: "Orchard preparation", period: "Before planting", icon: "🌱", details: "Check local suitability, drainage, support structures and planting material." },
    { stage: "Vine management", period: "Seasonal growth", icon: "🌿", details: "Manage vine training and pruning using local expert guidance." },
    { stage: "Flowering and fruit set", period: "Variety dependent", icon: "🌼", details: "Monitor flowering, pollination and developing fruit." },
    { stage: "Harvest assessment", period: "At suitable maturity", icon: "🥝", details: "Use variety-specific maturity indicators rather than calendar dates alone." },
    { stage: "Post-harvest", period: "After picking", icon: "📦", details: "Grade fruit and follow suitable storage and handling practices." },
  ],
  Turmeric: [
    { stage: "Land preparation", period: "Before planting", icon: "🌱", details: "Prepare suitable beds and check drainage." },
    { stage: "Planting", period: "Locally suitable planting window", icon: "🌿", details: "Use healthy rhizomes and locally recommended practices." },
    { stage: "Crop care", period: "Growing period", icon: "💧", details: "Monitor weeds, moisture and crop health." },
    { stage: "Harvest", period: "At maturity", icon: "🧺", details: "Assess maturity and prepare clean harvesting equipment." },
    { stage: "Processing", period: "After harvest", icon: "📦", details: "Follow appropriate cleaning, curing and drying practices." },
  ],
};

const crops = Object.keys(calendars);

export default function CropCalendar() {
  const [crop, setCrop] = useState("Ginger");
  const [region, setRegion] = useState("Arunachal Pradesh");
  const [completed, setCompleted] = useState<string[]>([]);

  const tasks = calendars[crop];

  return (
    <main className="calendar-page">
      <header className="calendar-heading">
        <span className="calendar-eyebrow">HALDHARA SEASONAL PLANNER</span>
        <h1>Crop Calendar</h1>
        <p>Organise farm activities from field preparation through harvest and storage.</p>
      </header>

      <div className="calendar-notice">
        <strong>Indicative planning guide.</strong> These are crop-care stages, not verified local sowing or harvest dates.
        Confirm timing with your local KVK or agriculture department.
      </div>

      <section className="calendar-card">
        <div className="calendar-filters">
          <label>Choose crop
            <select value={crop} onChange={e => { setCrop(e.target.value); setCompleted([]); }}>
              {crops.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Region
            <select value={region} onChange={e => setRegion(e.target.value)}>
              {["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"].map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="calendar-summary">
          <div><span>🌾</span><small>Selected crop</small><strong>{crop}</strong></div>
          <div><span>📍</span><small>Planning region</small><strong>{region}</strong></div>
          <div><span>✅</span><small>Completed stages</small><strong>{completed.length} / {tasks.length}</strong></div>
        </div>
      </section>

      <section className="calendar-card">
        <div className="calendar-section-title">
          <div><h2>Crop activity timeline</h2><p>Mark each stage as you complete it.</p></div>
        </div>
        <div className="calendar-progress"><div style={{ width: `${completed.length / tasks.length * 100}%` }} /></div>
        <div className="calendar-timeline">
          {tasks.map((task, index) => {
            const isDone = completed.includes(task.stage);
            return (
              <article key={task.stage} className={isDone ? "calendar-task is-complete" : "calendar-task"}>
                <div className="calendar-step">{isDone ? "✓" : index + 1}</div>
                <div className="calendar-task-icon">{task.icon}</div>
                <div className="calendar-task-content">
                  <span className="calendar-period">{task.period}</span>
                  <h3>{task.stage}</h3>
                  <p>{task.details}</p>
                </div>
                <button type="button" onClick={() => setCompleted(old => isDone ? old.filter(x => x !== task.stage) : [...old, task.stage])}>
                  {isDone ? "Completed ✓" : "Mark done"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <p className="calendar-footnote">
        Demo only: selected region does not automatically adjust crop dates, and progress is not saved.
        Actual schedules vary with altitude, variety, rainfall and local farming practices.
      </p>
    </main>
  );
}
