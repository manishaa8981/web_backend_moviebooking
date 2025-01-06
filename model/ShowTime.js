const mongoose = require("mongoose");
const Threater = require("./Threater");
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
  threaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "threaters",
  },
});

const ShowTime = mongoose.model("showtimes", showTimSchema);

module.exports = ShowTime;
