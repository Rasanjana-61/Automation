import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });
      navigate("/profile", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="section">
      <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-white p-8">
        <p className="pill w-fit">Create account</p>
        <h2 className="mt-4 text-3xl font-semibold text-ocean">Register</h2>
        <p className="mt-2 text-sm text-ink/60">
          Use a strong password with uppercase, lowercase, and a number.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            required
            placeholder="Full name"
            className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
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
          <input
            type="password"
            required
            placeholder="Confirm password"
            className="rounded-2xl border border-ink/10 px-4 py-3 text-sm"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm({ ...form, confirmPassword: event.target.value })
            }
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/60">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-ocean">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
