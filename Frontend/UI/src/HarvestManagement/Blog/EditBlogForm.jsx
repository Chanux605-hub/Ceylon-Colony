import React, { useState, useEffect } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
  /\/+$/,
  ""
);

export default function EditBlogForm({ blogId, onCancel, onUpdated }) {
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing blog
  useEffect(() => {
    fetch(`${API}/api/blogs/${blogId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setForm(json.data);
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    const data = new FormData();

    // ✅ Prevent sending invalid publishedAt
    Object.keys(form).forEach((key) => {
      if (key === "publishedAt" && (!form[key] || form[key] === "null")) return;
      data.append(key, form[key]);
    });

    if (file) data.append("coverImage", file);

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/blogs/update/${blogId}`, {
        method: "PUT",
        body: data,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message);
      alert("✅ Blog updated successfully!");
      if (onUpdated) onUpdated(json.data);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p className="text-gray-400">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-black/60 border-2 border-[#FBB01A] p-8 rounded-2xl space-y-6 shadow-lg"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#FBB01A] border-b border-[#FBB01A]/30 pb-3">
        ✏️ Edit Blog
      </h2>

      {/* Title + Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 bg-black/60 border border-[#FBB01A]/40 rounded-lg text-sm focus:ring-2 focus:ring-[#FBB01A] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Author ID</label>
          <input
            name="authorId"
            value={form.authorId}
            onChange={handleChange}
            className="w-full p-3 bg-black/60 border border-[#FBB01A]/40 rounded-lg text-sm focus:ring-2 focus:ring-[#FBB01A] outline-none"
          />
        </div>
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 bg-black/60 border border-[#FBB01A]/40 rounded-lg text-sm focus:ring-2 focus:ring-[#FBB01A] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Status</label>
          <input
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 bg-black/60 border border-[#FBB01A]/40 rounded-lg text-sm focus:ring-2 focus:ring-[#FBB01A] outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={8}
          className="w-full p-3 bg-black/60 border border-[#FBB01A]/40 rounded-lg text-sm focus:ring-2 focus:ring-[#FBB01A] outline-none"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Cover Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-200"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[#FBB01A]/30">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:bg-[#e6a800] text-sm"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
}
