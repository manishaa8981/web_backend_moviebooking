const Seat = require("../model/Seat");

const save = async (req, res) => {
  try {
    const { seat_image, seat_number, audiId, row_number, is_available, } =
      req.body;
    const seat = new Seat({
      seat_image,
      seat_number,
      audiId,
      row_number,
      is_available,
    });
    await seat.save();
    res.status(201).json(seat);
  } catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(res.params.id);
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(seat);
  } catch (e) {
    res.json(e);
  }
};

module.exports = {
  save,
  deleteById,
  update,
};
