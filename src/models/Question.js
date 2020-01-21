const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    audioFileURL: {
      type: String,
      required: false
    }
  }
);

module.exports = mongoose.model("user", questionSchema);