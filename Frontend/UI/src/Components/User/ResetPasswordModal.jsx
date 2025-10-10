import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ResetPasswordModal({ email, onClose }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const resetPassword = async () => {
    setError(""); 
    setMsg("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,                // ✅ now clearly email, not userId
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setMsg("Password updated successfully! You can now log in.");
      setTimeout(onClose, 2000); // auto-close modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#111] w-full max-w-sm rounded-xl p-6 border border-[#FBB01A]/40">
        <h2 className="text-[#FBB01A] font-bold text-lg mb-4">Reset Password</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {msg && <p className="text-green-400 text-sm">{msg}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded bg-[#222] border border-[#333] text-white"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded bg-[#222] border border-[#333] text-white"
        />

        <button
          onClick={resetPassword}
          className="w-full py-2 bg-[#FBB01A] text-black rounded-lg font-semibold"
        >
          Update Password
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
