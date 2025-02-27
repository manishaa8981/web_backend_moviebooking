// const ShowTime = require("../model/ShowTime");
// const Hall = require("../model/Hall");
// const mongoose = require("mongoose");

// const getAllShowTimes = async (req, res) => {
//   try {
//     const showtimes = await ShowTime.find()
//       .populate("movieId", "movie_name")
//       .populate("hallId", "hall_name");
//     res.json(showtimes);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch showtimes" });
//   }
// };

// const getShowTimeById = async (req, res) => {
//   try {
//     const showtime = await ShowTime.findById(req.params.id).populate(
//       "movieId hallId"
//     );
//     if (!showtime) return res.status(404).json({ error: "ShowTime not found" });
//     res.json(showtime);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch showtime" });
//   }
// };

// const createShowTime = async (req, res) => {
//   try {
//     const { movieId, hallId, start_time, end_time, date } = req.body;

//     if (!movieId || !hallId || !start_time || !end_time || !date) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const newShowTime = new ShowTime({
//       movieId,
//       hallId,
//       start_time,
//       end_time,
//       date,
//     });
//     await newShowTime.save();
//     await Hall.findByIdAndUpdate(hallId, {
//       $push: { showtimes: newShowTime._id },
//     });

//     res.status(201).json(newShowTime);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "Failed to create showtime", details: error.message });
//   }
// };

// const updateShowTime = async (req, res) => {
//   try {
//     const updatedShowTime = await ShowTime.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedShowTime)
//       return res.status(404).json({ error: "Showtime not found" });

//     res.json(updatedShowTime);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "Failed to update showtime", details: error.message });
//   }
// };

// const deleteShowTime = async (req, res) => {
//   try {
//     const deletedShowTime = await ShowTime.findByIdAndDelete(req.params.id);

//     if (!deletedShowTime)
//       return res.status(404).json({ error: "Showtime not found" });

//     await Hall.findByIdAndUpdate(deletedShowTime.hallId, {
//       $pull: { showtimes: deletedShowTime._id },
//     });

//     res.json({ message: "Showtime deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to delete showtime", details: error.message });
//   }
// };

// const getShowtimesByMovie = async (req, res) => {
//   try {
//     let { movieId } = req.params;

//     movieId = movieId.trim();

//     if (!mongoose.Types.ObjectId.isValid(movieId)) {
//       return res.status(400).json({ error: "Invalid movieId format" });
//     }

//     const showtimes = await ShowTime.find({ movieId })
//       .populate("hallId", "hall_name")
//       .populate("movieId", "movie_name", "genre", "duration");

//     if (!showtimes.length) {
//       return res
//         .status(404)
//         .json({ message: "No showtimes found for this movie" });
//     }

//     res.status(200).json(showtimes);
//   } catch (error) {
//     console.error("Error in getShowtimesByMovie:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching showtimes", error: error.message });
//   }
// };

// module.exports = {
//   getAllShowTimes,
//   getShowTimeById,
//   createShowTime,
//   updateShowTime,
//   deleteShowTime,
//   getShowtimesByMovie,
// };
const ShowTime = require("../model/ShowTime");
const Hall = require("../model/Hall");
const mongoose = require("mongoose");

// const getAllShowTimes = async (req, res) => {
//   try {
//     const showtimes = await ShowTime.find()
//       .populate("movieId", "movie_name")
//       .populate("hallId", "hall_name");
//     res.json(showtimes);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch showtimes" });
//   }
// };

const getAllShowTimes = async (req, res) => {
  try {
    const showtimes = await ShowTime.find()
      .populate("movieId", "movie_name movie_image description")
      .populate("hallId", "hall_name");
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
};

const getShowTimeById = async (req, res) => {
  try {
    const showtime = await ShowTime.findById(req.params.id).populate(
      "movieId hallId"
    );
    if (!showtime) return res.status(404).json({ error: "ShowTime not found" });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch showtime" });
  }
};

const createShowTime = async (req, res) => {
  try {
    const { movieId, hallId, start_time, end_time, date } = req.body;

    if (!movieId || !hallId || !start_time || !end_time || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newShowTime = new ShowTime({
      movieId,
      hallId,
      start_time,
      end_time,
      date,
    });
    await newShowTime.save();
    await Hall.findByIdAndUpdate(hallId, {
      $push: { showtimes: newShowTime._id },
    });

    res.status(201).json(newShowTime);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create showtime", details: error.message });
  }
};

const updateShowTime = async (req, res) => {
  try {
    const updatedShowTime = await ShowTime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedShowTime)
      return res.status(404).json({ error: "Showtime not found" });

    res.json(updatedShowTime);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update showtime", details: error.message });
  }
};

const deleteShowTime = async (req, res) => {
  try {
    const deletedShowTime = await ShowTime.findByIdAndDelete(req.params.id);

    if (!deletedShowTime)
      return res.status(404).json({ error: "Showtime not found" });

    await Hall.findByIdAndUpdate(deletedShowTime.hallId, {
      $pull: { showtimes: deletedShowTime._id },
    });

    res.json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete showtime", details: error.message });
  }
};

const getShowtimesByMovie = async (req, res) => {
  try {
    let { movieId } = req.params;

    movieId = movieId.trim();

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid movieId format" });
    }

    const showtimes = await ShowTime.find({ movieId })
      .populate("hallId", "hall_name")
      .populate("movieId", "movie_name");

    if (!showtimes.length) {
      return res
        .status(404)
        .json({ message: "No showtimes found for this movie" });
    }

    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error in getShowtimesByMovie:", error);
    res
      .status(500)
      .json({ message: "Error fetching showtimes", error: error.message });
  }
};

module.exports = {
  getAllShowTimes,
  getShowTimeById,
  createShowTime,
  updateShowTime,
  deleteShowTime,
  getShowtimesByMovie,
};
