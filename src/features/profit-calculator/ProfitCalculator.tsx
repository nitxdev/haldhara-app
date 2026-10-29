import { useState } from "react";
import "./ProfitCalculator.css";

export default function ProfitCalculator() {
  const [crop, setCrop] = useState("Ginger");
  const [quantity, setQuantity] = useState("500");
  const [price, setPrice] = useState("85");
  const [seed, setSeed] = useState("3000");
  const [labour, setLabour] = useState("5000");
  const [fertilizer, setFertilizer] = useState("2000");
  const [transport, setTransport] = useState("1500");
  const [other, setOther] = useState("500");

  const n = (value: string) => Math.max(0, Number(value) || 0);
  const qty = n(quantity);
  const rate = n(price);
  const revenue = qty * rate;
  const expenses = n(seed) + n(labour) + n(fertilizer) + n(transport) + n(other);
  const profit = revenue - expenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const breakEven = qty > 0 ? expenses / qty : 0;
  const fmt = (value: number) => value.toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  });

  const expenseFields = [
    ["Seeds / planting material", seed, setSeed],
    ["Labour", labour, setLabour],
    ["Fertilizer / compost", fertilizer, setFertilizer],
    ["Transport / packaging", transport, setTransport],
    ["Other expenses", other, setOther],
  ] as const;

  return (
    <main className="profit-page">
      <header className="profit-header">
        <span className="profit-eyebrow">HALDHARA FARM FINANCE</span>
        <h1>Crop Profit Calculator</h1>
        <p>Estimate crop revenue, production expenses and potential profit.</p>
      </header>

      <div className="profit-notice">
        <strong>Planning estimate only.</strong> Enter your own costs and expected selling price.
        This calculation excludes any costs you have not entered and does not guarantee a sale.
      </div>

      <section className="profit-card">
        <h2>Crop and selling details</h2>
        <div className="profit-fields">
          <label>Crop
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              {["Ginger", "Potato", "Pineapple", "Orange", "Kiwi", "Turmeric", "Rice", "Maize", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Quantity to sell (kg)
            <input type="number" min="0" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </label>
          <label>Expected selling price (₹/kg)
            <input type="number" min="0" step="any" value={price} onChange={e => setPrice(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="profit-card">
        <h2>Production and selling expenses</h2>
        <p className="profit-muted">Enter total expenses in rupees for this crop batch.</p>
        <div className="profit-fields">
          {expenseFields.map(([label, value, setter]) => (
            <label key={label}>{label} (₹)
              <input type="number" min="0" step="any" value={value} onChange={e => setter(e.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <section className="profit-results">
        <article className="profit-result-main">
          <span>ESTIMATED NET PROFIT / LOSS</span>
          <strong className={profit >= 0 ? "profit-positive" : "profit-negative"}>{fmt(profit)}</strong>
          <p>{crop} · {qty.toLocaleString("en-IN")} kg planned</p>
        </article>
        <div className="profit-result-grid">
          <article><span>Expected revenue</span><strong>{fmt(revenue)}</strong></article>
          <article><span>Total entered expenses</span><strong>{fmt(expenses)}</strong></article>
          <article><span>Break-even price</span><strong>{fmt(breakEven)}/kg</strong></article>
          <article><span>Profit margin</span><strong>{revenue > 0 ? `${margin.toFixed(1)}%` : "—"}</strong></article>
        </div>
      </section>

      <section className="profit-card">
        <h2>What this means</h2>
        <p>
          {qty <= 0
            ? "Enter a quantity greater than zero to calculate the break-even price per kilogram."
            : revenue === 0
              ? "Enter an expected selling price to estimate revenue and profit."
              : profit > 0
                ? `At the entered price, your estimated surplus is ${fmt(profit)} before any unentered costs.`
                : profit < 0
                  ? `At the entered price, the estimate shows a shortfall of ${fmt(Math.abs(profit))}. Review costs, yield and realistic market prices.`
                  : "Your entered revenue and expenses are equal. Any additional costs would reduce the result."}
        </p>
        <p className="profit-muted">
          Break-even price = entered total expenses ÷ saleable quantity.
          Profit margin = estimated profit ÷ expected revenue × 100.
        </p>
      </section>

      <p className="profit-footnote">
        Your figures remain in this page's current state only and are not saved to your account.
        Check actual buyer prices, quality deductions, unsold produce, commissions and transport
        charges before making a selling decision.
      </p>
    </main>
  );
}
