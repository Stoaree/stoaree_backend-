const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {

  }
);

module.exports = mongoose.model("question", questionSchema);