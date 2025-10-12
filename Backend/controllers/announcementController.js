import Announcement from "../models/Announcement.js";

// CREATE
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, date, time, status } = req.body;
    let flyerUrl = "";

    if (req.file) {
      flyerUrl = req.file.path;  // ✅ Cloudinary automatically gives https:// URL
    }

    const ann = await Announcement.create({
      title,
      description,
      date,
      time,
      flyerUrl,
      status: status || "published",
      createdBy: { userId: req.user?.id, username: req.user?.username },
    });

    res.status(201).json(ann);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// READ (All, with filters)
export const listAnnouncements = async (req, res) => {
  try {
    const { status = "published" } = req.query;
    const anns = await Announcement.find({ status }).sort({ date: 1, time: 1 });
    res.json({ items: anns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one
export const getAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann) return res.status(404).json({ error: "Not found" });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(ann);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
