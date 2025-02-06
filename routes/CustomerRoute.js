const express = require("express");
const router = express.Router();

const upload = require("../config/uploads");
// const uploadImage = require("../controller/AuthController");

const {
  findAll,
  save,
  findById,
  deleteById,
  update,
  uploadImage,
} = require("../controller/CustomerController");

const UserValidation = require("../validation/CustomerValidation");

router.get("/get", findAll);
router.post("/uploadImage", upload, uploadImage);
router.post("/save", UserValidation, save);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;
