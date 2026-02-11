import { useMemo, useState } from "react";
import api from "../services/api";

const bookingSteps = [
  "room_type",
  "dates",
  "guests",
  "guest_info",
  "confirmation",
  "completed"
];

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Search hotels first, then start a booking from any result card."
    }
  ]);
  const [bookingInput, setBookingInput] = useState("");
  const [sending, setSending] = useState(false);

  const currentStep = session?.currentStep || "idle";
  const progressIndex = bookingSteps.indexOf(currentStep);

  const onSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const response = await api.post("/agent/search", { query });
      setSearchResult(response.data);
    } catch (error) {
      setSearchResult(null);
      setSearchError(error.response?.data?.message || "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const startBooking = async (hotelId, hotelName) => {
    try {
      const response = await api.post("/agent/booking/start", { hotelId });
      setSession(response.data.session);
      setMessages([
        { role: "assistant", content: `Booking flow opened for ${hotelName}.` },
        { role: "assistant", content: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not start booking session." }
      ]);
    }
  };

  const sendBookingMessage = async (event) => {
    event.preventDefault();
    if (!bookingInput.trim() || !session?.sessionId) return;
    const content = bookingInput.trim();
    setBookingInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setSending(true);

    try {
      const response = await api.post("/agent/booking/message", {
        sessionId: session.sessionId,
        message: content
      });
      setSession(response.data.session);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Booking assistant is unavailable." }
      ]);
    } finally {
      setSending(false);
    }
  };

  const cancelBooking = async () => {
    if (!session?.sessionId) return;
    try {
      await api.post("/agent/booking/cancel", { sessionId: session.sessionId });
      setSession(null);
      setMessages((prev) => [...prev, { role: "assistant", content: "Booking cancelled." }]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not cancel booking right now." }
      ]);
    }
  };

  const summary = useMemo(() => searchResult?.summary || null, [searchResult]);

  return (
    <main className="section">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-ink/10 bg-white p-6">
          <h2 className="text-2xl font-semibold text-ocean">
            Smart Hotel Reservation Agent
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Search across hotel options, compare platform prices, and start a
            conversational booking flow.
          </p>

          <form onSubmit={onSearch} className="mt-5 flex flex-wrap gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Try: "Find hotels in Goa under 10000"'
              className="flex-1 rounded-full border border-ink/10 px-4 py-3 text-sm"
            />
            <button className="button-primary" type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search Hotels"}
            </button>
          </form>
          {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}

          {summary && (
            <div className="mt-6 rounded-2xl bg-mist p-4 text-sm text-ink/70">
              <p className="font-semibold text-ocean">Summary</p>
              <p className="mt-1">
                {summary.totalHotels} hotels found. Price range ${summary.minPrice} to $
                {summary.maxPrice}. Avg ${summary.avgPrice}.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(searchResult?.hotels || []).map((hotel) => (
              <article key={hotel.id} className="rounded-2xl border border-ink/10 p-4">
                <h3 className="text-lg font-semibold text-ocean">{hotel.name}</h3>
                <p className="text-xs text-ink/60">{hotel.location}</p>
                <p className="mt-2 text-sm text-ink/70">{hotel.description}</p>
                <div className="mt-3 rounded-xl bg-mist p-3 text-sm">
                  <p>
                    Best deal: <span className="font-semibold">{hotel.bestDeal.site}</span>
                  </p>
                  <p className="font-semibold text-ocean">${hotel.bestDeal.price} / night</p>
                </div>
                <details className="mt-3 text-sm text-ink/70">
                  <summary className="cursor-pointer font-semibold text-ocean">
                    Compare 8 booking sites
                  </summary>
                  <ul className="mt-2 grid gap-1">
                    {hotel.comparisons.map((item) => (
                      <li key={item.site} className="flex justify-between">
                        <span>{item.site}</span>
                        <span>${item.price}</span>
                      </li>
                    ))}
                  </ul>
                </details>
                <button
                  className="button-secondary mt-4"
                  onClick={() => startBooking(hotel.id, hotel.name)}
                >
                  Book this hotel
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-ink/10 bg-white p-6">
          <h3 className="text-xl font-semibold text-ocean">Booking Assistant</h3>
          <p className="mt-1 text-sm text-ink/60">
            Step-by-step conversational booking.
          </p>

          <div className="mt-4 rounded-2xl bg-mist p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Status</p>
            <p className="mt-1 text-sm font-semibold text-ocean">
              {currentStep === "idle" ? "Waiting to start" : currentStep}
            </p>
            <div className="mt-3 grid gap-2">
              {bookingSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2 text-xs">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      progressIndex >= index ? "bg-ocean" : "bg-ink/20"
                    }`}
                  />
                  <span className={progressIndex >= index ? "text-ocean" : "text-ink/60"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 h-64 space-y-3 overflow-y-auto rounded-2xl bg-mist p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto max-w-[85%] bg-ocean text-white"
                    : "max-w-[85%] bg-white text-ink"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={sendBookingMessage} className="mt-3 flex gap-2">
            <input
              value={bookingInput}
              onChange={(event) => setBookingInput(event.target.value)}
              disabled={!session}
              placeholder={
                session
                  ? 'Example: "Deluxe Suite", "2026-03-10 to 2026-03-12", "2 guests", "Name: Alex"'
                  : "Start a booking from search results"
              }
              className="flex-1 rounded-full border border-ink/10 px-4 py-2 text-xs"
            />
            <button className="button-primary px-4 py-2 text-xs" disabled={!session || sending}>
              Send
            </button>
          </form>
          <button
            className="button-secondary mt-3 w-full text-xs"
            onClick={cancelBooking}
            disabled={!session}
          >
            Cancel booking
          </button>
        </aside>
      </div>
    </main>
  );
}
