import { useState } from "react";
import api from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help you find the best rooms, prices, and dates. Ask me anything."
    }
  ]);
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await api.post("/ai/chat", { message: userMessage.content });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am offline right now. Please try again in a moment."
        }
      ]);
    }
  };

  const handleRecommendation = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await api.post("/ai/recommend", payload);
      setRecommendation(response.data);
    } catch (error) {
      setRecommendation({
        message: "Recommendation engine is offline. Try again later."
      });
    }
  };

  return (
    <main className="section">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-ink/10 bg-white p-6">
          <h2 className="text-2xl font-semibold text-ocean">AI Concierge</h2>
          <p className="mt-2 text-sm text-ink/60">
            Ask about availability, pricing, or cancellation policies.
          </p>
          <div className="mt-6 h-80 space-y-4 overflow-y-auto rounded-2xl bg-mist p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-ocean text-white"
                    : "bg-white text-ink"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder="Ask the concierge..."
              className="flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm"
            />
            <button onClick={sendMessage} className="button-primary">
              Send
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-ocean">
            AI room recommendation
          </h3>
          <form onSubmit={handleRecommendation} className="mt-4 space-y-3 text-sm">
            <input
              name="budget"
              placeholder="Budget per night (e.g. 150)"
              className="w-full rounded-2xl border border-ink/10 px-4 py-3"
              required
            />
            <input
              name="guests"
              placeholder="Guests (e.g. 2)"
              className="w-full rounded-2xl border border-ink/10 px-4 py-3"
              required
            />
            <input
              name="dates"
              placeholder="Dates (e.g. 15-18 March)"
              className="w-full rounded-2xl border border-ink/10 px-4 py-3"
              required
            />
            <input
              name="preferences"
              placeholder="Preferences (e.g. ocean view, spa)"
              className="w-full rounded-2xl border border-ink/10 px-4 py-3"
            />
            <button className="button-primary" type="submit">
              Get recommendation
            </button>
          </form>
          {recommendation && (
            <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-ink/70">
              <p className="font-semibold text-ocean">
                {recommendation.hotel || "AI suggestion"}
              </p>
              <p className="mt-2">{recommendation.message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
