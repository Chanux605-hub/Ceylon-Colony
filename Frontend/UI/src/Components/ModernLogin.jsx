import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModernLogin({ brand = "Ceylon Colony" }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.username.trim() || !values.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      // ⚡ Demo authentication
      const role = values.username === "admin" ? "admin" : "user";

      localStorage.setItem("token", "demo-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ username: values.username, role })
      );

      // ✅ Navigate by role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home"); // home page
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/your-watermark.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Glow accents */}
      <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

      <form
        onSubmit={submit}
        className="relative bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl ring-1 ring-yellow-400/25 p-8"
      >
        <span className="absolute inset-x-0 -top-0.5 h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-t-2xl" />

        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-yellow-400 text-neutral-900 shadow flex items-center justify-center">
            {/* Bee icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c2.2 0 4 1.8 4 4 0 2.3-1.8 4-4 4s-4-1.7-4-4c0-2.2 1.8-4 4-4z" />
              <path d="M7 7c1.5 1.2 3 .9 5 .9s3.5.3 5-.9M9 16c-1.2 1.3-2.6 2.1-4.3 2.4M15 16c1.2 1.3 2.6 2.1 4.3 2.4" />
              <rect x="11" y="2" width="2" height="4" rx="1" />
            </svg>
          </div>
          <h1 className="mt-3 text-xl font-bold text-yellow-400 tracking-tight">
            {brand}
          </h1>
          <p className="mt-1 text-sm text-neutral-300">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm text-neutral-200 mb-1"
          >
            Username
          </label>
          <div className="flex items-center bg-neutral-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 transition">
            <span className="px-3 text-yellow-400">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
              </svg>
            </span>
            <input
              id="username"
              name="username"
              value={values.username}
              onChange={handle}
              type="text"
              placeholder="Enter username"
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-400 py-2 px-2 outline-none"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm text-neutral-200 mb-1"
          >
            Password
          </label>
          <div className="flex items-center bg-neutral-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 transition">
            <span className="px-3 text-yellow-400">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V8a5 5 0 0 1 10 0v3" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              value={values.password}
              onChange={handle}
              type={showPw ? "text" : "password"}
              placeholder="Enter password"
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-400 py-2 px-2 outline-none"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="px-3 text-yellow-400 hover:text-yellow-300 transition"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-lg shadow-lg hover:shadow-yellow-400/30 transition transform hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
