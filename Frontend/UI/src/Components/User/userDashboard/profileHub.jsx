import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import { MoreVertical } from "lucide-react"; // dropdown icon
import toast from "react-hot-toast";   // ✅ import

const API = "http://localhost:3000/api/auth";

const ProfileHub = () => {
  const { logout } = useAuth(); // make sure logout clears context/localStorage
  const { user, updateUser } = useAuth(); // ✅ global user
  const [formData, setFormData] = useState(user); // local editable state
  const [showMenu, setShowMenu] = useState(false); // ✅ dropdown toggle

  // sync formData when global user changes
  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const res = await fetch(`${API}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok && data.user) {
      updateUser(data.user); // ✅ refresh global state
      toast.success("Profile updated!");
    } else {
      alert(data.error || "Update failed");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    const res = await fetch("http://localhost:3000/api/auth/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formDataUpload,
    });

    const data = await res.json();
    if (res.ok && data.user) {
      updateUser(data.user);
      toast.success("Profile picture updated!");
    } else {
      toast.error(data.error || "Failed to upload profile picture");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      alert("✅ Your account has been deleted.");
      logout(); // clears session + redirect
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-[#FBB01A] text-center">
          Profile Hub
        </h2>

{/* 🔹 Profile Card (always shows global user) */}
<div className="bg-neutral-900 rounded-xl p-6 flex items-center gap-6 shadow-md relative">
  <img
    src={user.avatarUrl || "https://i.pravatar.cc/150"}
    alt="Profile"
    className="w-20 h-20 rounded-full border-4 border-[#FBB01A] object-cover"
  />
  <div>
    <p className="text-lg font-semibold text-white">{user.name}</p>
    <p className="text-sm text-gray-400">{user.email}</p>
    <p className="text-sm text-gray-400">{user.phone}</p>
    <p className="text-sm text-gray-400">{user.username}</p>
    <p className="text-sm text-gray-400">{user.address}</p>
  </div>

  {/* ✅ Advanced options dropdown (top-right inside card) */}
  <div className="absolute top-4 right-4">
    <button
      onClick={() => setShowMenu((prev) => !prev)}
      className="p-2 rounded-full hover:bg-neutral-700 transition"
    >
      <MoreVertical className="text-white" size={20} />
    </button>
    {showMenu && (
      <div className="absolute right-0 mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
        <button
          onClick={handleDelete}
          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded-md"
        >
          Delete Account
        </button>
      </div>
    )}
  </div>
</div>

        {/* 🔹 Form (edits local formData) */}
        <div className="bg-neutral-900 rounded-xl p-6 shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:border-[#FBB01A]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Username</label>
              <input
                name="username"
                value={formData?.username || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:border-[#FBB01A]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone</label>
              <input
                name="phone"
                value={formData?.phone || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:border-[#FBB01A]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:border-[#FBB01A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Address</label>
            <textarea
              name="address"
              value={formData?.address || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:border-[#FBB01A]"
            />
          </div>

          {/* 🔹 Buttons */}
          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-[#FBB01A] text-black font-semibold rounded-md hover:opacity-90 transition"
            >
              Update Profile
            </button>

            <label className="px-5 py-2 bg-neutral-700 text-white font-semibold rounded-md hover:bg-neutral-600 transition cursor-pointer">
              Update Picture
              <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHub;
