const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js"); // Your Express server
const Hall = require("../model/Hall.js");
const dotenv = require("dotenv");

dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;

describe("🏛️ Hall API Tests", function () {
  this.timeout(20000); //  Increase timeout for DB operations

  let hallId; //  Store Hall ID for update & delete tests

  before(async function () {
    console.log("🔄 Connecting to Test Database...");

    let retries = 3;
    while (mongoose.connection.readyState === 0 && retries > 0) {
      try {
        await mongoose.connect(process.env.TEST_DATABASE, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(" MongoDB Connected!");
        break;
      } catch (err) {
        console.log(`🔄 Retrying MongoDB connection (${3 - retries + 1}/3)`);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
        retries--;
      }
    }

    if (mongoose.connection.readyState === 0) {
      console.error("MongoDB connection failed. Skipping tests.");
      this.skip();
    }

    await Hall.deleteMany({}); //  Clear database before running tests
    console.log(" Database Cleared.");
  });

  //TEST 1
  it("should create a new hall", async function () {
    const hallData = {
      hall_name: "Grand Theater",
      capacity: 150,
      price: 500,
      movies: [],
    };

    const res = await chai.request(server).post("/api/hall").send(hallData);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("hall_name", hallData.hall_name);
    expect(res.body).to.have.property("capacity", hallData.capacity);
    expect(res.body).to.have.property("price", hallData.price);

    hallId = res.body._id; //  Store ID for future tests
  });

  //TEST 2
  it("should retrieve the created hall by ID", async function () {
    const res = await chai.request(server).get(`/api/hall/${hallId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id", hallId);
    expect(res.body).to.have.property("hall_name", "Grand Theater");
  });

  //TEST 3
  it("should update the hall's price", async function () {
    const updatedData = {
      price: 600,
    };

    const res = await chai
      .request(server)
      .put(`/api/hall/${hallId}`)
      .send(updatedData);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("price", updatedData.price);

    // Verify the change in DB
    const updatedHall = await Hall.findById(hallId);
    expect(updatedHall.price).to.equal(updatedData.price);
  });

  //TEST 4
  it("should delete the hall", async function () {
    const res = await chai.request(server).delete(`/api/hall/${hallId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Hall deleted successfully");

    // Ensure it's deleted
    const deletedHall = await Hall.findById(hallId);
    expect(deletedHall).to.be.null;
  });

  //TEST 5
  it("should return 404 for a non-existent hall", async function () {
    const res = await chai.request(server).get(`/api/hall/${hallId}`);
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error", "Hall not found");
  });

  after(async function () {
    console.log("🗑️ Test Database Cleared.");
    await mongoose.connection.close();
  });
});
