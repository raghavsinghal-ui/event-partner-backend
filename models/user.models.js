const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  studyInYear: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
}, { _id: false });


const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  landmark: { type: String, trim: true }
}, { _id: false });


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,     
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },

  contactNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, "Invalid phone number"]
  },
  address: {
    type: addressSchema
  },
   academic: {
    type: academicSchema,
  },
  
  role: {
    type: String,
    enum: ["admin", "normal","super_admin"],
      required: true,
      default: "normal"
   
  },
    password: {
  type: String,
  required: true,
select: false,
  minlength: 6
},
 
isProfileComplete: {
  type: Boolean,
  default: false
},
academicVerification: {
  status: {
    type: String,
    enum: ["not_requested", "pending", "verified", "rejected"],
    default: "not_requested"
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  verifiedAt: Date,
  rejectionReason: String
},

 refreshToken: String,
 refreshTokenExpiresAt: {
  type: Date
}

}, { timestamps: true });

userSchema.index({
  role:1,
  "academic.department": 1,
  "academic.branch": 1,
  "academic.cgpa": 1
});
userSchema.index({
  email:1
})
const userModel=mongoose.model("User", userSchema);
module.exports = userModel;




