const express = require("express");
const router = express.Router();
const { save, deleteById, update } = require("../controller/SeatController");
const { authenticateToken } = require("../security/Auth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "movie_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", authenticateToken, upload.single("file"), save);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);

module.exports = router;
