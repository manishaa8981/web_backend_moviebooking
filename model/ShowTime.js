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
    ref: "movies", // Assuming you have a Movie model
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "halls", // Assuming you have a Hall model
    required: true,
  },
});

const ShowTime = mongoose.model("showTimes", showTimeSchema);
module.exports = ShowTime;
