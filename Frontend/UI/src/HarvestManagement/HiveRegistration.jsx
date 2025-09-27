import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ---------- constants ----------
const HIVE_TYPES = ["Langstroth", "Top-bar", "Warre", "Traditional Box"];
const MATERIALS = ["Wood", "Plastic", "Clay", "Other"];
const STATUSES = ["Active", "Dormant", "Needs Attention", "Retired"];
const STRENGTHS = ["Strong", "Medium", "Weak"];
const COLONY_SOURCES = ["Swarm", "Split", "Purchased", "Other"];

export default function HiveRegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState({});
  const [farms, setFarms] = useState([]);

  // auto ID
  const hiveId = useMemo(() => makeHiveId(form.hiveName), [form.hiveName]);

  // temporary farms list
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
        alert("✅ Hive registered successfully!");
        setForm(defaultForm()); // reset
        setErrors({});
      } else {
        alert("❌ Failed to register hive: " + res.data.message);
      }
    } catch (err) {
      console.error("Error saving hive:", err);
      alert("❌ Error saving hive. Check console.");
    }
  };

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

      <div className="mx-auto max-w-5xl w-full bg-[#1a1a1a] border border-[#FBB01A]/40 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            
            <h1 className="text-2xl font-bold text-[#FBB01A]">Hive Registration</h1>
          </div>
          <code className="text-emerald-300 bg-[#0B0B0B] border border-gray-600 px-3 py-1 rounded-md text-xs">
            {hiveId}
          </code>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={inputCls + " text-black"} // white calendar picker
                />
              </FormField>
            </Grid>
          </Section>

          {/* Colony Info */}
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
                    className="inline-flex items-center gap-2 text-sm bg-[#0B0B0B] border border-gray-600 rounded-xl px-3 py-2"
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

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm());
                setErrors({});
              }}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:bg-yellow-500"
            >
              Register Hive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// helpers 
const inputCls =
  "w-full rounded-lg bg-[#0B0B0B] border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#FBB01A]";

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
        <h2 className="text-lg font-semibold text-[#FBB01A]">{title}</h2>
        <span className="h-px flex-1 bg-gray-700" />
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
      <span className="text-sm text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </label>
  );
}
