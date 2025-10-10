import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  notes: String,
  agree: Boolean,
  status: { type: String, default: "Registered" },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
    required: true,
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: false,
    },
}, { timestamps: true });

export default mongoose.model("Participant", ParticipantSchema);
