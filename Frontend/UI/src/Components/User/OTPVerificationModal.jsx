import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function OTPVerificationModal({ onVerified, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      // ✅ pass userId directly to parent (ResetPasswordModal)
      if (data.email) {
        onVerified(data.email);
      } else {
        throw new Error("OTP verified but no userId returned");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#111] w-full max-w-sm rounded-xl p-6 border border-[#FBB01A]/40">
        <h2 className="text-[#FBB01A] font-bold text-lg mb-4">Enter OTP</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded bg-[#222] border border-[#333] text-white"
        />
        <button
          onClick={verifyOtp}
          className="w-full py-2 bg-[#FBB01A] text-black rounded-lg font-semibold"
        >
          Verify OTP
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
