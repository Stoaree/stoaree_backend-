const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

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
    interviewer: {
      type: ObjectId,
      ref: "user",
      required: true
    },
    interviewee: {
      type: ObjectId,
      ref: "user",
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
    },
    imageURL: {
      type: String,
      required: false
    }
  }, { timestamps: true });

module.exports = mongoose.model("story", storySchema);