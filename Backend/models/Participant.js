import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  seats: { type: Number, default: 1 },
  notes: String,
  agree: Boolean,
  status: { type: String, default: "Registered" },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Participant", ParticipantSchema);
