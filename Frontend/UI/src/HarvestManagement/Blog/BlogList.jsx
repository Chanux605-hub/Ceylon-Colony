import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";

export default function BlogList({ onSelectBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/blogs")
      .then((res) => {
        if (res.data.success) {
          setBlogs(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-white">Loading blogs...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {blogs.map((blog) => {
        // ✅ Decide which date to show
        const showUpdated =
          blog.updatedAt && blog.updatedAt !== blog.createdAt
            ? new Date(blog.updatedAt).toLocaleDateString()
            : null;

        const publishedDate = new Date(blog.createdAt).toLocaleDateString();

        return (
          <div
            key={blog._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >
            {/* Image with hover zoom */}
            {blog.coverImage && (
              <div className="relative w-full aspect-video overflow-hidden group">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-[#FBB01A] text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {blog.category}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                {blog.title}
              </h2>
              {/* Preview only (2 lines max) */}
              <p className="text-gray-600 text-sm line-clamp-2">
                {blog.content}
              </p>

              {/* Date + Read More */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CalendarDays size={14} className="text-[#FBB01A]" />
                  {showUpdated ? (
                    <span>Updated on {showUpdated}</span>
                  ) : (
                    <span>Published on {publishedDate}</span>
                  )}
                </p>
                <button
                  onClick={() => onSelectBlog(blog._id)}
                  className="text-[#FBB01A] text-xs font-semibold hover:underline"
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
