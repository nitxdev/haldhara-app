import { useState } from "react";

type Props = {
  requirementId: string;
  listingId: string;
  maxQuantityKg: number;
  targetPricePerKg: number;
};

export default function SendOfferForm({
  requirementId,
  listingId,
  maxQuantityKg,
  targetPricePerKg,
}: Props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(String(maxQuantityKg));
  const [price, setPrice] = useState(String(targetPricePerKg));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function submitOffer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    const qty = Number(quantity);
    const rate = Number(price);

    if (!Number.isFinite(qty) || qty <= 0 || qty > maxQuantityKg) {
      setNotice(`Quantity must be between 1 and ${maxQuantityKg} kg.`);
      return;
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      setNotice("Enter a valid price per kg.");
      return;
    }

    const token = localStorage.getItem("haldhara_token");
    if (!token) {
      setNotice("Please log in again to send an offer.");
      return;
    }

    try {
      setBusy(true);
      const response = await fetch("http://localhost:5001/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requirementId,
          listingId,
          offeredQuantityKg: qty,
          offeredPricePerKg: rate,
          message: message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Offer could not be sent.");
      }

      setNotice("Offer sent successfully!");
      setOpen(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not send offer.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="send-offer">
      <button
        type="button"
        className="send-offer-toggle"
        onClick={() => {
          setNotice("");
          setOpen((value) => !value);
        }}
      >
        {open ? "Cancel offer" : "Send Offer"}
      </button>

      {open && (
        <form className="send-offer-form" onSubmit={submitOffer}>
          <label>
            Quantity (kg)
            <input
              type="number"
              min="1"
              max={maxQuantityKg}
              step="0.1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <label>
            Your price per kg (₹)
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>

          <label>
            Message (optional)
            <textarea
              maxLength={1000}
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share crop quality, availability or delivery details..."
            />
          </label>

          <button type="submit" disabled={busy}>
            {busy ? "Sending..." : "Submit Offer"}
          </button>
        </form>
      )}

      {notice && (
        <p
          className={`send-offer-notice ${
            notice === "Offer sent successfully!" ? "is-success" : "is-error"
          }`}
          role="status"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
