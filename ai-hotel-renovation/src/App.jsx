const timeline = [
  {
    title: "Scan + Forecast",
    text: "We ingest floor plans, asset tags, and guest feedback to forecast revenue lift and downtime risk."
  },
  {
    title: "Design with AI",
    text: "Generative concepts validate sightlines, circulation, and brand character in hours, not weeks."
  },
  {
    title: "Smart Phasing",
    text: "Schedule work by wing and occupancy, keeping cashflow steady while contractors move fast."
  },
  {
    title: "Live Optimization",
    text: "Computer vision and IoT sensors keep crews aligned and capture progress for stakeholders."
  }
];

const metrics = [
  { value: "38%", label: "Faster closures" },
  { value: "24%", label: "Lower retrofit cost" },
  { value: "4.8", label: "Projected guest rating" },
  { value: "90 days", label: "Average turnaround" }
];

const capabilities = [
  "Vision-led design sprints powered by generative AI",
  "Material sourcing with embodied carbon tracking",
  "Renovation phasing tuned to occupancy forecasts",
  "Digital twin dashboards for investors and owners",
  "Adaptive lighting, HVAC, and acoustic intelligence"
];

const testimonials = [
  {
    name: "Rene Alvarez",
    role: "Asset Manager, Northline Hospitality",
    quote:
      "We reopened two weeks early and gained a full point on guest satisfaction. The AI phasing model saved us from a full closure."
  },
  {
    name: "Aria Jensen",
    role: "COO, Driftwood Resorts",
    quote:
      "The concept visuals landed instantly with our board. The renovation strategy felt precise, not risky."
  }
];

const gallery = [
  {
    name: "Skyline Atrium",
    text: "Daylight-driven lobby with AI tuned acoustics and layered stone textures."
  },
  {
    name: "Suite 2.0",
    text: "Modular suites with dynamic lighting and reclaimed walnut." 
  },
  {
    name: "Wellness Deck",
    text: "Biofiltration walls, saunas, and hydrotherapy zones for longer stays."
  }
];

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <div className="logo">ALTO RENOVATE</div>
          <div className="nav-actions">
            <button className="ghost">Project Map</button>
            <button className="solid">Book a Consult</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI-POWERED HOTEL RENOVATION</p>
            <h1>
              Reinvent hospitality spaces in under 100 days.
            </h1>
            <p className="lede">
              ALTO pairs interior architects with AI forecasting to deliver high-occupancy renovations, smarter phasing, and measurable guest delight.
            </p>
            <div className="hero-actions">
              <button className="solid">Request the Strategy Deck</button>
              <button className="ghost">View Sample Renovation</button>
            </div>
            <div className="badge-row">
              <div className="badge">Digital Twin Enabled</div>
              <div className="badge">Carbon-Aware Materials</div>
              <div className="badge">AI Budget Control</div>
            </div>
          </div>
          <div className="hero-card">
            <h3>Renovation Signal Stack</h3>
            <p>
              128 sensors, 42 AI models, and a collaborative builder workspace that keeps owners, designers, and operations in lockstep.
            </p>
            <div className="stack">
              <div>
                <span>Occupancy AI</span>
                <strong>Realtime forecast</strong>
              </div>
              <div>
                <span>Design Engine</span>
                <strong>1,200 layouts tested</strong>
              </div>
              <div>
                <span>Budget Guard</span>
                <strong>2.1% variance</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric">
            <span>{metric.value}</span>
            <p>{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>From aging asset to flagship destination.</h2>
          <p>
            We orchestrate design, procurement, and operations with a single AI brain, balancing daily revenue with a bold new guest experience.
          </p>
        </div>
        <div className="feature-grid">
          {capabilities.map((item) => (
            <div key={item} className="feature">
              <h4>{item}</h4>
              <p>
                Our specialists pair data science with material artistry to keep every decision aligned to ROI and brand energy.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="section-head">
          <h2>AI-guided renovation timeline.</h2>
          <p>
            Clear phases, zero guesswork. Our system adjusts schedules daily based on occupancy, supply chain, and onsite scans.
          </p>
        </div>
        <div className="timeline">
          {timeline.map((step) => (
            <div key={step.title} className="timeline-item">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Signature renovation moments.</h2>
          <p>
            A modular system of suites, social hubs, and wellness zones redesigned for new traveler expectations.
          </p>
        </div>
        <div className="gallery">
          {gallery.map((item) => (
            <article key={item.name} className="gallery-card">
              <div className="gallery-frame"></div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split">
        <div className="split-panel">
          <h2>Renovation control center.</h2>
          <p>
            Track everything from procurement to live occupancy impact. Owners get a command map with live progress, approvals, and risk alerts.
          </p>
          <ul>
            <li>Live phasing impact on ADR and RevPAR</li>
            <li>AI bid leveling and vendor scorecards</li>
            <li>Guest experience simulation across key journeys</li>
          </ul>
        </div>
        <div className="split-panel glass">
          <h3>Executive Snapshot</h3>
          <div className="snapshot">
            <div>
              <span>Budget Health</span>
              <strong>98% on track</strong>
            </div>
            <div>
              <span>Guest Disruption</span>
              <strong>Low</strong>
            </div>
            <div>
              <span>Carbon Score</span>
              <strong>A-</strong>
            </div>
          </div>
          <button className="ghost">Download Sample Dashboard</button>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Operators already upgrading with ALTO.</h2>
          <p>
            We partner with boutique, legacy, and flagship portfolios to elevate their spaces without pausing revenue.
          </p>
        </div>
        <div className="testimonials">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial">
              <p>"{t.quote}"</p>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div>
          <h2>Ready to open the next chapter?</h2>
          <p>
            Get a tailored AI renovation blueprint, timeline, and live ROI forecast within 7 days.
          </p>
        </div>
        <button className="solid">Start the Renovation Sprint</button>
      </section>

      <footer className="footer">
        <div>
          <strong>ALTO RENOVATE</strong>
          <p>AI-powered hospitality renovation studio. Los Angeles · Miami · Copenhagen</p>
        </div>
        <div className="footer-links">
          <span>Renovation Strategy</span>
          <span>Digital Twin</span>
          <span>Investor Relations</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}
