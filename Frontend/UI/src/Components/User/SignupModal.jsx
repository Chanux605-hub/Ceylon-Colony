import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function SignupModal({ open, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    username: "",
    password: "",
    role: "user", // ✅ added default to prevent "undefined" error
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // ✅ save user
      login(data);

      // ✅ redirect by role
      if (data.user?.role === "farmOwner") {
        window.location.href = "/farmer/profile";
      } else {
        window.location.href = "/user/profile";
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111] w-full max-w-sm rounded-2xl border border-[#FBB01A]/40 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center p-6 border-b border-[#FBB01A]/40">
          <div className="h-12 w-12 rounded-full bg-[#FBB01A] flex items-center justify-center text-black text-xl font-bold">
            🐝
          </div>
          <h2 className="text-xl font-bold text-[#FBB01A] mt-3">Ceylon Colony</h2>
          <p className="text-sm text-white/70">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2 rounded bg-red-500/20 border border-red-400/40 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">📞</span>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">🏠</span>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">🆔</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
          </div>

          {/* ✅ Role Selection */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">🎭</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            >
              <option value="user">Normal User</option>
              <option value="farmOwner">Farm Owner</option>
            </select>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBB01A] text-black font-semibold py-2 rounded-lg hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
