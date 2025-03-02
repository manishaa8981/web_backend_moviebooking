const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../model/Payment");
const Booking = require("../model/Booking");
const Customer = require("../model/Customer");

//  Get Stripe Public Key
const getStripePublicKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Stripe public key",
      error: error.message,
    });
  }
};

//  Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const customerId = req.customerId;

    const booking = await Booking.findOne({ _id: bookingId, customerId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    const existingPayment = await Payment.findOne({
      bookingId,
      status: { $in: ["succeeded", "pending"] },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this booking",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      metadata: {
        bookingId: bookingId.toString(),
        customerId: customerId.toString(),
      },
    });

    const newPayment = await Payment.create({
      bookingId,
      customerId,
      amount,
      payment_intent_id: paymentIntent.id, 
      status: "pending",
      currency: "inr",
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: newPayment._id,
    });
  } catch (error) {
    console.error("Payment Intent Creation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment Intent ID required" });
    }

    // Retrieve Payment Intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || !paymentIntent.metadata.bookingId) {
      return res.status(404).json({ message: "Payment or Booking not found" });
    }

    // Update Payment Status in Database
    const payment = await Payment.findOneAndUpdate(
      { payment_intent_id: paymentIntentId },
      { status: "succeeded" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Mark Booking as Paid
    await Booking.findByIdAndUpdate(payment.bookingId, {
      payment_status: "Paid",
      status: "Confirmed",
    });

    res.status(200).json({
      success: true,
      message: "Payment confirmed and booking updated!",
      payment,
    });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

//  Get All Payments (For Admin)
const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (!req.user.isAdmin) {
      query.customerId = req.user.id;
    }

    const payments = await Payment.find(query)
      .populate("bookingId")
      .populate("customerId", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_records: total,
        records_per_page: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

//  Get Payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("bookingId")
      .populate("customerId", "username email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Ensure Only Admin or the Customer Can View This Payment
    if (!req.user.isAdmin && payment.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Cancel Payment (Refunds - If Needed)
const cancelPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment Intent ID required" });
    }

    // Retrieve Payment from Database
    const payment = await Payment.findOne({
      payment_intent_id: paymentIntentId,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Refund Payment via Stripe
    await stripe.refunds.create({ payment_intent: paymentIntentId });

    // Update Payment Status in Database
    payment.status = "refunded";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment has been refunded successfully!",
    });
  } catch (error) {
    console.error("Payment Cancellation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refund payment",
      error: error.message,
    });
  }
};

module.exports = {
  getStripePublicKey,
  createPaymentIntent,
  confirmPayment,
  getAllPayments,
  getPaymentById,
  cancelPayment,
};
