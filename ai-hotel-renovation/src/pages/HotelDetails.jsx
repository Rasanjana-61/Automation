import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import sampleHotels from "../data/sampleHotels";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data);
      } catch (error) {
        setHotel(sampleHotels.find((item) => item.id === id));
      }
    };

    loadHotel();
  }, [id]);

  if (!hotel) {
    return (
      <main className="section">
        <p className="text-sm text-ink/60">Loading hotel details...</p>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Link to="/hotels" className="text-sm text-ink/60">
            ← Back to hotels
          </Link>
          <div className="rounded-[32px] bg-gradient-to-br from-sun/30 via-white to-coral/30 p-10">
            <h2 className="text-3xl font-semibold text-ocean">{hotel.name}</h2>
            <p className="mt-2 text-sm text-ink/70">{hotel.location}</p>
            <p className="mt-6 text-ink/70">{hotel.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ocean">Amenities</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {hotel.amenities.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-ocean">Room options</h3>
          <p className="mt-2 text-sm text-ink/60">
            Starting at ${hotel.pricePerNight} per night.
          </p>
          <div className="mt-6 space-y-4">
            {hotel.roomTypes.map((room) => (
              <div key={room} className="rounded-2xl border border-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-ocean">{room}</h4>
                    <p className="text-xs text-ink/60">Flexible cancelation</p>
                  </div>
                  <span className="text-sm font-semibold text-ink/70">
                    ${hotel.pricePerNight + 20}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/booking" className="mt-6 inline-flex button-primary">
            Book this hotel
          </Link>
        </div>
      </div>
    </main>
  );
}
