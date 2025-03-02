const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

let adminToken = "";

// Function to log in as an admin before running tests
const loginAsAdmin = async () => {
  if (adminToken) return adminToken;

  const loginRes = await chai.request(app).post("/api/auth/login").send({
    username: "admin",
    password: "admin@123",
  });

  expect(loginRes).to.have.status(200);
  expect(loginRes.body).to.have.property("token");

  adminToken = loginRes.body.token;
};

module.exports = { loginAsAdmin };
