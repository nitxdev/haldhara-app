import { useState } from "react";
import "./WeatherAlerts.css";

const days = [
  ["Today", "🌦️", "Cloudy", 19, 27, 45],
  ["Tomorrow", "🌧️", "Rain", 18, 24, 80],
  ["Day 3", "⛅", "Partly cloudy", 19, 28, 25],
  ["Day 4", "🌤️", "Mostly sunny", 20, 29, 10],
  ["Day 5", "🌦️", "Light showers", 19, 26, 55],
] as const;

const advice = [
  ["🌱", "Inspect crops", "Check leaves and stems for pests or disease, especially after wet weather."],
  ["💧", "Check soil moisture", "Avoid unnecessary irrigation when soil is already wet."],
  ["🧺", "Plan harvesting", "Plan harvesting and drying around actual field and weather conditions."],
];

export default function WeatherAlerts() {
  const [region, setRegion] = useState("Itanagar");
  const [enabled, setEnabled] = useState(false);

  return (
    <main className="weather-page">
      <header className="weather-heading">
        <div>
          <span className="weather-eyebrow">HALDHARA FARM TOOLS</span>
          <h1>Weather & Crop Alerts</h1>
          <p>Make informed farming decisions with weather awareness.</p>
        </div>
        <label className="weather-region">
          Your region
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {["Itanagar", "Pasighat", "Ziro", "Tawang", "Guwahati", "Imphal", "Aizawl", "Kohima", "Shillong", "Agartala", "Gangtok"].map(place =>
              <option key={place}>{place}</option>
            )}
          </select>
        </label>
      </header>

      <div className="weather-demo-notice">
        <strong>ⓘ DEMO DATA — NOT A LIVE FORECAST</strong>
        <p>Sample weather values for {region}. Connect a weather API before using these values for farm decisions.</p>
      </div>

      <section className="weather-current">
        <div>
          <span>SELECTED REGION</span>
          <h2>{region}</h2>
          <div className="weather-temp">27°C <span>🌦️</span></div>
          <strong>Illustrative conditions</strong>
        </div>
        <div className="weather-stats">
          <div><span>Rain chance</span><strong>45%</strong></div>
          <div><span>Humidity</span><strong>78%</strong></div>
          <div><span>Wind</span><strong>8 km/h</strong></div>
        </div>
      </section>

      <section className="weather-section">
        <h2>5-day outlook</h2>
        <p className="weather-muted">Illustrative values only</p>
        <div className="weather-days">
          {days.map(([day, icon, condition, min, max, rain]) => (
            <article className="weather-day" key={day}>
              <strong>{day}</strong>
              <span className="weather-icon">{icon}</span>
              <span>{condition}</span>
              <strong>{max}° <span className="weather-muted">{min}°</span></strong>
              <span className="weather-rain">☔ {rain}% rain</span>
              <div className="weather-bar"><div style={{ width: `${rain}%` }} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="weather-section">
        <h2>Farming advice</h2>
        <p className="weather-muted">General guidance — check actual field conditions.</p>
        <div className="weather-advice">
          {advice.map(([icon, title, description]) => (
            <article key={title}>
              <span className="weather-advice-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weather-alert-box">
        <div>
          <h3>Weather alert preferences</h3>
          <p>{enabled ? "Preference enabled in this demo; notifications are not sent." : "Choose whether to enable this demo preference."}</p>
        </div>
        <button type="button" onClick={() => setEnabled(v => !v)}>
          {enabled ? "Enabled ✓" : "Enable alerts"}
        </button>
      </section>

      <p className="weather-footnote">Demo only: no live weather, saved preferences, or automatic notifications are connected.</p>
    </main>
  );
}
