const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    audioFiles: {
      type: String,
      required: false
    }
  }
);

module.exports = mongoose.model("user", userSchema);