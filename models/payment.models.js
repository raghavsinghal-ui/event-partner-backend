const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  /* Link to registration (which already links user + event) */
  registrationInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "registration",
    required: true
  },

  /* Amount paid */
  amountPaid: {
    type: Number,
    required: true,
    min: 0
  },

  /* Currency */
  currency: {
    type: String,
    default: "INR"
  },

  /* Payment gateway name */
  paymentProvider: {
    type: String,
    enum: ["razorpay", "stripe", "cash", "upi", "other"],
    default: "razorpay"
  },

  /* Gateway transaction ID */
  transactionId: {
    type: String,
    trim: true
  },

  /* Current status */
  transactionStatus: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },

  /* When payment happened */
  transactionDate: {
    type: Date
  },

  /* Receipt / invoice URL (optional) */
  receiptUrl: {
    type: String,
    trim: true
  },

  /* Snapshot of bill at payment time */
  billSnapshot: {
    eventTitle: String,
    eventDate: Date,
    attendeeName: String,
    attendeeEmail: String,
    amount: Number
  },
  razorpayOrderId: {
  type: String,
  required: true,
  index: true
}

}, {
  timestamps: true
});
const paymnetModel= mongoose.model("payment", paymentSchema);
module.exports =paymnetModel;