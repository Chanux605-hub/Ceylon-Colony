import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Edit, Trash2, Eye, Search } from "lucide-react";

export default function BlogListAdmin({ onEdit, onView, onDelete }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Health", "Workshops", "News"];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/blogs")
      .then((res) => {
        if (res.data.success) setBlogs(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case "Health":
        return "bg-emerald-500";
      case "Workshops":
        return "bg-amber-500";
      case "News":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/60 text-white rounded-lg border border-gray-700 focus:border-[#FBB01A] focus:ring-2 focus:ring-[#FBB01A]/40 outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-black/60 text-white rounded-lg border border-gray-700 focus:border-[#FBB01A] focus:ring-2 focus:ring-[#FBB01A]/40 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Loading blogs...</p>
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => {
            const showUpdated =
              blog.updatedAt && blog.updatedAt !== blog.createdAt
                ? new Date(blog.updatedAt).toLocaleDateString()
                : null;

            const publishedDate = new Date(
              blog.createdAt
            ).toLocaleDateString();

            return (
              <div
                key={blog._id}
                className="bg-black/40 rounded-xl border border-white/10 hover:border-[#FBB01A]/50 transition overflow-hidden group hover:shadow-lg hover:shadow-[#FBB01A]/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${getCategoryColor(
                      blog.category
                    )}`}
                  >
                    {blog.category}
                  </span>
                </div>

                {/* Content + Actions */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FBB01A] transition">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {blog.content}
                  </p>

                  {/* Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-[#FBB01A]" />
                      {showUpdated ? (
                        <span>Updated on {showUpdated}</span>
                      ) : (
                        <span>Published on {publishedDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions stick to bottom */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => onEdit(blog._id)}
                      className="flex-1 px-3 py-2 bg-[#FBB01A] hover:bg-[#FBB01A]/80 text-black font-medium rounded-lg flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => onView(blog._id)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(blog._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No blogs found</p>
        )}
      </div>
    </div>
  );
}
