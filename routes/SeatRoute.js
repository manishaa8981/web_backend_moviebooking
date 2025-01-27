const express = require("express");
const router = express.Router();
const {
  createSeat,
  getSeats,
  getSeatsStatus,
  bookSeat,
  unbookSeat,
} = require("../controller/SeatController");
// const { authenticateToken } = require("../security/Auth");
// requireSignin
// Routes for seat operations
router.post("/create", createSeat); // Create a new seat
router.get("/", getSeats); // Get all seats
router.get("/status", getSeatsStatus); // Get available and unavailable seats
router.post("/book", bookSeat); // Book a seat
router.post("/unbook", unbookSeat); // Unbook a s
module.exports = router;
