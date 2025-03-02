const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const server = require("../app.js"); // Ensure correct path to your Express app
const Seat = require("../model/Seat.js");
const Hall = require("../model/Hall.js");
const ShowTime = require("../model/ShowTime.js");

chai.use(chaiHttp);
const { expect } = chai;

let seatId, hallId, showtimeId;

describe("🎭 Seat API Tests", function () {
  this.timeout(20000); //  Increase timeout for DB operations

  before(async function () {
    console.log("🔄 Connecting to Test Database...");

    await mongoose.connect(process.env.TEST_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB Connected!");

    //  Create a test hall
    const hall = new Hall({
      hall_name: "Test Hall",
      capacity: 100,
      price: 500,
    });

    const savedHall = await hall.save();
    hallId = savedHall._id;
    console.log(" Hall Created!");

    //  Create a test showtime
    const showtime = new ShowTime({
      movieId: new mongoose.Types.ObjectId(), // Placeholder movie ID
      hallId,
      start_time: "10:00 AM",
      end_time: "12:30 PM",
      date: "2025-06-15",
    });

    const savedShowtime = await showtime.save();
    showtimeId = savedShowtime._id;
    console.log(" Showtime Created!");

    //  Clear existing seats before testing
    await Seat.deleteMany({});
  });

  after(async function () {
    console.log("🗑️ Cleaning up test data...");
    await Seat.deleteMany({});
    await Hall.findByIdAndDelete(hallId);
    await ShowTime.findByIdAndDelete(showtimeId);
    await mongoose.connection.close();
  });

  /**  **TEST 1: Create Seats** */
  it("should create new seats", async function () {
    const seatData = {
      hallId,
      showtimeId,
      totalRows: 2,
      seatsPerRow: 3,
    };

    const res = await chai.request(server).post("/api/seat").send(seatData);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message", "Seats created successfully");
    expect(res.body.seats).to.be.an("array").that.is.not.empty;

    seatId = res.body.seats[0]._id; //  Store one seat ID for future tests
    console.log(" Seats Created!");
  });

  /**  **TEST 2: Get Seats by Hall ID** */
  it("should fetch all seats for a hall", async function () {
    const res = await chai.request(server).get(`/api/seat/hall/${hallId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
    expect(res.body[0]).to.have.property("hallId");
    console.log(" Seats Fetched by Hall ID!");
  });

  /**  **TEST 3: Get Available Seats by Showtime ID** */
  it("should fetch all available seats for a showtime", async function () {
    const res = await chai
      .request(server)
      .get(`/api/seat/showtime/${showtimeId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
    console.log(" Available Seats Fetched!");
  });

  /**  **TEST 4: Book a Seat** */
  it("should book a seat successfully", async function () {
    const res = await chai.request(server).post("/api/seat/book").send({
      seatId,
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Seat booked successfully");
    expect(res.body.seat.seatStatus).to.be.true;
    console.log(" Seat Booked!");
  });
});
