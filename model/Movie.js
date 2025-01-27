const { required } = require("joi");
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movie_name: {
    type: String,
    required: true,
  },
  movie_image: {
    type: String,
  },
  title: {
    type: String,
    required: false,
  },
  genre: {
    type: String,
    required: false,
  },
  language: {
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
    enum: ["Upcoming", "Released"], // Enum for movie status
    default: "Upcoming",
  },
  trailer_url: {
    type: String,
    required: true, // Make it optional
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/.test(
          v
        ); // Regex to validate URL format
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  // large_image: {
  //   type: String,
  // },
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
