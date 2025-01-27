const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
});

const Seat = mongoose.model("Seat", seatSchema);
module.exports = Seat;
