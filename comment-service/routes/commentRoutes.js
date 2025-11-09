import express from "express";
import Joi from "joi";
import Comment from "../models/Comment.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Comment
router.post("/", authenticate, async (req, res) => {
  try {
    const schema = Joi.object({
      postId: Joi.string().required(),
      content: Joi.string().min(2).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Ensure we have a user ID
    if (!req.user || !req.user.id) {
      console.error('No user ID found in request:', req.user);
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const commentData = {
      userId: req.user.id,
      postId: req.body.postId,
      content: req.body.content,
    };

    console.log('Creating comment with data:', commentData);

    const comment = await Comment.create(commentData);
    console.log('Comment created successfully:', comment);

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Comments for a Post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Comment (only owner)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
