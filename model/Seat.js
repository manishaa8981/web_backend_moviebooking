const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_image: {
    type: String,
    required: true,
  },
  seat_number: {
    type: String,
    required: true,
  },
  audiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "audis",
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
