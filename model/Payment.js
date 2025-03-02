const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    payment_intent_id: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    currency: {
      type: String,
      default: "usd",
    },
  },
  {
    timestamps: true,
    indexes: [{ payment_intent_id: 1 }],
  }
);

paymentSchema.pre("save", async function (next) {
  try {
    await this.collection.dropIndexes();
  } catch (error) {
    console.log("Error dropping indexes:", error);
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

Payment.createIndexes().catch(console.error);

module.exports = Payment;
