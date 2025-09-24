import blogModel from "../models/blogModel.js";

/*  ADD NEW BLOG  */
export const addBlog = async (req, res) => {
  try {
    const {
      blogId,
      authorId,
      title,
      content,
      category,
      tags,
      status,
      publishedAt,
    } = req.body;

    // validate required fields
    if (!blogId || !authorId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide blogId, authorId, title, and content",
      });
    }

    // If image uploaded via Cloudinary (multer-storage-cloudinary)
    // use req.file.path. Otherwise fallback to body.coverImage (URL/manual input).
    const coverImage = req.file ? req.file.path : req.body.coverImage || null;

    const newBlog = await blogModel.create({
      blogId,
      authorId,
      title,
      content,
      coverImage,
      category,
      tags,
      status,
      publishedAt,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/*GET ALL BLOGS */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().sort({ createdAt: -1 }); // newest first
    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/*  GET SINGLE BLOG BY ID  */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow lookup by Mongo _id or custom blogId
    const blog = await blogModel.findOne({
      $or: [{ _id: id }, { blogId: id }]
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* UPDATE BLOG */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    //  Fix: Handle publishedAt properly
    if (!updateData.publishedAt || updateData.publishedAt === "null") {
      delete updateData.publishedAt;
    }

    // Handle cover image upload if file exists
    if (req.file) {
      updateData.coverImage = req.file.path;
    }

    const blog = await blogModel.findOneAndUpdate(
      { $or: [{ _id: id }, { blogId: id }] },
      updateData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, message: "Blog updated", data: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* DELETE BLOG */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findOneAndDelete({
      $or: [{ _id: id }, { blogId: id }]
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


