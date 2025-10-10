import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function WorkshopPayment() {
  const [params] = useSearchParams();
  const participantId = params.get("participantId");
  const workshopId = params.get("workshopId");

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ✅ handle payment and update status in DB
  const handlePayment = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.cardNumber || !form.expiry || !form.cvv) {
      alert("Please fill all fields");
      return;
    }
    if (form.cardNumber.length < 12) {
      alert("Card number must be at least 12 digits");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid" }),
      });

      if (!res.ok) throw new Error("Failed to update payment status");

      alert("💳 Payment successful!");
      window.location.href = "/workshops"; // go back after success
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <h1 className="text-2xl font-bold mb-6">Secure Payment</h1>
      <p className="mb-1 text-sm">Participant ID: {participantId}</p>
      <p className="mb-6 text-sm">Workshop ID: {workshopId}</p>

      <form
        onSubmit={handlePayment}
        className="w-full max-w-sm bg-gray-100 p-6 rounded-xl shadow-md"
      >
        <label className="block mb-3 text-sm">
          Cardholder Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => u("name", e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="John Doe"
          />
        </label>

        <label className="block mb-3 text-sm">
          Card Number
          <input
            type="text"
            value={form.cardNumber}
            onChange={(e) => u("cardNumber", e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="1234 5678 9012 3456"
          />
        </label>

        <div className="flex gap-3">
          <label className="block flex-1 text-sm">
            Expiry Date
            <input
              type="text"
              value={form.expiry}
              onChange={(e) => u("expiry", e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="MM/YY"
            />
          </label>
          <label className="block flex-1 text-sm">
            CVV
            <input
              type="password"
              value={form.cvv}
              onChange={(e) => u("cvv", e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="123"
              maxLength={4}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#fbb01a] px-6 py-3 font-semibold text-black hover:brightness-95"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
