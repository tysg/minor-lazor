const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PhotoSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  user: { type: mongoose.Schema.ObjectId, ref: "user" }
});

module.exports = {
  Photo: mongoose.model("photos", PhotoSchema)
};
