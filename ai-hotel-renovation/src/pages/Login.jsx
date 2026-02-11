import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/profile";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="section">
      <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-white p-8">
        <p className="pill w-fit">Welcome back</p>
        <h2 className="mt-4 text-3xl font-semibold text-ocean">Login</h2>
        <p className="mt-2 text-sm text-ink/60">
          Access your bookings, profile, and recommendations.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/60">
          No account?{" "}
          <Link to="/register" className="font-semibold text-ocean">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
