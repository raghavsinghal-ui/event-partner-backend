const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },

  otp: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300000   
  },
role:{
    type: String,
    enum: ["admin", "normal","super_admin"],
    required: true,
      default: "normal"
}
});

module.exports = mongoose.model("otp", otpSchema);