import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const CommentModel = mongoose.model("Comment", commentSchema);
