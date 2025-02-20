const mongoose = require("mongoose");

const showTimeSchema = new mongoose.Schema({
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
});

const ShowTime = mongoose.model("ShowTime", showTimeSchema);

module.exports = ShowTime;
