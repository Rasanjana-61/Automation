import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/hotels", label: "Hotels" },
  { to: "/booking", label: "Booking" },
  { to: "/chatbot", label: "AI Concierge" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean text-white">
            AI
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              SmartStay
            </p>
            <h1 className="text-lg font-semibold text-ocean">SmartStay AI</h1>
          </div>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${
                  isActive ? "text-ocean" : "text-ink/70"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="button-secondary hidden md:inline-flex">
            Investor Deck
          </button>
          <button className="button-primary">Start Booking</button>
        </div>
      </nav>
    </header>
  );
}
