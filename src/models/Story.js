const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    tags: {
      type: [String],
      required: true
    },
    comments: {
      type: [ObjectId],
      required: true
    },
    questions: {
      type: [ObjectId],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("story", storySchema);