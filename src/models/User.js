const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
   email: {
     type: String,
     required: true
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

   avatar: {
     type: String,
     required: false
   }
  }
);

module.exports = mongoose.model("user", userSchema);