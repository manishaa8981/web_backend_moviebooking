const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;
const Movie = require("../model/Movie");
const mongoose = require("mongoose");

chai.use(chaiHttp);

let movieId;
let authToken;

describe(" Movie API Tests", () => {
  // Before all tests, connect to the database
  before(async () => {
    await mongoose.connect(process.env.TEST_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // If authentication is required, get a token
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    authToken = res.body.token;
  });

  // Cleanup after tests
  after(async () => {
    await Movie.deleteMany({});
    await mongoose.connection.close();
  });

  // Test fetching all movies
  describe("GET /api/movie", () => {
    it("Should fetch all movies", async () => {
      const res = await chai.request(app).get("/api/movie");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });


  // Test fetching a single movie
  describe("GET /api/movie/:id", () =>{ 
    it("Should return 404 for a non-existent movie", async () => {
      const res = await chai
        .request(app)
        .get("/api/movie/660f01b4f5e123456789abcd");
      expect(res).to.have.status(404);
    });
  });

  //  Test updating a movie
  describe("PUT /api/movie/:id", () => {
    it("Should return 404 for a non-existent movie update", async () => {
      const res = await chai
        .request(app)
        .put("/api/movie/660f01b4f5e123456789abcd")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ movie_name: "Non-existent Movie" });

      expect(res).to.have.status(404);
    });
  });


});
