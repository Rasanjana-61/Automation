import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    refreshUser().catch(() => null);
  }, [refreshUser]);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) {
        setLoadingBookings(false);
        return;
      }
      try {
        const response = await api.get(`/bookings/user/${user.id}`);
        setBookings(response.data);
      } catch (_error) {
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [user?.id]);

  return (
    <main className="section">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-ink/10 bg-white p-6">
          <p className="pill w-fit">Account</p>
          <h2 className="mt-4 text-3xl font-semibold text-ocean">
            {user?.fullName || "Guest"}
          </h2>
          <p className="mt-1 text-sm text-ink/60">{user?.email || ""}</p>
          <div className="mt-6 rounded-2xl bg-mist p-4 text-sm text-ink/70">
            Session secured with JWT. Bookings and profile are restricted to
            authenticated access.
          </div>
        </section>
        <section className="rounded-3xl border border-ink/10 bg-white p-6">
          <h3 className="text-xl font-semibold text-ocean">My bookings</h3>
          {loadingBookings ? (
            <p className="mt-4 text-sm text-ink/60">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">
              No bookings yet. Complete a reservation to see it here.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-ink/10 bg-mist p-4 text-sm"
                >
                  <p className="font-semibold text-ocean">
                    {booking.hotelId} - {booking.roomType}
                  </p>
                  <p className="text-ink/70">
                    {booking.checkIn} to {booking.checkOut} • {booking.guests} guests
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
