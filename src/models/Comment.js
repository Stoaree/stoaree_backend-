const mongoose = require("mongoose");

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

module.exports = mongoose.model("comment", commentSchema);
