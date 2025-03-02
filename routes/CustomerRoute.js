const express = require("express");
const router = express.Router();
const uploads = require("../config/uploads");
const upload = require("../config/multerConfig");
// const uploadImages = require("../controller/CustomerController");

const {
  findAll,
  save,
  findById,
  deleteById,
  update,
  // uploadImage,
  uploadImages,
  // updateProfile,
  getProfile,
} = require("../controller/CustomerController");
const { authenticateToken } = require("../security/Auth");
const UserValidation = require("../validation/CustomerValidation");

router.get("/", findAll);
// router.post("/uploadImage", uploads, uploadImage); // for mobile
router.post("/save", UserValidation, save);
router.get("/:id",authenticateToken, findById);
router.delete("/:id",authenticateToken, deleteById);
router.put("/:id",authenticateToken, update);
router.get("/profile", authenticateToken, getProfile);
// router.put("/profile/update", authenticateToken, updateProfile);
router.post(
  "/:customerId/upload",
  authenticateToken,
  upload.single("image"),
  uploadImages
); // for web

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const upload = require("../config/multerConfig");
// const { authenticateToken } = require("../security/Auth"); //  Ensure this is correctly imported

// const {
//   findAll,
//   save,
//   findById,
//   deleteById,
//   update,
//   uploadImages,
//   updateProfile,
//   getProfile,
// } = require("../controller/CustomerController");

// const UserValidation = require("../validation/CustomerValidation");

// router.get("/", findAll);
// router.post("/save", UserValidation, save);
// router.get("/:id", findById);
// router.delete("/:id", deleteById);
// router.put("/:id", update);

// //  Ensure `authenticateToken` is correctly used
// router.get("/profile", authenticateToken, getProfile);
// router.put("/profile/update", authenticateToken, updateProfile);
// router.post("/profile/upload", authenticateToken, upload.single("image"), uploadImages);

// module.exports = router;
