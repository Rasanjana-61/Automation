import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="section">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="pill w-fit">AI-powered hotel reservations</p>
            <h1 className="text-4xl font-semibold text-ocean md:text-5xl">
              Book smarter stays with real-time availability and AI guidance.
            </h1>
            <p className="max-w-xl text-lg text-ink/70">
              SmartStay AI blends live inventory, dynamic pricing, and a
              24/7 concierge to help guests choose the right room at the right
              time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/hotels" className="button-primary">
                Explore hotels
              </Link>
              <Link to="/chatbot" className="button-secondary">
                Talk to the AI concierge
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-ink/60">
              <span>AI availability checks</span>
              <span>Smart price suggestions</span>
              <span>Instant booking confirmation</span>
            </div>
          </div>
          <div className="glass-panel rounded-[32px] p-6">
            <h2 className="text-xl font-semibold text-ocean">
              Live booking pulse
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              1,482 travelers are browsing right now. AI predicts a 12% surge in
              weekend demand.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white px-4 py-3 shadow">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  Occupancy forecast
                </p>
                <p className="text-xl font-semibold text-ocean">86%</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  Best value window
                </p>
                <p className="text-xl font-semibold text-ocean">Mon - Wed</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  AI recommendation
                </p>
                <p className="text-xl font-semibold text-ocean">
                  Skyline Atelier
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white/70">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Search with intent",
              text: "AI highlights hotels that match your budget, mood, and travel style."
            },
            {
              title: "Predictive pricing",
              text: "We surface the best nights to book before rates spike."
            },
            {
              title: "Concierge support",
              text: "Chat instantly for room upgrades, flexible dates, or cancellations."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-ink/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-ocean">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-ocean">
              Built for hotels that want higher occupancy with less effort.
            </h2>
            <p className="mt-4 text-ink/70">
              SmartStay AI connects booking teams, revenue managers, and
              front-desk operations in one command center. Our AI keeps
              availability accurate, pricing sharp, and guest satisfaction high.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="pill">Live inventory sync</span>
              <span className="pill">Room upgrade AI</span>
              <span className="pill">Guest intent signals</span>
            </div>
          </div>
          <div className="rounded-[32px] bg-gradient-to-br from-ocean via-[#1d3f58] to-[#0b1b29] p-8 text-white">
            <h3 className="text-2xl font-semibold">AI revenue insights</h3>
            <p className="mt-3 text-sm text-white/70">
              Track ADR, RevPAR, and occupancy trends with automated daily
              forecasts.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  RevPAR uplift
                </p>
                <p className="text-2xl font-semibold text-sun">+18%</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  AI booking speed
                </p>
                <p className="text-2xl font-semibold text-sun">2.4x faster</p>
              </div>
            </div>
            <Link to="/booking" className="mt-6 inline-flex button-secondary text-white border-white/40">
              Start a booking
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
