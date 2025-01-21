const { required } = require("joi");
const mongooose = require("mongoose");

const movieSchema = new mongooose.Schema({
  movie_name: {
    type: String,
    required: true,
  },
  movie_image: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    required: false,
  },
  genre: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  release_date: {
    type: String,
    required: false,
  },
  cast_image: {
    type: String,
    required: false,
  },
  cast_name: {
    type: String,
    required: false,
  },
  rating: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["upcoming", "released"], // Enum for movie status
    default: "upcoming",
  },
});

const Movie = mongooose.model("movies", movieSchema);

module.exports = Movie;
