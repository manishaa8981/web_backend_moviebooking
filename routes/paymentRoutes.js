const express = require("express");
const router = express.Router();
const { createPaymentIntent, confirmPayment, getStripePublicKey } = require("../controller/paymentController");

router.get("/public-key", getStripePublicKey);
router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

module.exports = router;
