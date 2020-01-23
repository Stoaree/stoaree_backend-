const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    isTopLevel: {
      type: Boolean,
      required: false
    },
    isYesOrNo: {
      type: Boolean,
      required: false
    },
    subQuestions: {
      type: [ObjectId],
      required: false
    },
    audioFileURL: {
      type: String,
      required: false
    },
    isMaster: {
      type: Boolean,
      required: false
    }
  }
);

module.exports = mongoose.model("question", questionSchema);