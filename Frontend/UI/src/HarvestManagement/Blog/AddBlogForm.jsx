import React, { useState, useMemo } from "react";

// Base API URL (from .env or fallback localhost:3000)
const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export default function AddBlogForm() {
  const [form, setForm] = useState(defaultForm());
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const blogId = useMemo(() => makeBlogId(form.title), [form.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const validate = () => {
    const next = {};
    if (!String(form.title).trim()) next.title = "Title is required";
    if (!String(form.authorId).trim()) next.authorId = "Author ID is required";
    if (!String(form.content).trim()) next.content = "Content is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("blogId", blogId);
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (file) data.append("coverImage", file);

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/blogs/add`, {
        method: "POST",
        body: data,
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.slice(0, 120)}`);
      }

      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `HTTP ${res.status}`);
      }

      alert("✅ Blog added successfully!");
      console.log("Server response:", json);
      setForm(defaultForm());
      setFile(null);
    } catch (err) {
      console.error("Error submitting blog:", err);
      alert("❌ API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Create <span className="text-[#FBB01A]">Blog Post</span>
          </h1>
          <code className="text-emerald-300 bg-black/70 border border-gray-700 px-3 py-1 rounded-md text-xs">
            {blogId}
          </code>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-black/40 border-2 border-[#FBB01A] rounded-2xl p-8 shadow-xl space-y-6"
        >
          <Grid>
            <FormField label="Title" required error={errors.title}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Eg: Health Benefits of Honey"
                className={inputCls}
              />
            </FormField>

            <FormField label="Author ID" required error={errors.authorId}>
              <input
                name="authorId"
                value={form.authorId}
                onChange={handleChange}
                placeholder="Eg: A001"
                className={inputCls}
              />
            </FormField>

            <FormField label="Category">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Status">
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

            <FormField label="Content" required error={errors.content} span={2}>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={6}
                placeholder="Write your blog content here..."
                className={inputCls}
              />
            </FormField>

            <FormField label="Tags (comma separated)" span={2}>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Eg: honey, health, skincare"
                className={inputCls}
              />
            </FormField>

            <FormField label="Cover Image" span={2}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={inputCls}
              />
            </FormField>
          </Grid>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm());
                setFile(null);
                setErrors({});
              }}
              className="px-4 py-2 text-sm rounded-xl border border-gray-600 hover:bg-gray-800"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl font-semibold text-black bg-[#FBB01A] hover:bg-[#e6a800] disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- helpers ----------
const CATEGORIES = ["Health", "Recipes", "Beekeeping", "News", "Workshops"];
const STATUSES = ["Draft", "Published", "Archived"];

const inputCls =
  "w-full rounded-lg bg-black/50 border border-[#FBB01A]/40 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FBB01A] focus:border-[#FBB01A] outline-none transition";

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function FormField({ label, required, error, span = 1, children }) {
  return (
    <label className={`grid gap-1 ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <div className="text-[11px] text-red-400">{error}</div>}
    </label>
  );
}

function makeBlogId(title) {
  const slug = String(title || "BLOG")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .slice(0, 8)
    .replace(/^-+|-+$/g, "");
  const last6 = Date.now().toString().slice(-6);
  return `${slug || "BLOG"}-${last6}`;
}

function defaultForm() {
  return {
    authorId: "",
    title: "",
    content: "",
    category: "Health",
    tags: "",
    status: "Draft",
    publishedAt: "",
  };
}
