import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function LoginModal({ open, onClose, onForgotPassword }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveErrors, setLiveErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const errs = { email: "", password: "" };
    if (form.email && !isValidEmail(form.email)) {
      errs.email = "Invalid email format";
    }
    if (form.password && form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setLiveErrors(errs);
  }, [form]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(form.email)) {
      setLiveErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return;
    }
    if (form.password.length < 6) {
      setLiveErrors((prev) => ({ ...prev, password: "Password too short" }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(data); // ✅ keep your existing context login

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
          <p className="text-sm text-white/70">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2 rounded bg-red-500/20 border border-red-400/40 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full pl-9 pr-3 py-2 rounded-md bg-[#222] border ${
                  liveErrors.email ? "border-red-500" : "border-[#333]"
                } text-white focus:outline-none focus:ring-2 ${
                  liveErrors.email ? "focus:ring-red-500" : "focus:ring-[#FBB01A]"
                }`}
              />
            </div>
            {liveErrors.email && <p className="text-red-400 text-xs mt-1">{liveErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FBB01A]">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full pl-9 pr-10 py-2 rounded-md bg-[#222] border ${
                  liveErrors.password ? "border-red-500" : "border-[#333]"
                } text-white focus:outline-none focus:ring-2 ${
                  liveErrors.password ? "focus:ring-red-500" : "focus:ring-[#FBB01A]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FBB01A] hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {liveErrors.password && (
              <p className="text-red-400 text-xs mt-1">{liveErrors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <p className="text-right text-xs">
            <button
              type="button"
              onClick={() => {
                if (typeof onForgotPassword === "function") {
                  onForgotPassword();
                  console.log("Forgot Password button clicked");
                } else {
                  console.warn("onForgotPassword not passed!");
                }
              }}
              className="text-[#FBB01A] hover:underline"
            >
              Forgot Password?
            </button>
          </p>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBB01A] text-black font-semibold py-2 rounded-lg hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
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
