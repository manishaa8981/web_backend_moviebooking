const Booking = require("../model/Booking");

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

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
};
