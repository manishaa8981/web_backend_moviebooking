const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js"); // Your Express server
const ShowTime = require("../model/ShowTime.js");
const Movie = require("../model/Movie.js");
const Hall = require("../model/Hall.js");
const dotenv = require("dotenv");

dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;

describe("🎭 ShowTime API Tests", function () {
  this.timeout(20000); // Increase timeout for DB operations

  let showtimeId, movieId, hallId;

  before(async function () {
    console.log("🔄 Connecting to Test Database...");

    try {
      await mongoose.connect(process.env.TEST_DATABASE);
      console.log(" MongoDB Connected!");

      //  Clear previous test data
      await ShowTime.deleteMany({});
      await Movie.deleteMany({});
      await Hall.deleteMany({});
      console.log("🗑️ Test Database Cleared.");

      //  Create a test movie
      const movie = new Movie({
        movie_name: "Test Movie",
        genre: "Action",
        language: "English",
        duration: "2h 30m",
        description: "A test movie description",
        release_date: "2025-01-01",
        cast_name: "Test Actor",
        rating: "8.5",
        status: "Released",
        trailer_url: "https://www.youtube.com/watch?v=test",
      });

      const savedMovie = await movie.save();
      movieId = savedMovie._id;

      //  Create a test hall
      const hall = new Hall({
        hall_name: "Test Hall",
        capacity: 100,
        price: 500,
      });

      const savedHall = await hall.save();
      hallId = savedHall._id;

      console.log("🎬 Test Movie & Hall Created!");
    } catch (error) {
      console.error("❌ Error in before() setup:", error);
      this.skip();
    }
  });

  // **TEST 1: Create a new showtime**
  it("should create a new showtime", async function () {
    const showtimeData = {
      movieId,
      hallId,
      start_time: "10:00 AM",
      end_time: "12:30 PM",
      date: "2025-06-15",
    };

    const res = await chai
      .request(server)
      .post("/api/showtime")
      .send(showtimeData);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("movieId", movieId.toString());
    expect(res.body).to.have.property("hallId", hallId.toString());
    expect(res.body).to.have.property("start_time", showtimeData.start_time);
    expect(res.body).to.have.property("end_time", showtimeData.end_time);

    showtimeId = res.body._id; // Store ID for future tests
  });

  // **TEST 3: Update a showtime**
  it("should update the showtime's start time", async function () {
    const updatedData = { start_time: "11:00 AM" };

    const res = await chai
      .request(server)
      .put(`/api/showtime/${showtimeId}`)
      .send(updatedData);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("start_time", updatedData.start_time);

    // Verify the change in DB
    const updatedShowTime = await ShowTime.findById(showtimeId);
    expect(updatedShowTime.start_time).to.equal(updatedData.start_time);
  });

  // **TEST 4: Delete a showtime**
  it("should delete the showtime", async function () {
    const res = await chai
      .request(server)
      .delete(`/api/showtime/${showtimeId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      "message",
      "Showtime deleted successfully"
    );

    // Ensure it's deleted
    const deletedShowTime = await ShowTime.findById(showtimeId);
    expect(deletedShowTime).to.be.null;
  });

  // **TEST 5: Retrieve a non-existent showtime**
  it("should return 404 for a non-existent showtime", async function () {
    const res = await chai.request(server).get(`/api/showtime/${showtimeId}`);
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error", "ShowTime not found");
  });

  after(async function () {
    console.log("🗑️ Cleaning up test data...");
    await mongoose.connection.close();
  });
});
