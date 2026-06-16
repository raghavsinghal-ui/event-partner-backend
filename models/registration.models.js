const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "form",
    required: true
  },

  // 🔹 dynamic fields
  defaultFields: {
    type: Object,
    default: {}
  },

  fields: {
    type: Object,
    default: {}
  },

  documents: {
    type: Object,
    default: {}
  },

  status: {
    type: String,
    enum: ["payment_pending", "registered", "cancelled", "expired"],
    default: "payment_pending"
  },

  expiresAt: {
    type: Date
  }

}, { timestamps: true });

// 🔥 Prevent duplicate registration
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
registrationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
module.exports = mongoose.model("registration", registrationSchema);
