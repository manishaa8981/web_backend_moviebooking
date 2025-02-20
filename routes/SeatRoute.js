// const express = require("express");
// const router = express.Router();
// const {
//   createSeats,
//   getSeatsByHall,
//   deleteSeatsByHall,
//   bookSeat,
//   cancelSeatBooking,
// } = require("../controller/SeatController");

// router.post("/create", createSeats);
// router.get("/:hallId", getSeatsByHall);
// router.patch("/book/:seatId", bookSeat);
// router.patch("/cancel/:seatId",cancelSeatBooking);
// router.delete("/:hallId", deleteSeatsByHall);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createSeats,
  getSeatsByHall,
  getAvailableSeats,
  bookSeat,
  cancelSeatBooking,
  deleteSeatsByShowtime,
} = require("../controller/SeatController");

router.post("/", createSeats);
router.get("/hall/:hallId", getSeatsByHall); 
router.get("/showtime/:showtimeId", getAvailableSeats); 
router.post("/book", bookSeat); 
router.post("/cancel", cancelSeatBooking); 
router.delete("/showtime/:", deleteSeatsByShowtime);

module.exports = router;
