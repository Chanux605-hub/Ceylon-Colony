import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";

export default function BlogDetail({ blogId }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    axios
      .get(`http://localhost:3000/api/blogs/${blogId}`)
      .then((res) => {
        if (res.data.success) {
          setBlog(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [blogId]);

  if (!blog) return <p className="text-center text-gray-400">Loading...</p>;

  // pick updatedAt if it's different from createdAt
  const showUpdated =
    blog.updatedAt && blog.updatedAt !== blog.createdAt
      ? new Date(blog.updatedAt).toLocaleDateString()
      : null;

  const publishedDate = new Date(blog.createdAt).toLocaleDateString();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Blog Card */}
      <div className="bg-black/40 border border-[#FBB01A]/40 rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full flex justify-center bg-black">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full max-h-[500px] object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 text-white">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-[#FBB01A]">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
            <span className="bg-[#FBB01A] text-black px-3 py-1 rounded-full text-xs font-semibold">
              {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={16} className="text-[#FBB01A]" />
              {showUpdated ? (
                <span>Updated on {showUpdated}</span>
              ) : (
                <span>Published on {publishedDate}</span>
              )}
            </span>
          </div>

          {/* Content */}
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
        </div>
      </div>
    </div>
  );
}
