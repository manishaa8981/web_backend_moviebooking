const mongoose = require("mongoose");
const showTimSchema = new mongoose.Schema({
  start_time: {
    type: Time,
    required: true,
  },
  end_time: {
    type: Time,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const ShowTime = mongooose.model("showtimes", showTimSchema);

module.exports = ShowTime;
