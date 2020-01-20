import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  timeStamps: {
    required: true
  }
});

export const CommentModel = mongoose.model("Comment", commentSchema);
