const { required } = require("joi");
const mongooose = require("mongoose");

const movieSchema = new mongooose.Schema({
  movie_name: {
    type: String,
    required: true,
  },
  movie_image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  cast_image: {
    type: String,
    required: true,
  },
  castt_name: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "released", "archived"], // Enum for movie status
    default: "upcoming",
  },
});

const Movie = mongooose.model("movies", movieSchema);

module.exports = Movie;
