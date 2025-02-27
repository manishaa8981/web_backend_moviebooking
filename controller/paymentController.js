const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/Booking"); // Ensure this path is correct

// Get Stripe Public Key
exports.getStripePublicKey = (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
};

// Create a Stripe Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Ensure the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "inr",
      metadata: { bookingId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm Payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update Booking Status
    await Booking.findByIdAndUpdate(paymentIntent.metadata.bookingId, {
      payment_status: "Paid",
    });

    res.json({ success: true, message: "Payment confirmed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
