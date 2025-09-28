import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateFarmForm() {
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    farmName: "",
    district: "",
    size: "",
    numHives: "",
    flora: "",
    status: "Active",
    owner: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  //  Fetch farm details
  useEffect(() => {
    fetch(`http://localhost:3000/api/farms/${farmId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.farm) {
          setFormData({
            farmName: data.farm.farmName || "",
            district: data.farm.district || "",
            size: data.farm.size || "",
            numHives: data.farm.numHives || "",
            flora: data.farm.flora || "",
            status: data.farm.status || "Active",
            owner: data.farm.owner || "",
            phone: data.farm.phone || "",
            email: data.farm.email || "",
            address: data.farm.address || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching farm:", err);
        setLoading(false);
      });
  }, [farmId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/farms/${farmId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Farm updated successfully!");
        navigate("/farmerProfile");
      } else {
        alert("❌ Update failed: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating farm");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading farm data...</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-[#FBB01A] border-b pb-3">
        ✏️ Update Farm
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Farm Name */}
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Farm Name</label>
          <input
            type="text"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            required
          />
        </div>

        {/* District */}
        <div>
          <label className="block font-semibold mb-1">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block font-semibold mb-1">Size (in acres)</label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Number of Hives */}
        <div>
          <label className="block font-semibold mb-1">Number of Hives</label>
          <input
            type="number"
            name="numHives"
            value={formData.numHives}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Flora */}
        <div>
          <label className="block font-semibold mb-1">Flora</label>
          <input
            type="text"
            name="flora"
            value={formData.flora}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        {/* Owner */}
        <div>
          <label className="block font-semibold mb-1">Owner</label>
          <input
            type="text"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/farmerProfile")}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#FBB01A] text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Update Farm
          </button>
        </div>
      </form>
    </div>
  );
}
