const mongoose = require("mongoose");
const ShowTime = require("../model/ShowTime");
const hallSchema = new mongoose.Schema({
  hall_name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
  showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ShowTime" }],
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
});

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
