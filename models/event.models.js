const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  year: [{
    type: Number,
    min: 1,
    max: 5
  }],
  department:[ {
    type: String,
    trim: true
  }],
  branches: [{
    type: String,
    trim: true
  }],
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    required: true,
    enum: ["seminar", "workshop", "hackathon", "internship", "trip"],
    lowercase: true
  },

  description: {
    type: String,
    required: true
  },

  eventDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        if (this.isNew) {
          return value.getTime() > Date.now();
        }
        return true;
      },
      message: "Event date must be in the future"
    }
  },

  duration: {
  number: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ["hour", "day"],
    lowercase: true,
    required: true
  }
},
expiresAt: { type: Date },

  destination: {
    type: String,
    trim: true,
    required: function () {
      return this.type === "trip";
    }
  },

  byUser: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  minReq: requirementSchema,
  price: {
  type: Number,
  required: function () {
    return this.paymentRequired;
  },
  min: 0
},
paymentRequired: {
  type: Boolean,
  default: false
},
generatedPost: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, { timestamps: true });
eventSchema.pre("validate",function(){ 
  let seconds = 0; 
  if(this.duration.unit === "hour")
    { seconds = this.duration.number * 60 * 60; } 
  if(this.duration.unit === "day")
    { seconds = this.duration.number * 24 * 60 * 60; } 
  this.expiresAt = new Date( this.eventDate.getTime() + seconds * 1000 );
  
  });
eventSchema.index(
  {
    title: "text",
    description:"text"
   
  },
  {
    weights: {
      title: 100,
      description:50
    }
  }
);
eventSchema.index({ createdAt: -1, _id: -1 },

);
eventSchema.index({ type: 1, createdAt: -1, _id: -1 });

eventSchema.index({expiresAt:1},{expireAfterSeconds:0});
const eventModel=mongoose.model("Event", eventSchema);
module.exports =  eventModel;