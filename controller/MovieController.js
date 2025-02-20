const Movie = require("../model/Movie");

const findAll = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: error.message });
  }
};

const save = async (req, res) => {
  try {
    const {
      movie_name,
      genre,
      language,
      duration,
      description,
      release_date,
      cast_image,
      cast_name,
      rating,
      status,
      trailer_url,
      // large_image,
    } = req.body;

    const movie_image = req.file ? req.file.originalname : null;

    if (!movie_image) {
      return res.status(400).json({ message: "Movie image is required" });
    }

    // const large_image = req.file ? req.file.originalname : null;

    // if (!large_image) {
    //   return res.status(400).json({ message: "Movie image is required" });
    // }

    // Create a new movie instance
    const movie = new Movie({
      movie_name,
      movie_image: req.file.filename,
      genre,
      language,
      duration,
      description,
      release_date,
      cast_image,
      cast_name,
      rating,
      status,
      trailer_url,
      // large_image
    });
    const savedMovie = await movie.save();
    res.status(201).json({
      message: "Movie saved successfully",
      movie: savedMovie,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving movie", error: error.message });
  }
};

const findById = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json(movie);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};


const deleteById = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: error.message });
  }
};

// Update a movie by ID
// const update = async (req, res) => {
//   try {
//     const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!movie) {
//       return res.status(404).json({ message: "Movie not found" });
//     }
//     res.status(200).json({
//       message: "Movie updated successfully",
//       movie,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating movie", error: error.message });
//   }
// };
const update = async (req, res) => {
  try {
    console.log("")
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    Object.assign(movie, req.body);
    if (req.file) {
      movie.movie_image = req.file.filename; 
    }
    await movie.save();

    res.status(200).json({
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: error.message });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
};
