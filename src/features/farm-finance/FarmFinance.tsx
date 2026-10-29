import { useState } from "react";
import "./FarmFinance.css";

type Entry = {
  id: number;
  type: "Income" | "Expense";
  category: string;
  crop: string;
  amount: number;
  date: string;
  note: string;
};

export default function FarmFinance() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [category, setCategory] = useState("Seeds");
  const [crop, setCrop] = useState("Ginger");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [note, setNote] = useState("");

  const money = (n: number) => n.toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  });

  const income = entries.filter(e => e.type === "Income").reduce((s, e) => s + e.amount, 0);
  const expenses = entries.filter(e => e.type === "Expense").reduce((s, e) => s + e.amount, 0);
  const balance = income - expenses;

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;

    setEntries(old => [{
      id: Date.now(),
      type,
      category,
      crop,
      amount: value,
      date,
      note: note.trim(),
    }, ...old]);

    setAmount("");
    setNote("");
  }

  return (
    <main className="finance-page">
      <header className="finance-heading">
        <span className="finance-eyebrow">HALDHARA FARM MANAGEMENT</span>
        <h1>Expense & Income Tracker</h1>
        <p>Record farm spending and crop-sale income in one simple place.</p>
      </header>

      <div className="finance-notice">
        <strong>Local demo only.</strong> Entries remain in this page's memory and disappear when it reloads.
        This version does not save records to your account or server.
      </div>

      <section className="finance-summary">
        <article><span>💰 Total income</span><strong>{money(income)}</strong></article>
        <article><span>🧾 Total expenses</span><strong>{money(expenses)}</strong></article>
        <article className={balance < 0 ? "finance-loss" : "finance-balance"}>
          <span>📊 Net balance</span><strong>{money(balance)}</strong>
        </article>
      </section>

      <section className="finance-card">
        <h2>Add a transaction</h2>
        <form onSubmit={addEntry}>
          <div className="finance-type-switch">
            <button type="button" className={type === "Expense" ? "selected expense" : ""} onClick={() => { setType("Expense"); setCategory("Seeds"); }}>Add expense</button>
            <button type="button" className={type === "Income" ? "selected income" : ""} onClick={() => { setType("Income"); setCategory("Crop sale"); }}>Add income</button>
          </div>

          <div className="finance-fields">
            <label>Category
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {(type === "Expense"
                  ? ["Seeds", "Labour", "Fertilizer", "Equipment", "Irrigation", "Transport", "Packaging", "Land rent", "Other"]
                  : ["Crop sale", "Buyer payment", "Subsidy", "Other income"]
                ).map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Crop
              <select value={crop} onChange={e => setCrop(e.target.value)}>
                {["Ginger", "Potato", "Pineapple", "Orange", "Kiwi", "Turmeric", "Rice", "Maize", "All crops"].map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Amount (₹)
              <input type="number" min="0.01" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
            </label>
            <label>Date
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </label>
            <label className="finance-note-field">Note (optional)
              <input maxLength={160} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Sold 50 kg at local market" />
            </label>
          </div>
          <button className="finance-submit" type="submit">Save {type.toLowerCase()}</button>
        </form>
      </section>

      <section className="finance-card">
        <div className="finance-list-heading">
          <div><h2>Transaction history</h2><p>{entries.length} record{entries.length === 1 ? "" : "s"} in this session</p></div>
          {entries.length > 0 && <button className="finance-clear" type="button" onClick={() => { if (window.confirm("Clear all transactions in this session?")) setEntries([]); }}>Clear all</button>}
        </div>

        {entries.length === 0 ? (
          <div className="finance-empty">
            <span>📒</span>
            <strong>No transactions yet</strong>
            <p>Add your first farm expense or crop-sale income above.</p>
          </div>
        ) : (
          <div className="finance-table-wrap">
            <table className="finance-table">
              <thead><tr><th>Date</th><th>Details</th><th>Crop</th><th>Type</th><th>Amount</th><th>Action</th></tr></thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td><strong>{entry.category}</strong>{entry.note && <small>{entry.note}</small>}</td>
                    <td>{entry.crop}</td>
                    <td><span className={entry.type === "Income" ? "finance-pill in" : "finance-pill out"}>{entry.type}</span></td>
                    <td className={entry.type === "Income" ? "finance-income-value" : "finance-expense-value"}>{entry.type === "Income" ? "+" : "−"}{money(entry.amount)}</td>
                    <td><button className="finance-delete" type="button" aria-label={`Delete ${entry.category}`} onClick={() => setEntries(old => old.filter(item => item.id !== entry.id))}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="finance-footnote">Keep receipts and buyer payment records. Include all relevant costs when calculating crop profitability. This tool is not an accounting or tax filing service.</p>
    </main>
  );
}
