import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ForgotPasswordModal({ onClose, onOtpSent }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async (type) => {
    setMsg(""); setError("");
    try {
      const res = await fetch(`${API}/api/auth/forgot-password/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === "email" ? { email } : { phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setMsg(`OTP sent to your ${type}`);
      onOtpSent(); // 👉 move to OTP modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#111] w-full max-w-sm rounded-xl p-6 border border-[#FBB01A]/40">
        <h2 className="text-[#FBB01A] font-bold text-lg mb-4">Forgot Password</h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {msg && <p className="text-green-400 text-sm">{msg}</p>}

        {/* Email Option */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-2 rounded bg-[#222] border border-[#333] text-white"
        />
        <button
          onClick={() => sendOtp("email")}
          className="w-full mb-3 py-2 bg-[#FBB01A] text-black rounded-lg font-semibold"
        >
          Send OTP to Email
        </button>

        {/* Phone Option */}
        <input
          type="tel"
          placeholder="Enter your phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 mb-2 rounded bg-[#222] border border-[#333] text-white"
        />
        <button
          onClick={() => sendOtp("phone")}
          className="w-full mb-3 py-2 bg-[#FBB01A] text-black rounded-lg font-semibold"
        >
          Send OTP to Phone
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 bg-white/10 text-white rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
