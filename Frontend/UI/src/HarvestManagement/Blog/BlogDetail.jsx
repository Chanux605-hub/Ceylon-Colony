import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";

export default function BlogDetail({ blogId, onBack }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    axios
      .get(`http://localhost:3000/api/blogs/${blogId}`) // ✅ backend API
      .then((res) => {
        if (res.data.success) {
          setBlog(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [blogId]);

  if (!blog) return <p className="text-center text-black">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-5 py-2 bg-[#FBB01A] text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Full Cover Image */}
        {blog.coverImage && (
          <div className="w-full flex justify-center">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        )}

        <div className="p-6">
          {/* Blog Title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            <span className="bg-[#FBB01A] text-black px-3 py-1 rounded-full text-xs font-semibold">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <CalendarDays size={16} className="text-[#FBB01A]" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Blog Content */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
        </div>
      </div>
    </div>
  );
}
