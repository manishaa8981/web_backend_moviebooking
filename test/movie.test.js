import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import { server } from "../app.js"; //  Import the server instance

const { expect } = chai;
chai.use(chaiHttp);

describe("🎬 Movie API Tests", () => {
  let movieId;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  after(() => {
    server.close(); //  Properly close the server after tests
  });

  //  Create Movie Test
  it("should create a new movie", (done) => {
    const newMovie = {
      movie_name: "Test Movie",
      genre: "Action",
      language: "English",
      duration: "2h",
      description: "A test movie",
      release_date: "2024-10-10",
      cast_image: "test_cast.jpg",
      cast_name: "Test Actor",
      rating: "PG",
      status: "Released",
      trailer_url: "https://www.youtube.com/test",
    };

    chai
      .request(server) //  Use the server instance, NOT app
      .post("/api/movie")
      .send(newMovie)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property(
          "message",
          "Movie saved successfully"
        );
        expect(res.body.movie).to.have.property("movie_name", "Test Movie");
        movieId = res.body.movie._id;
        done();
      });
  });

  //  Fetch All Movies
  it("should fetch all movies", (done) => {
    chai
      .request(server) //  Use server
      .get("/api/movie")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  //  Fetch a Movie by ID
  it("should fetch a single movie by ID", (done) => {
    chai
      .request(server)
      .get(`/api/movie/${movieId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("movie_name", "Test Movie");
        done();
      });
  });

  //  Update Movie
  it("should update an existing movie", (done) => {
    const update = {
      movie_name: "Updated Test Movie",
      rating: "PG-13",
    };

    chai
      .request(server)
      .put(`/api/movie/${movieId}`)
      .send(update)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          "message",
          "Movie updated successfully"
        );
        done();
      });
  });

  //  Delete Movie
  it("should delete a movie", (done) => {
    chai
      .request(server)
      .delete(`/api/movie/${movieId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          "message",
          "Movie deleted successfully"
        );
        done();
      });
  });
});
