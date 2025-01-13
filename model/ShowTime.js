const mongoose = require("mongoose");
const showTimSchema = new mongoose.Schema({
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
    ref: "movies",
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "halls",
  },
});

const ShowTime = mongoose.model("showtimes", showTimSchema);

module.exports = ShowTime;
