// TRANING THE MODEL
// models/Movies.js

const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes whitespace
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
