const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); //  Import the Express app
const Booking = require("../model/Booking");
const dotenv = require("dotenv");

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe("📌 Booking API Tests", function () {
  this.timeout(60000); //  Increased timeout to 60s

  let bookingId;
  let userId = "605c72b56b9f3c6f7c5e8a6b"; // Replace with a valid user ID from DB

  before(async function () {
    console.log("🔄 Connecting to Test Database...");

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb://localhost:27017/test_movie_ticket_booking",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    }

    await Booking.deleteMany({});
    console.log(" Booking Database Cleared.");
  });

  /**  **TEST 1: Ensure database starts empty** **/
  it("should verify that there are 0 bookings in the DB", async function () {
    const count = await Booking.countDocuments();
    console.log(`📌 Initial Booking Count: ${count}`);
    expect(count).to.equal(0);
  });

  /**  **TEST 2: Create a Booking** **/
  it("should successfully add a booking to the database", async function () {
    const bookingData = {
      userId,
      seats: ["605c72b56b9f3c6f7c5e8a6c"], // Replace with valid seat IDs
      showtimeId: "605c72b56b9f3c6f7c5e8a6d", // Replace with valid showtime ID
      total_price: 500,
    };

    const res = await chai
      .request(app) //  Now correctly using `app`
      .post("/api/booking")
      .send(bookingData);

    console.log("📌 Response Status:", res.status);
    console.log("📌 Response Body:", res.body);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property(
      "message",
      "Booking created successfully"
    );

    bookingId = res.body.booking._id; //  Store booking ID for further tests
  });

  /**  **TEST 3: Fetch All Bookings** **/
  it("should retrieve all bookings", async function () {
    const res = await chai.request(app).get("/api/booking");

    console.log("📌 GET /booking Response Status:", res.status);
    console.log("📌 GET /booking Response Body:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.at.least(1);
  });

  /**  **TEST 4: Fetch Booking by ID** **/
  it("should retrieve a booking by ID", async function () {
    const res = await chai.request(app).get(`/api/booking/${bookingId}`);

    console.log("📌 GET /booking/:id Response Status:", res.status);
    console.log("📌 GET /booking/:id Response Body:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id", bookingId);
  });

  /**  **TEST 5: Update Booking Status** **/
  it("should update the booking status", async function () {
    const updatedBooking = { status: "Confirmed" };

    const res = await chai
      .request(app)
      .put(`/api/booking/${bookingId}`)
      .send(updatedBooking);

    console.log("📌 PUT /booking/:id Response Status:", res.status);
    console.log("📌 PUT /booking/:id Response Body:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      "message",
      "Booking updated successfully"
    );

    const updatedData = await Booking.findById(bookingId);
    expect(updatedData.status).to.equal(updatedBooking.status);
  });

  /**  **TEST 6: Delete Booking** **/
  it("should delete the booking", async function () {
    const res = await chai.request(app).delete(`/api/booking/${bookingId}`);

    console.log("📌 DELETE /booking/:id Response Status:", res.status);
    console.log("📌 DELETE /booking/:id Response Body:", res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      "message",
      "Booking deleted successfully"
    );

    const deletedBooking = await Booking.findById(bookingId);
    expect(deletedBooking).to.be.null;
  });

  after(async function () {
    console.log("🗑️ Test Database Cleared.");
    await mongoose.connection.close();
  });
});
