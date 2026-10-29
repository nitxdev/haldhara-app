import { useState, type FormEvent } from "react";
import "./BuyerRequirementForm.css";

export default function BuyerRequirementForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const [cropName, setCropName] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("haldhara_token");
    if (!token) {
      setMessage("Please log in before posting a requirement.");
      return;
    }

    if (new Date(requiredBy).getTime() <= Date.now()) {
      setMessage("Please select a future required-by date.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5001/api/buyer-requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName,
          quantityKg: Number(quantityKg),
          targetPricePerKg: Number(targetPrice),
          deliveryLocation,
          requiredBy,
          notes,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not post the requirement.");
      }

      setMessage("Buyer requirement posted successfully!");
      setCropName("");
      setQuantityKg("");
      setTargetPrice("");
      setDeliveryLocation("");
      setRequiredBy("");
      setNotes("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="buyer-requirement-page">
      <header>
        <span className="buyer-requirement-eyebrow">HALDHARA MARKETPLACE</span>
        <h1>Post a Crop Requirement</h1>
        <p>Tell farmers what you need, how much you need and where it should be delivered.</p>
      </header>

      <form className="buyer-requirement-form" onSubmit={handleSubmit}>
        <label>
          Crop name *
          <select required value={cropName} onChange={(e) => setCropName(e.target.value)}>
            <option value="">Select crop</option>
            <option>Ginger</option>
            <option>Potato</option>
            <option>Pineapple</option>
            <option>Orange</option>
            <option>Kiwi</option>
            <option>Turmeric</option>
            <option>Rice</option>
            <option>Other</option>
          </select>
        </label>

        <div className="buyer-requirement-row">
          <label>
            Required quantity (kg) *
            <input type="number" min="0.01" step="any" required
              value={quantityKg} onChange={(e) => setQuantityKg(e.target.value)}
              placeholder="e.g. 500" />
          </label>
          <label>
            Target price (₹/kg) *
            <input type="number" min="0.01" step="0.01" required
              value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 75" />
          </label>
        </div>

        <label>
          Delivery location *
          <input required value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            placeholder="District, town or village" />
        </label>

        <label>
          Required by *
          <input type="date" required min={new Date().toLocaleDateString("en-CA")}
            value={requiredBy} onChange={(e) => setRequiredBy(e.target.value)} />
        </label>

        <label>
          Additional requirements
          <textarea rows={4} maxLength={1000} value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Quality, packaging, delivery or harvest details..." />
        </label>

        {message && <p className="buyer-requirement-message" role="status">{message}</p>}

        <div className="buyer-requirement-actions">
          {onCancel && (
            <button type="button" className="buyer-requirement-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" disabled={submitting} className="buyer-requirement-submit">
            {submitting ? "Posting..." : "Post Requirement"}
          </button>
        </div>
      </form>
    </section>
  );
}
