import express from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js"; // your existing post model

const router = express.Router();

/* ============ Add New Comment ============ */
router.post("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, username, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const newComment = await Comment.create({
      postId,
      userId,
      username,
      content,
      createdAt: new Date(),
    });

    // increment comment count on post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete comment (only by its author)
router.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body; // frontend will send the current user's ID

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Allow deletion only by the same user
    if (comment.userId !== userId)
      return res.status(403).json({ message: "You can delete only your own comments" });

    await comment.deleteOne();

    // Decrement comment count in related post
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ============ Get Comments by Post ID ============ */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
