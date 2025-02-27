const Booking = require("../model/Booking");
const ShowTime = require("../model/ShowTime");
const Seat = require("../model/Seat"); //  Ensure Seat model is imported

//  Get all bookings
const findAll = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "userId",
        select: "username email", //  Fetch only user details
      })
      .populate({
        path: "showtimeId",
        populate: [
          { path: "movieId", select: "movie_name" }, //  Fetch movie name
          { path: "hallId", select: "hall_name" }, //  Fetch hall details
        ],
      })
      .populate("seats", "seatName"); //  Fetch seat details

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

//  Save new booking
const save = async (req, res) => {
  try {
    const { userId, seats, showtimeId } = req.body;
    console.log(req.body);    

    //  Ensure Showtime Exists
    const showtimeExists = await ShowTime.findById(showtimeId);
    if (!showtimeExists) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    //  Ensure Seats Exist
    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    //  Calculate total price (assuming ₹300 per seat)
    const total_price = seats.length * 300;

    //  Create New Booking
    const booking = new Booking({
      userId,
      seats, //  Store Seats Properly
      showtimeId,
      total_price,
    });

    const savedBooking = await booking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};

//  Get booking by ID
const findById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "username email")
      .populate("seats", "seatRow seatName")
      .populate({
        path: "showtimeId",
        populate: {
          path: "movieId",
          select: "movie_name duration genre",
        },
      })
      .exec();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

//  Delete booking
const deleteById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Remove booking reference from ShowTime
    await ShowTime.findByIdAndUpdate(booking.showtimeId, {
      $pull: { bookings: booking._id },
    });

    //  Mark seats as available
    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { seatStatus: false }
    );

    //  Delete booking
    await booking.deleteOne();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};

//  Fetch user-specific booking (for Ticket Page)
const userbooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "showtimeId",
        populate: [
          { path: "movieId", select: "movie_name movie_image" },
          { path: "hallId", select: "hall_name" },
        ],
      })
      .populate("seats", "seatName")
      .exec();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const ticketDetails = {
      ticketId: booking._id,
      movieName: booking.showtimeId?.movieId?.movie_name || "Unknown Movie",
      showDate: booking.showtimeId?.date || "Unknown Date",
      showTime: `${booking.showtimeId?.start_time} - ${booking.showtimeId?.end_time}`,
      hallName: booking.showtimeId?.hallId?.hall_name || "Unknown Hall",
      seats: booking.seats.map((seat) => seat.seatName),
      totalAmount: `₹${booking.total_price || "0"}`,
      posterUrl:
        booking.showtimeId?.movieId?.movie_image || "/default_poster.png",
      status: booking.status,
      paymentStatus: booking.payment_status,
    };

    res.status(200).json(ticketDetails);
  } catch (error) {
    console.error("Error fetching user booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Update booking details
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, seats, showtimeId, status, payment_status } = req.body;

    //  Find existing booking
    let booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Validate new Showtime if changed
    if (showtimeId && showtimeId !== booking.showtimeId.toString()) {
      const showtimeExists = await ShowTime.findById(showtimeId);
      if (!showtimeExists) {
        return res.status(404).json({ message: "New showtime not found" });
      }
    }

    //  Update seat availability
    if (seats) {
      await Seat.updateMany(
        { _id: { $in: booking.seats } },
        { seatStatus: false }
      );
      await Seat.updateMany({ _id: { $in: seats } }, { seatStatus: true });
    }

    //  Calculate total price based on new seat count
    const total_price = seats ? seats.length * 10 : booking.total_price;

    //  Update booking details
    booking = await Booking.findByIdAndUpdate(
      id,
      {
        userId,
        seats: seats || booking.seats,
        showtimeId: showtimeId || booking.showtimeId,
        status,
        payment_status,
        total_price,
      },
      { new: true }
    );

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
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
