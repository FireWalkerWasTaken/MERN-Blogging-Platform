import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
