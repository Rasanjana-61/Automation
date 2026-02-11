import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <article className="glass-panel flex h-full flex-col gap-4 rounded-3xl p-6">
      <div className="h-32 rounded-2xl bg-gradient-to-br from-sun/40 via-white to-coral/30" />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ocean">{hotel.name}</h3>
          <p className="text-sm text-ink/60">{hotel.location}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink/50">Per night</p>
          <p className="text-lg font-semibold text-ocean">${hotel.pricePerNight}</p>
        </div>
      </div>
      <p className="text-sm text-ink/70">{hotel.description}</p>
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.slice(0, 3).map((amenity) => (
          <span key={amenity} className="pill">
            {amenity}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-ink/60">{hotel.roomsAvailable} rooms left</span>
        <Link to={`/hotels/${hotel.id}`} className="font-semibold text-ocean">
          View details →
        </Link>
      </div>
    </article>
  );
}
