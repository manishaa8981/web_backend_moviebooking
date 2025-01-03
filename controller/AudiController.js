const Audi = require("../model/Audi");

const save = async (resizeBy, req) => {
  try {
    const { capacity, seatId } = req.body;
    const audi = new Audi({
      capacity,
      seatId,
    });
    await audi.save();
    resizeBy.status(201).json(audi);
  } catch (e) {
    resizeBy.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const audi = await Audi.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const audi = await Audi.findByIdAndUpdate(req.paramsid, req.body, {
      new: true,
    });
  } catch (e) {
    res.json(e);
  }
};

module.exports = { save, deleteById, update };
