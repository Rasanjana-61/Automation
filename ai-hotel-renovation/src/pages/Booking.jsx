import { useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  hotelId: "",
  roomType: "",
  checkIn: "",
  checkOut: "",
  guests: 2
};

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Submitting booking...");
    try {
      const response = await api.post("/bookings", {
        ...form,
        total: 0
      });
      setStatus(`Booking confirmed! Reference: ${response.data.id}`);
      setForm(initialForm);
    } catch (error) {
      setStatus("We could not process the booking. Try again.");
    }
  };

  return (
    <main className="section">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="pill w-fit">Booking form</p>
          <h2 className="mt-4 text-3xl font-semibold text-ocean">
            Reserve your room.
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Fill in guest details and let our AI concierge confirm availability.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-4 rounded-3xl border border-ink/10 bg-white p-6"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              type="email"
              className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="hotelId"
                value={form.hotelId}
                onChange={handleChange}
                placeholder="Hotel ID (e.g. h1)"
                className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
                required
              />
              <input
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                placeholder="Room type"
                className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                type="date"
                className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
                required
              />
              <input
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                type="date"
                className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
                required
              />
            </div>
            <input
              name="guests"
              value={form.guests}
              onChange={handleChange}
              type="number"
              min="1"
              className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
            />
            <button type="submit" className="button-primary w-fit">
              Confirm booking
            </button>
            {status && <p className="text-sm text-ink/60">{status}</p>}
          </form>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-ocean">AI booking tips</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            <li>Book mid-week for the lowest average daily rate.</li>
            <li>Ask the AI concierge for flexible date options.</li>
            <li>Upgrade suggestions appear after you confirm.</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              AI recommendation
            </p>
            <p className="mt-2 text-sm text-ink/70">
              Family of four? Skyline Atelier has connecting suites with a
              20% package discount this week.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
