const express = require("express");
const {
  getStripePublicKey,
  createPaymentIntent,
  confirmPayment,
} = require("../controller/paymentController");

const router = express.Router();

router.get("/public-key", getStripePublicKey);
router.post("/create-payment-intent", createPaymentIntent);

//  Confirm Payment
router.post("/confirm-payment", confirmPayment);

module.exports = router;
