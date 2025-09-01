import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

// ---------- constants (must match schema enums) ----------
const HIVE_TYPES = ["Langstroth", "Top-bar", "Warre", "Traditional Box"];
const MATERIALS = ["Wood", "Plastic", "Clay", "Other"];
const STATUSES = ["Active", "Dormant", "Needs Attention", "Retired"];
const STRENGTHS = ["Strong", "Medium", "Weak"];
const COLONY_SOURCES = ["Swarm", "Split", "Purchased", "Other"];

export default function HiveRegistrationForm() {
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState({});
  const [farms, setFarms] = useState([]);

  // auto ID
  const hiveId = useMemo(() => makeHiveId(form.hiveName), [form.hiveName]);

  // hardcoded farms for now
  useEffect(() => {
    setFarms([
      { farmId: "FARM-001", farmName: "Mahaweli Apiary" },
      { farmId: "FARM-002", farmName: "Kandy Hills Farm" },
      { farmId: "FARM-003", farmName: "Colombo Urban Bees" },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const next = checked
          ? [...prev.colonySource, value]
          : prev.colonySource.filter((src) => src !== value);
        return { ...prev, colonySource: next };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.hiveName) next.hiveName = "Hive name required";
    if (!form.farmId) next.farmId = "Select a farm";
    if (!form.hiveType) next.hiveType = "Select a hive type";
    if (!form.material) next.material = "Select a material";
    if (!form.status) next.status = "Select a status";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { hiveId, ...form, createdAt: new Date().toISOString() };

    try {
      const res = await axios.post("http://localhost:3000/api/hives/register", payload);

      if (res.data.success) {
        alert("Hive registered successfully!");
        console.log("Saved hive:", res.data.hive);
        setForm(defaultForm()); // reset form after success
        setErrors({});
      } else {
        alert("Failed to register hive: " + res.data.message);
      }
    } catch (err) {
      console.error("Error saving hive:", err);
      alert("Error saving hive. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 text-xs rounded-full border border-slate-700 text-amber-300">
              Farm & Harvest Management
            </span>
            <h1 className="text-2xl font-bold">Hive Registration</h1>
          </div>
          <code className="text-emerald-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-xs">
            {hiveId}
          </code>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-xl"
        >
          {/* Basic Hive Information */}
          <Section title="Basic Hive Information">
            <Grid>
              <FormField label="Hive Name" required error={errors.hiveName}>
                <input
                  name="hiveName"
                  value={form.hiveName}
                  onChange={handleChange}
                  placeholder="Eg: Hive A-1"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Hive ID (Auto)">
                <input value={hiveId} disabled className={inputCls + " opacity-70"} />
              </FormField>

              <FormField label="Farm" required error={errors.farmId}>
                <select
                  name="farmId"
                  value={form.farmId}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select Farm</option>
                  {farms.map((f) => (
                    <option key={f.farmId} value={f.farmId}>
                      {f.farmName}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Location within Farm">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Eg: North Section"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Hive Characteristics */}
          <Section title="Hive Characteristics">
            <Grid>
              <FormField label="Hive Type" required error={errors.hiveType}>
                <select
                  name="hiveType"
                  value={form.hiveType}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select</option>
                  {HIVE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Material" required error={errors.material}>
                <select
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select</option>
                  {MATERIALS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Date Established">
                <input
                  type="date"
                  name="dateEstablished"
                  value={form.dateEstablished}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Bee Colony Information */}
          <Section title="Bee Colony Information">
            <Grid>
              <FormField label="Bee Species">
                <input
                  name="beeSpecies"
                  value={form.beeSpecies}
                  onChange={handleChange}
                  placeholder="Eg: Apis cerana"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Queen Bee ID / Year Introduced">
                <input
                  name="queenId"
                  value={form.queenId}
                  onChange={handleChange}
                  placeholder="Eg: QN-2025"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Colony Strength">
                <select
                  name="colonyStrength"
                  value={form.colonyStrength}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select</option>
                  {STRENGTHS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
            </Grid>

            <FormField label="Colony Source (check all that apply)" span={2}>
              <div className="flex flex-wrap gap-2">
                {COLONY_SOURCES.map((src) => (
                  <label
                    key={src}
                    className="inline-flex items-center gap-2 text-sm bg-slate-900 border border-slate-700 rounded-xl px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      name="colonySource"
                      value={src}
                      checked={form.colonySource.includes(src)}
                      onChange={handleChange}
                    />
                    <span>{src}</span>
                  </label>
                ))}
              </div>
            </FormField>
          </Section>

          {/* Operational Information */}
          <Section title="Operational Information">
            <Grid>
              <FormField label="Current Status" required error={errors.status}>
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

              <FormField label="Expected Annual Yield (kg)">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  name="expectedYield"
                  value={form.expectedYield}
                  onChange={handleChange}
                  placeholder="Eg: 25"
                  className={inputCls}
                />
              </FormField>

              <FormField label="Primary Flora Source">
                <input
                  name="flora"
                  value={form.flora}
                  onChange={handleChange}
                  placeholder="Eg: Coconut, Lovi-lovi"
                  className={inputCls}
                />
              </FormField>
            </Grid>
          </Section>

          {/* Inspections */}
          <Section title="Inspections">
            <Grid>
              <FormField label="Last Inspection Date">
                <input
                  type="date"
                  name="lastInspection"
                  value={form.lastInspection}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>

              <FormField label="Next Inspection Due">
                <input
                  type="date"
                  name="nextInspection"
                  value={form.nextInspection}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
            </Grid>

            <FormField label="Notes" span={2}>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional observations..."
                className={inputCls}
              />
            </FormField>
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm());
                setErrors({});
              }}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300"
            >
              Register Hive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- helpers ----------
const inputCls =
  "w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400";

function makeHiveId(name) {
  const slug = String(name || "HIVE")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .slice(0, 8)
    .replace(/^-+|-+$/g, "");
  const last6 = Date.now().toString().slice(-6);
  return `${slug || "HIVE"}-${last6}`;
}

function defaultForm() {
  return {
    hiveName: "",
    farmId: "",
    location: "",
    hiveType: "",
    material: "",
    dateEstablished: "",
    beeSpecies: "",
    queenId: "",
    colonyStrength: "",
    colonySource: [],
    status: "Active",
    expectedYield: "",
    flora: "",
    lastInspection: "",
    nextInspection: "",
    notes: "",
  };
}

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

function FormField({ label, required, error, span = 1, children }) {
  return (
    <label className={`grid gap-1 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-xs text-slate-300">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
      {children}
      {error && <div className="text-[11px] text-rose-400">{error}</div>}
    </label>
  );
}
