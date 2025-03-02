const ShowTime = require("../model/ShowTime");
const Seat = require("../model/Seat");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Booking = require("../model/Booking");
const Customer = require("../model/Customer");

const sendTicketEmail = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch booking details
    const booking = await Booking.findById(bookingId)
      .populate("customerId", "username email")
      .populate("showtimeId", "start_time end_time date")
      .populate("seats", "seatName")
      .populate({
        path: "showtimeId",
        populate: { path: "movieId", select: "movie_name" },
      });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    //  Create a ticket PDF
    const ticketPath = path.join(
      __dirname,
      `../tickets/ticket_${booking._id}.pdf`
    );
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(ticketPath));

    doc.fontSize(20).text("🎟 Movie Ticket 🎬", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Movie: ${booking.showtimeId.movieId.movie_name}`);
    doc.text(
      `Showtime: ${booking.showtimeId.start_time} - ${booking.showtimeId.end_time}`
    );
    doc.text(`Date: ${new Date(booking.showtimeId.date).toDateString()}`);
    doc.text(`Seats: ${booking.seats.map((seat) => seat.seatName).join(", ")}`);
    doc.text(`Total Price: ₹${booking.total_price}`);
    doc.text(`Payment Status: ${booking.payment_status}`);
    doc.text(`Customer: ${booking.customerId.username}`);
    doc.text(`Email: ${booking.customerId.email}`);
    doc.end();

    //  Email content (HTML Format)
    const emailContent = `
      <h2>🎟 Movie Ticket Confirmation</h2>
      <p>Hi <b>${booking.customerId.username}</b>,</p>
      <p>Thank you for booking your movie ticket with us!</p>
      <ul>
        <li><b>Movie:</b> ${booking.showtimeId.movieId.movie_name}</li>
        <li><b>Showtime:</b> ${booking.showtimeId.start_time} - ${
      booking.showtimeId.end_time
    }</li>
        <li><b>Date:</b> ${new Date(
          booking.showtimeId.date
        ).toDateString()}</li>
        <li><b>Seats:</b> ${booking.seats
          .map((seat) => seat.seatName)
          .join(", ")}</li>
        <li><b>Total Price:</b> ₹${booking.total_price}</li>
        <li><b>Payment Status:</b> ${booking.payment_status}</li>
      </ul>
      <p>Your ticket is attached to this email. Enjoy your movie! 🎬</p>
    `;

    //  Send email
    await sendEmail(
      booking.customerId.email,
      "Your Movie Ticket",
      emailContent,
      [{ filename: `ticket_${booking._id}.pdf`, path: ticketPath }]
    );

    res.status(200).json({ message: "Ticket sent successfully!", ticketPath });
  } catch (error) {
    console.error("Error sending ticket:", error);
    res.status(500).json({ message: "Failed to send ticket", error });
  }
};
module.exports = { sendTicketEmail };

//  Get all bookings
const findAll = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "customerId",
        select: "username email contact_no", 
      })
      .populate({
        path: "showtimeId",
        populate: [
          { path: "movieId", select: "movie_name" }, 
          { path: "hallId", select: "hall_name" }, 
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
    const { customerId, seats, showtimeId } = req.body;

    console.log(req.body);

    //  Check if Customer Exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    //  Check if Showtime Exists
    const showtimeExists = await ShowTime.findById(showtimeId);
    if (!showtimeExists) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    //  Check if Seats are Selected
    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    //  Calculate Total Price
    const total_price = seats.length * 300;

    //  Store Booking
    const booking = new Booking({
      customerId,
      seats,
      showtimeId,
      total_price,
    });
    const savedBooking = await booking.save();

    console.log("Saved Booking:", savedBooking); 

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: savedBooking._id, 
      booking: savedBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

//  Get booking by ID
const findById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customerId", "username email contact_no") 
      .populate("seats", "seatRow seatName")
      .populate({
        path: "showtimeId",
        populate: { path: "movieId", select: "movie_name duration genre" },
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Update booking details
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, seats, showtimeId, status, payment_status } = req.body;

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

    const total_price = seats ? seats.length * 300 : booking.total_price;

    //  Update booking details
    booking = await Booking.findByIdAndUpdate(
      id,
      {
        customerId,
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
  sendTicketEmail,
};
