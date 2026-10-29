import { useEffect, useState } from "react";

type FeastBooking = {
  _id?: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  location: string;
  guests: number;
  crops: string;
  budget: number;
  notes?: string;
  status?: string;
};

const API = "http://localhost:5001/api/feast";

export default function BookForFeast() {
  const [form, setForm] = useState<FeastBooking>({
    eventName: "",
    eventType: "Community Feast",
    eventDate: "",
    location: "",
    guests: 50,
    crops: "",
    budget: 5000,
    notes: "",
  });

  const [bookings, setBookings] = useState<FeastBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    const token = localStorage.getItem("haldhara_token");
    if (!token) {
      setMessage("Please log in before viewing your bookings.");
      return;
    }

    try {
      const response = await fetch(`${API}/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Could not load bookings");

      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load bookings");
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  function update<K extends keyof FeastBooking>(key: K, value: FeastBooking[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("haldhara_token");
    if (!token) {
      setMessage("Please log in before creating a booking.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Booking failed");

      setMessage("Booking saved successfully!");
      setForm({
        eventName: "",
        eventType: "Community Feast",
        eventDate: "",
        location: "",
        guests: 50,
        crops: "",
        budget: 5000,
        notes: "",
      });

      await loadBookings();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  const field: React.CSSProperties = {
    width: "100%",
    padding: 11,
    border: "1px solid #d7e0d5",
    borderRadius: 9,
    boxSizing: "border-box",
    marginTop: 5,
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "#244531" }}>
      <h1>Book for Feast 🍍</h1>
      <p>Arrange fresh crops for community feasts, weddings and festivals.</p>

      <form onSubmit={submitBooking} style={{ display: "grid", gap: 14, padding: 20, border: "1px solid #e0e8dc", borderRadius: 16 }}>
        <label>Event name *
          <input required maxLength={120} style={field} value={form.eventName} onChange={e => update("eventName", e.target.value)} />
        </label>

        <label>Event type
          <select style={field} value={form.eventType} onChange={e => update("eventType", e.target.value)}>
            <option>Community Feast</option>
            <option>Wedding</option>
            <option>Festival</option>
            <option>Village Event</option>
            <option>Other</option>
          </select>
        </label>

        <label>Event date *
          <input required type="date" min={new Date().toISOString().slice(0, 10)} style={field} value={form.eventDate} onChange={e => update("eventDate", e.target.value)} />
        </label>

        <label>Delivery location *
          <input required maxLength={200} style={field} value={form.location} onChange={e => update("location", e.target.value)} />
        </label>

        <label>Number of guests
          <input required type="number" min={1} style={field} value={form.guests} onChange={e => update("guests", Number(e.target.value))} />
        </label>

        <label>Budget (₹)
          <input required type="number" min={0} style={field} value={form.budget} onChange={e => update("budget", Number(e.target.value))} />
        </label>

        <label>Crops required *
          <textarea required maxLength={2000} style={field} rows={3} placeholder="Potato 50 kg, ginger 10 kg..." value={form.crops} onChange={e => update("crops", e.target.value)} />
        </label>

        <label>Additional notes
          <textarea maxLength={2000} style={field} rows={2} value={form.notes || ""} onChange={e => update("notes", e.target.value)} />
        </label>

        <button disabled={loading} type="submit" style={{ padding: 13, border: 0, borderRadius: 10, background: "#286844", color: "white", fontWeight: 700 }}>
          {loading ? "Saving..." : "Create Feast Booking"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <section style={{ marginTop: 28 }}>
        <h2>Your bookings</h2>
        {bookings.length === 0 && <p>No saved bookings yet.</p>}
        {bookings.map((booking, index) => (
          <article key={booking._id || index} style={{ border: "1px solid #e0e8dc", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <h3>{booking.eventName}</h3>
            <p>{booking.eventType} · {new Date(booking.eventDate).toLocaleDateString("en-IN")}</p>
            <p>📍 {booking.location} · 👥 {booking.guests} guests</p>
            <p>🌾 {booking.crops}</p>
            <p>Budget: ₹{booking.budget.toLocaleString("en-IN")}</p>
            <p>Status: {booking.status || "pending"}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
