const Seat = require("../model/Seat");
const Hall = require("../model/Hall");
const ShowTime = require("../model/ShowTime");

const createSeats = async (req, res) => {
  try {
    const { hallId, showtimeId, totalRows, seatsPerRow } = req.body;

    if (!hallId || !showtimeId || !totalRows || !seatsPerRow) {
      return res.status(400).json({
        message: "hallId, showtimeId, totalRows, and seatsPerRow are required",
      });
    }

    const [hallExists, showtimeExists] = await Promise.all([
      Hall.findById(hallId),
      ShowTime.findById(showtimeId),
    ]);

    if (!hallExists) return res.status(404).json({ message: "Hall not found" });
    if (!showtimeExists)
      return res.status(404).json({ message: "ShowTime not found" });

    const existingSeats = await Seat.countDocuments({ hallId, showtimeId });
    if (existingSeats > 0) {
      return res
        .status(400)
        .json({ message: "Seats already exist for this hall and showtime" });
    }

    // Generate seat layout
    let seats = [];
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        seats.push({
          hallId,
          showtimeId,
          seatRow: row,
          seatColumn: col,
          seatName: generateSeatName(row, col), 
          seatStatus: false, // false = Available
        });
      }
    }

    // Bulk insert seats
    const createdSeats = await Seat.insertMany(seats);
    res
      .status(201)
      .json({ message: "Seats created successfully", seats: createdSeats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating seats", error: error.message });
  }
};

// Generate seat names (Handles A-Z, AA-ZZ, etc.)
const generateSeatName = (row, col) => {
  let rowLabel = "";
  let rowNum = row;
  while (rowNum > 0) {
    rowNum--; 
    rowLabel = String.fromCharCode(65 + (rowNum % 26)) + rowLabel;
    rowNum = Math.floor(rowNum / 26);
  }
  return `${rowLabel}${col}`;
};

const getSeatsByHall = async (req, res) => {
  try {
    const seats = await Seat.find({ hallId: req.params.hallId }).populate(
      "hallId showtimeId"
    );
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch seats" });
  }
};

const getAvailableSeats = async (req, res) => {
  try {
    const seats = await Seat.find({
      showtimeId: req.params.showtimeId,
      seatStatus: false,
    });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available seats" });
  }
};

const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    if (seat.seatStatus)
      return res.status(400).json({ error: "Seat already booked" });

    seat.seatStatus = true;
    await seat.save();

    res.json({ message: "Seat booked successfully", seat });
  } catch (error) {
    res.status(400).json({ error: "Failed to book seat" });
  }
};

const cancelSeatBooking = async (req, res) => {
  try {
    const { seatId } = req.body;

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ error: "Seat not found" });

    seat.seatStatus = false;
    await seat.save();

    res.json({ message: "Booking canceled successfully", seat });
  } catch (error) {
    res.status(400).json({ error: "Failed to cancel booking" });
  }
};

const deleteSeatsByShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    await Seat.deleteMany({ showtimeId });
    res.json({ message: "All seats for the showtime deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete seats" });
  }
};

module.exports = {
  createSeats,
  getSeatsByHall,
  getAvailableSeats,
  bookSeat,
  cancelSeatBooking,
  deleteSeatsByShowtime,
};
