const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_number: {
    type: String,
    required: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "halls",
  },
  row_number: {
    type: String,
    required: true,
  },
  is_available: {
    type: Boolean,
    required: true,
  },
});

const Seat = mongoose.model("seats", seatSchema);

module.exports = Seat;
