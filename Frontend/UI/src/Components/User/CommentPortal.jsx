import React, { useEffect, useState } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export default function CommentPortal({ postId, open, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/comments/${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const body = {
      userId: currentUser?.userId || "guest",
      username: currentUser?.username || "Guest",
      content: newComment.trim(),
    };

    try {
      const res = await fetch(`${API}/api/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const added = await res.json();
      setComments([added, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Delete comment (only your own)
const handleDelete = async (commentId, commentUserId) => {
  if (!currentUser || currentUser.userId !== commentUserId) {
    alert("You can only delete your own comments");
    return;
  }

  const confirmDelete = window.confirm("Delete this comment?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.userId }),
    });

    if (!res.ok) throw new Error("Failed to delete comment");

    // remove comment from local state
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  } catch (err) {
    alert(err.message);
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111] w-full max-w-lg rounded-2xl border border-white/10 p-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h3 className="font-semibold text-lg">Comments</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <div className="mt-3 space-y-3 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="text-white/60 text-center py-6">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-white/60 text-center py-6">No comments yet.</div>
          ) : (
            comments.map((c) => (
             <div key={c._id} className="bg-white/5 p-2 rounded-lg border border-white/10">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold">{c.username}</div>
              {/* ✅ show delete only for your own comments */}
              {currentUser?.userId === c.userId && (
                <button
                  onClick={() => handleDelete(c._id, c.userId)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-sm text-white/80">{c.content}</div>
            <div className="text-xs text-white/50">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
            ))
          )}
        </div>

        {currentUser ? (
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
            />
            <button
              type="submit"
              className="bg-[#FBB01A] text-black px-4 rounded-lg font-semibold"
            >
              Post
            </button>
          </form>
        ) : (
          <div className="mt-3 text-sm text-white/60 text-center">
            Login to add a comment.
          </div>
        )}
      </div>
    </div>
  );
}
