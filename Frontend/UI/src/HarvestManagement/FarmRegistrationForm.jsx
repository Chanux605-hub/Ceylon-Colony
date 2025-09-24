import React, { useMemo, useState } from "react";

// Base API URL (from .env or default localhost:4000)
const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

/**
 * FarmRegistrationForm.jsx
 * - React form with TailwindCSS
 * - Auto-generates Farm ID
 * - Temporary ownerId = "001"
 * - Submits data to http://localhost:4000/api/farms/register
 */
export default function FarmRegistrationForm() {
  // ---------- const (temporary ownerId until session/user is implemented) ----------
  const ownerId = "001";

  // ---------- form state ----------
  const [form, setForm] = useState(defaultForm(ownerId));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- auto ID ----------
  const farmId = useMemo(() => makeFarmId(form.farmName), [form.farmName]);

  // ---------- handlers ----------
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

  const validate = () => {
    const next = {};
    if (!String(form.farmName).trim()) next.farmName = "Farm Name is required";
    if (!String(form.owner).trim()) next.owner = "Owner / Manager is required";
    if (!String(form.phone).trim()) next.phone = "Phone is required";
    if (!String(form.address).trim()) next.address = "Address is required";
    if (!String(form.district).trim()) next.district = "District/Region is required";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (form.phone && !/^([+]?\d[\d\s-]{6,})$/.test(form.phone)) next.phone = "Invalid phone number";

    if (form.size !== "" && Number(form.size) < 0) next.size = "Size cannot be negative";
    if (form.numHives !== "" && Number(form.numHives) < 0) next.numHives = "Number of hives cannot be negative";
    if (form.expectedAnnualYield !== "" && Number(form.expectedAnnualYield) < 0) next.expectedAnnualYield = "Yield cannot be negative";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ---------- submit handler (API call) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      farmId,
      ...form,
      lat: form.lat === "" ? null : Number(form.lat),
      lng: form.lng === "" ? null : Number(form.lng),
      size: form.size === "" ? null : Number(form.size),
      numHives: form.numHives === "" ? null : Number(form.numHives),
      expectedAnnualYield: form.expectedAnnualYield === "" ? null : Number(form.expectedAnnualYield),
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/farms/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Expected JSON from ${res.url}, got ${ct} (status ${res.status}). Snippet: ${text.slice(0, 120)}`
        );
      }

      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      alert("✅ Farm registered successfully!");
      console.log("Server response:", data);
      setForm(defaultForm(ownerId)); // reset
    } catch (err) {
      console.error("Error submitting farm:", err);
      alert("❌ API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 text-xs rounded-full border border-slate-700 text-sky-300">
              Farm & Harvest Management
            </span>
            <h1 className="text-2xl font-bold">Farm Registration</h1>
          </div>
          <code className="text-emerald-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-xs">
            {farmId}
          </code>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-xl"
        >
          {/* Basic Farm Information */}
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
              <FormField label="Farm ID (Auto)" hint="Generated from name + timestamp">
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

          {/* Location Details */}
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
                  step="0.01"
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
                  step="1"
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
                      className="inline-flex items-center gap-2 text-sm bg-slate-900 border border-slate-700 rounded-xl px-3 py-2"
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
              <FormField label="Primary Flowering Plants (comma separated)">
                <input
                  name="flora"
                  value={form.flora}
                  onChange={handleChange}
                  placeholder="Eg: Coconut, Lovi-lovi, Aralu"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Operational Information */}
          <Section title="Operational Information">
            <Grid>
              <FormField label="Date Established">
                <input
                  type="date"
                  name="dateEstablished"
                  value={form.dateEstablished}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
              <FormField label="Current Status">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputCls}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Expected Annual Yield (kg)" error={errors.expectedAnnualYield}>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="expectedAnnualYield"
                  value={form.expectedAnnualYield}
                  onChange={handleChange}
                  placeholder="Eg: 120"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm(ownerId));
                setErrors({});
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50"
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
const STATUSES = ["Active", "Inactive", "Under Maintenance"];

const inputCls =
  "w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400";

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-semibold text-slate-200">{title}</h2>
        <span className="h-px flex-1 bg-slate-800" />
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function FormField({ label, required, hint, error, span = 1, children }) {
  return (
    <label className={`grid gap-1 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-xs text-slate-300">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
      <div className="text-[11px] text-slate-400">{hint}</div>
      {error && <div className="text-[11px] text-rose-400">{error}</div>}
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

function defaultForm(ownerId) {
  return {
    farmName: "",
    ownerId,
    owner: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    lat: "",
    lng: "",
    size: "",
    numHives: "",
    hiveTypes: [],
    flora: "",
    dateEstablished: "",
    status: "Active",
    expectedAnnualYield: "",
  };
}
