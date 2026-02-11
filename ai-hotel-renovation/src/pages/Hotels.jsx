import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import sampleHotels from "../data/sampleHotels";
import HotelCard from "../components/HotelCard";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(250);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await api.get("/hotels");
        setHotels(response.data);
      } catch (error) {
        setHotels(sampleHotels);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return hotels.filter(
      (hotel) =>
        (hotel.name.toLowerCase().includes(term) ||
          hotel.location.toLowerCase().includes(term)) &&
        hotel.pricePerNight <= maxPrice
    );
  }, [hotels, query, maxPrice]);

  return (
    <main className="section">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="pill w-fit">Hotel inventory</p>
          <h2 className="mt-4 text-3xl font-semibold text-ocean">
            Find the perfect stay.
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Search across curated hotels with AI-enhanced availability checks.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or city"
            className="w-64 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sun/40"
          />
          <div className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm">
            Max price: ${maxPrice}
            <input
              type="range"
              min="80"
              max="300"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="ml-3 w-24 align-middle accent-sun"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/60">Loading hotels...</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-ink/20 p-6 text-sm text-ink/60">
              No hotels match those filters. Try a higher price or a different
              city.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
