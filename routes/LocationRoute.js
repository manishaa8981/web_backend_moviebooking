const express = require("express")
const router = express.Router();
const{ findAll,
  save,
  findById,
  deleteById,
  update,
} = require("../controller/LocationController");
const {authenticateToken} = require("../security/Auth");



