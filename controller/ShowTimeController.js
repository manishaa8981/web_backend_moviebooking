const ShowTime = require("../model/ShowTime");

const findAll = async (req, res) => {
  try {
    const showTime = await ShowTime.find();
    res.status(200).json(showTime);
  } catch (e) {
    res.json(e);
  }
};

const save = async (req, res) => {
  try {
    const { start_time, end_time, date } = req.body;
    const showTime = new ShowTime({
      start_time,
      end_time,
      date,
    });
    await showTime.save();
    res.status(201).json(showTime);
  } catch (e) {
    res.json(e);
  }
};

const findById = async (req, res) => {
  try {
    const showTime = await ShowTime.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};
const update = async (req, res) => {
  try {
    const showTime = await ShowTime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(showTime);
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
