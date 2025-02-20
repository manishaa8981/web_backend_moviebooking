const Booking = require("../model/Booking");
const ShowTime = require("../model/ShowTime");

const findAll = async (req, res) => {
  try {
    const booking = await Booking.find().populate(["customerId", "showTimeId"]);
    res.status(200).json(booking);
  } catch (e) {
    res.join(e);
  }
};

const save = async (req, res) => {
  try {
    const {
      seats_booked,
      total_price,
      booking_date,
      booking_status,
      customerId,
      showTimeId,
    } = req.body;
    const booking = new Booking({
      seats_booked,
      total_price,
      booking_date,
      booking_status,
      customerId,
      showTimeId,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (e) {
    res.json(e);
  }
};
const findById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};
const update = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(booking);
  } catch (e) {
    res.json(e);
  }
};

const userbooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch booking details and populate related fields
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "showtimeId",
        populate: { path: "movieId hallId" },
      })
      .populate("seats");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Structure the data in a ticket format
    const ticketDetails = {
      ticketId: booking._id,
      movieName: booking.showtimeId.movieId.movie_name,
      showDate: booking.showtimeId.date,
      showTime: `${booking.showtimeId.start_time} - ${booking.showtimeId.end_time}`,
      hallName: booking.showtimeId.hallId.hall_name,
      seats: booking.seats.map((seat) => seat.seatName),
      totalAmount: `₹${booking.total_price}`,
      posterUrl: booking.showtimeId.movieId.poster_url || "/default_poster.png",
      status: booking.status,
      paymentStatus: booking.payment_status,
    };

    res.json(ticketDetails);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
  userbooking,
};
