const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  azurePersonId: {
    type: String,
  },
  personalPhoto: [{ type: String, required: true }],
  eventPhotos: [{ type: mongoose.Schema.ObjectId, ref: "photo" }]
});

module.exports = {
  User: mongoose.model("user", UserSchema)
};
