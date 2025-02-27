// const Hall = require("../model/Hall");

// const getAllHalls = async (req, res) => {
//   try {
//     const halls = await Hall.find()
//       .populate({
//         path: "showtimes",
//         populate: { path: "movieId" },
//       })
//       .populate("movies");

//     res.json(halls);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch halls" });
//   }
// };

// const getHallById = async (req, res) => {
//   try {
//     const hall = await Hall.findById(req.params.id)
//       .populate({
//         path: "showtimes",
//         populate: { path: "movieId" },
//       })
//       .populate("movies")
//       .populate("seats");

//     if (!hall) return res.status(404).json({ error: "Hall not found" });
//     res.json(hall);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch hall" });
//   }
// };

// const createHall = async (req, res) => {
//   try {
//     const { hall_name, capacity, price, movies } = req.body;

//     const newHall = new Hall({
//       hall_name,
//       capacity,
//       price,
//       movies,
//     });

//     await newHall.save();
//     res.status(201).json(newHall);
//   } catch (error) {
//     console.error("Error creating hall:", error);
//     res.status(400).json({ error: "Failed to create hall" });
//   }
// };

// const updateHall = async (req, res) => {
//   try {
//     const { hall_name, capacity, price, movies } = req.body;

//     const updatedHall = await Hall.findByIdAndUpdate(
//       req.params.id,
//       { hall_name, capacity, price, movies },
//       { new: true }
//     );

//     res.json(updatedHall);
//   } catch (error) {
//     console.error("Error updating hall:", error);
//     res.status(400).json({ error: "Failed to update hall" });
//   }
// };

// const deleteHall = async (req, res) => {
//   try {
//     await Hall.findByIdAndDelete(req.params.id);
//     res.json({ message: "Hall deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete hall" });
//   }
// };

// const getHallsByMovieId = async (req, res) => {
//   try {
//     const { movieId } = req.params;

//     if (!movieId) {
//       return res.status(400).json({ error: "Movie ID is required." });
//     }

//     const halls = await Hall.find({ movies: movieId })
//       .populate("movies", "movie_name" , "genre" , "duration")
//       .populate({
//         path: "showtimes",
//         populate: { path: "movieId", select: "movie_name start_time end_time" },
//       });

//     if (!halls || halls.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No halls found for this movie." });
//     }

//     res.status(200).json(halls);
//   } catch (error) {
//     console.error("Error fetching halls:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   getAllHalls,
//   getHallById,
//   createHall,
//   updateHall,
//   deleteHall,
//   getHallsByMovieId,
// };

const Hall = require("../model/Hall");
const mongoose = require("mongoose");

//const movie =
// 🏛️ Get all halls with their showtimes
const getAllHalls = async (req, res) => {
  try {
    console.log("Fetching all halls..."); // Debugging step

    const halls = await Hall.find()
      .populate({
        path: "showtimes",
        populate: { path: "movieId", select: "movie_name start_time end_time" },
      })
      .populate("movies", "movie_name") //  Ensure only movie_name is fetched
      .populate("seats", "seatId"); //  Populate seats if available

    if (!halls || halls.length === 0) {
      return res.status(404).json({ message: "No halls found." });
    }

    console.log("Halls fetched successfully:", halls.length);
    res.status(200).json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch halls", details: error.message });
  }
};

// 🏛️ Get details of a specific hall (with movies & seats)
const getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id)
      .populate({
        path: "showtimes",
        populate: { path: "movieId" },
      })
      .populate("movies")
      .populate("seats");
    //  Populate movies here

    if (!hall) return res.status(404).json({ error: "Hall not found" });
    res.json(hall);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hall" });
  }
};

// 🏛️ Add a new hall
const createHall = async (req, res) => {
  try {
    const { hall_name, capacity, price, movies } = req.body;

    const newHall = new Hall({
      hall_name,
      capacity,
      price,
      movies, //  Store movie IDs
    });

    await newHall.save();
    res.status(201).json(newHall);
  } catch (error) {
    console.error("Error creating hall:", error);
    res.status(400).json({ error: "Failed to create hall" });
  }
};

// 🏛️ Update a hall (e.g., price, seats, etc.)
const updateHall = async (req, res) => {
  try {
    const { hall_name, capacity, price, movies } = req.body;

    const updatedHall = await Hall.findByIdAndUpdate(
      req.params.id,
      { hall_name, capacity, price, movies }, //  Ensure movies are updated
      { new: true }
    );

    res.json(updatedHall);
  } catch (error) {
    console.error("Error updating hall:", error);
    res.status(400).json({ error: "Failed to update hall" });
  }
};

// 🏛️ Delete a hall
// const deleteHall = async (req, res) => {
//   try {
//     await Hall.findByIdAndDelete(req.params.id);
//     res.json({ message: "Hall deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete hall" });
//   }
// };
const deleteHall = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim(); //  Remove any spaces or newlines

    //  Check if `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Hall ID format." });
    }

    //  Check if the hall exists
    const hall = await Hall.findById(id);
    if (!hall) {
      return res.status(404).json({ error: "Hall not found." });
    }

    //  Delete the hall
    await Hall.findByIdAndDelete(id);
    res.json({ message: "Hall deleted successfully" });
  } catch (error) {
    console.error("Error deleting hall:", error);
    res
      .status(500)
      .json({ error: "Failed to delete hall", details: error.message });
  }
};

// const getHallsByMovieId = async (req, res) => {
//   try {
//     const { movieId } = req.params;

//     //  Validate movieId before querying
//     if (!movieId) {
//       return res.status(400).json({ error: "Movie ID is required." });
//     }

//     //  Find halls that have this movie assigned
//     const halls = await Hall.find({ movies: movieId })
//       .populate("movies", "movie_name") //  Populate movie details (only movie_name)
//       .populate({
//         path: "showtimes",
//         populate: { path: "movieId", select: "movie_name start_time end_time" }, //  Populate showtimes too if needed
//       });

//     if (!halls || halls.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No halls found for this movie." });
//     }

//     res.status(200).json(halls);
//   } catch (error) {
//     console.error("Error fetching halls:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getHallsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Find halls where this movie is playing
    const halls = await Hall.find({ movies: movieId }).populate("movies");

    if (halls.length === 0) {
      return res
        .status(404)
        .json({ message: "No halls found for this movie." });
    }

    res.status(200).json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  getHallsByMovieId,
};
