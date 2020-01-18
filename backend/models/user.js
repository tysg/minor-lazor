const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  personalPhoto: {
    type: String,
    required: true
  },
  photos: [{ type: mongoose.Schema.ObjectId, ref: "photo" }]
});

module.exports = {
  User: mongoose.model("user", UserSchema)
};
