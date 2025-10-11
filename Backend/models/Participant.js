import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // custom IDs like "U29"
      required: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    fullName: String,
    email: String,
    phone: String,

    status: {
      type: String,
      enum: ["Registered", "Paid", "Cancelled"],
      default: "Registered",
    },

    // ✅ NEW: Attendance tracking for physical workshops
    attendance: {
      type: String,
      enum: ["Pending", "Present", "Absent"],
      default: "Pending",
    },

    // ✅ Optional: future-proof for certificate generation
    certificateId: {
      type: String,
      default: null, // e.g. "CERT-20251011-0001"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Participant", participantSchema);
