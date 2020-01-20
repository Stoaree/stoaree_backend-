import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  timestamps: {
    required: true
  }
});

export const CommentModel = mongoose.model("Comment", commentSchema);
