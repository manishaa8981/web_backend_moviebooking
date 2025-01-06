const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  seats_booked: {
    type: [String], // Assuming seats are identified by seat numbers or IDs
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  booking_date: {
    type: Date,
    required: true,
  },
  booking_status: {
    type: Boolean,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  showTimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "showtimes",
    required: true,
  },
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
