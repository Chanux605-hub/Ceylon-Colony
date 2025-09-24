import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import BlogList from "./BlogListAdmin.jsx";  
import AddBlogForm from "./AddBlogForm.jsx";
import EditBlogForm from "./EditBlogForm.jsx";
import BlogDetailAdmin from "./BlogDetailAdmin.jsx";  // ✅ import new file

export default function ManageBlogs() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [viewBlogId, setViewBlogId] = useState(null);  // ✅ new state

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Manage Blogs</h1>
            <p className="text-gray-400">Create, edit, view and manage your blog posts</p>
          </div>
          {(showForm || editingBlogId || viewBlogId) && (
            <button
              onClick={() => {
                setShowForm(false);
                setEditingBlogId(null);
                setViewBlogId(null);
              }}
              className="px-6 py-3 bg-[#FBB01A] hover:bg-[#FBB01A]/90 text-black font-semibold rounded-lg shadow-lg hover:shadow-[#FBB01A]/20 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </button>
          )}
          {!showForm && !editingBlogId && !viewBlogId && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#FBB01A] hover:bg-[#FBB01A]/90 text-black font-semibold rounded-lg shadow-lg hover:shadow-[#FBB01A]/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Blog
            </button>
          )}
        </div>

        {/* Toggle Content */}
        {showForm ? (
          <AddBlogForm />
        ) : editingBlogId ? (
          <EditBlogForm
            blogId={editingBlogId}
            onCancel={() => setEditingBlogId(null)}
            onUpdated={() => setEditingBlogId(null)}
          />
        ) : viewBlogId ? (
          <BlogDetailAdmin blogId={viewBlogId} onBack={() => setViewBlogId(null)} />
        ) : (
          <BlogList 
            onEdit={(id) => setEditingBlogId(id)} 
            onView={(id) => setViewBlogId(id)}   // ✅ handle view
          />
        )}
      </div>
    </div>
  );
}
