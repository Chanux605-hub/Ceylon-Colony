import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ fixed import path

// Base API URL
const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export default function FarmRegistrationForm() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get logged user from context

  // ✅ Auto-fill session details
  const ownerId = user?.userId || "";
  const ownerName = user?.name || "";
  const ownerEmail = user?.email || "";

  const [form, setForm] = useState(defaultForm(ownerId, ownerName, ownerEmail));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const farmId = useMemo(() => makeFarmId(form.farmName), [form.farmName]);

  // ------------------ handlers ------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "hiveTypes") {
      setForm((prev) => {
        const set = new Set(prev.hiveTypes);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...prev, hiveTypes: Array.from(set) };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validate = async () => {
    const next = {};

    if (!String(form.farmName).trim()) {
      next.farmName = "Farm Name is required";
    } else {
      try {
        const res = await fetch(
          `${API}/api/farms/check-name?name=${encodeURIComponent(form.farmName)}`
        );
        const data = await res.json();
        if (data.exists) next.farmName = "Farm Name already exists";
      } catch (err) {
        console.warn("Farm name check failed:", err);
      }
    }

    if (!String(form.owner).trim()) next.owner = "Owner / Manager is required";
    if (!String(form.phone).trim()) next.phone = "Phone is required";
    if (!String(form.address).trim()) next.address = "Address is required";
    if (!String(form.district).trim()) next.district = "District/Region is required";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Invalid email";
    if (form.phone && !/^([+]?\d[\d\s-]{6,})$/.test(form.phone))
      next.phone = "Invalid phone number";

    if (form.size !== "" && (Number(form.size) < 0 || Number(form.size) > 500))
      next.size = "Farm size must be between 0 and 500 acres";

    if (form.numHives !== "" && (Number(form.numHives) <= 0 || Number(form.numHives) > 5000))
      next.numHives = "Number of hives must be between 1 and 5000";

    if (form.flora && !form.flora.includes(",") && form.flora.trim().length < 3)
      next.flora = "Enter at least one flowering plant (comma separated if many)";

    if (form.dateEstablished) {
      const est = new Date(form.dateEstablished);
      if (est > new Date())
        next.dateEstablished = "Established date cannot be in the future";
    }

    if (form.expectedAnnualYield !== "" && Number(form.expectedAnnualYield) <= 0)
      next.expectedAnnualYield = "Expected yield must be positive";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;

    const payload = {
      farmId,
      ...form,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/farms/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      alert("✅ Farm registered successfully!");
      setForm(defaultForm(ownerId, ownerName, ownerEmail)); // reset form
    } catch (err) {
      console.error("Error submitting farm:", err);
      alert("❌ API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ render ------------------
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-10 px-4 flex flex-col items-center">
      {/* 🔙 Back button */}
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-5xl bg-[#1a1a1a] border border-[#FBB01A]/40 rounded-2xl p-8 shadow-lg">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#FBB01A]">🏡 Farm Registration</h1>
          <code className="text-emerald-300 bg-[#0B0B0B] border border-gray-600 px-3 py-1 rounded-md text-xs">
            {farmId}
          </code>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Section title="Basic Farm Information">
            <Grid>
              <FormField label="Farm Name" required error={errors.farmName}>
                <input
                  name="farmName"
                  value={form.farmName}
                  onChange={handleChange}
                  placeholder="Eg: Mahaweli Apiary"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Farm ID (Auto)">
                <input value={farmId} disabled className={inputCls + " opacity-70"} />
              </FormField>

              <FormField label="Owner ID (Auto)">
                <input value={ownerId} disabled className={inputCls + " opacity-70"} />
              </FormField>

              <FormField label="Owner / Manager" required error={errors.owner}>
                <input
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  placeholder="Eg: Dinuja Perera"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Contact Phone" required error={errors.phone}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Eg: +94 7X XXX XXXX"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Contact Email" error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@farm.com"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Location */}
          <Section title="Location Details">
            <Grid>
              <FormField label="Address / Location" required error={errors.address} span={2}>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="No. 12, Farm Road, Village"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Region / District" required error={errors.district}>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Eg: Kandy"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Farm Details */}
          <Section title="Farm Details">
            <Grid>
              <FormField label="Farm Size (acres)" error={errors.size}>
                <input
                  type="number"
                  min="0"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="Eg: 1.5"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Number of Hives" error={errors.numHives}>
                <input
                  type="number"
                  min="0"
                  name="numHives"
                  value={form.numHives}
                  onChange={handleChange}
                  placeholder="Eg: 24"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Hive Types Used">
                <div className="flex flex-wrap gap-2">
                  {HIVE_TYPES.map((t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-2 text-sm bg-[#0B0B0B] border border-gray-600 rounded-xl px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        name="hiveTypes"
                        value={t}
                        checked={form.hiveTypes.includes(t)}
                        onChange={handleChange}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Primary Flowering Plants" error={errors.flora}>
                <input
                  name="flora"
                  value={form.flora}
                  onChange={handleChange}
                  placeholder="Eg: Coconut, Lovi-lovi, Aralu"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Date Established" error={errors.dateEstablished}>
                <input
                  type="date"
                  name="dateEstablished"
                  value={form.dateEstablished}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>

              <FormField label="Expected Annual Yield (kg)" error={errors.expectedAnnualYield}>
                <input
                  type="number"
                  min="0"
                  name="expectedAnnualYield"
                  value={form.expectedAnnualYield}
                  onChange={handleChange}
                  placeholder="Eg: 1200"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setForm(defaultForm(ownerId, ownerName, ownerEmail))}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Farm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- helpers ----------
const HIVE_TYPES = ["Langstroth", "Top-bar", "Warre", "Traditional Box"];

const inputCls =
  "w-full rounded-lg bg-[#0B0B0B] border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#FBB01A]";

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-[#FBB01A] mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function FormField({ label, required, error, span = 1, children }) {
  return (
    <label className={`grid gap-1 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-sm text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </label>
  );
}

function makeFarmId(name) {
  const slug = String(name || "FARM")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .slice(0, 8)
    .replace(/^-+|-+$/g, "");
  const last6 = Date.now().toString().slice(-6);
  return `${slug || "FARM"}-${last6}`;
}

function defaultForm(ownerId, ownerName, ownerEmail) {
  return {
    farmName: "",
    ownerId,
    owner: ownerName || "",
    phone: "",
    email: ownerEmail || "",
    address: "",
    district: "",
    size: "",
    numHives: "",
    hiveTypes: [],
    flora: "",
    dateEstablished: "",
    status: "Active",
    expectedAnnualYield: "",
  };
}
