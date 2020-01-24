const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    displayName: {
      type: String,
      required: true
    },

    dateOfBirth: {
      type: Date,
      required: false
    },

    location: {
      type: String,
      required: false
    },

    avatarURL: {
      type: String,
      required: false
    }
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);