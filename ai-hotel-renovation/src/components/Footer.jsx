export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white/70 px-6 py-10 md:px-12 lg:px-20">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">
            SmartStay AI
          </p>
          <h2 className="text-lg font-semibold text-ocean">
            AI-powered hotel reservations
          </h2>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-ink/60">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
          <span>Contact</span>
        </div>
      </div>
      <p className="mt-6 text-xs text-ink/40">
        Built for hospitality teams who want smarter bookings, better prices,
        and a concierge that never sleeps.
      </p>
    </footer>
  );
}
