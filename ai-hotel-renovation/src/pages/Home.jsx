import { Link } from "react-router-dom";

const features = [
  "Hotel Search Assistant with up to 15 options per query",
  "Price Comparison Engine across multiple booking platforms",
  "Conversational Booking Flow with guided multi-step input",
  "Summary View with total hotels and price range",
  "Real-time Booking Status with cancel support"
];

const technologies = [
  "React + Tailwind CSS frontend",
  "Node.js + Express backend",
  "MongoDB-ready persistence layer",
  "LLM-ready endpoints for Gemini/OpenAI integration",
  "Pydantic-like response structure through strict JSON schemas"
];

const prompts = [
  "Find hotels in Goa under 10000",
  "Find hotels in Mumbai for next weekend",
  "Book Aurora Bay Resort for 2 guests",
  "Confirm booking"
];

export default function Home() {
  return (
    <main>
      <section className="section">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <p className="pill w-fit">Smart Hotel Reservation Agent</p>
            <h1 className="text-4xl font-semibold text-ocean md:text-5xl">
              AI-powered hotel search, comparison, and conversational booking.
            </h1>
            <p className="max-w-xl text-lg text-ink/70">
              Your site now follows the Smart Hotel Reservation Agent model: search
              hotels, compare rates from multiple platforms, and complete bookings
              through guided chat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/chatbot" className="button-primary">
                Open Reservation Agent
              </Link>
              <Link to="/hotels" className="button-secondary">
                Browse Hotel Catalog
              </Link>
            </div>
          </div>
          <div className="glass-panel rounded-[32px] p-6">
            <h2 className="text-xl font-semibold text-ocean">Live Agent Flow</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-xl bg-white p-3 text-ink/70">
                1. User enters query
              </div>
              <div className="rounded-xl bg-white p-3 text-ink/70">
                2. Agent returns hotel cards + best deals
              </div>
              <div className="rounded-xl bg-white p-3 text-ink/70">
                3. User starts conversational booking
              </div>
              <div className="rounded-xl bg-white p-3 text-ink/70">
                4. Agent validates details and confirms booking
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white/70">
        <h2 className="text-3xl font-semibold text-ocean">Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature} className="rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/75">{feature}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-ocean">Technologies</h2>
            <div className="mt-4 grid gap-3">
              {technologies.map((item) => (
                <p key={item} className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-[30px] bg-gradient-to-br from-ocean via-[#1c425d] to-[#0b1f2f] p-6 text-white">
            <h3 className="text-2xl font-semibold">Sample Prompts</h3>
            <div className="mt-4 grid gap-3">
              {prompts.map((prompt) => (
                <p key={prompt} className="rounded-xl bg-white/10 px-4 py-3 text-sm">
                  {prompt}
                </p>
              ))}
            </div>
            <Link to="/chatbot" className="button-secondary mt-6 inline-flex border-white/40 text-white">
              Run Prompt in Agent
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
