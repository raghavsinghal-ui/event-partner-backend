const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0
        }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Invite", inviteSchema);