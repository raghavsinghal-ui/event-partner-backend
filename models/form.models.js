const mongoose = require('mongoose');


const fieldSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["text", "number", "select"],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: {
    type: [String],
    default: []
  },
  validation: {
    min: Number,
    max: Number,
    regex: String
  }
}, { _id: true });

const formSchema = new mongoose.Schema({ 

eventInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",
    required: true
  },
   defaultFields: [
    {
      key: {
        type: String,
        enum: ["name", "email", "phone"]
      },
      required: {
        type: Boolean,
        default: true
      }
    }
  ],

fields:[fieldSchema],
documents:[{
   key:{
        type: String,
        required: true,
        unique: true
    },
  required:{
    type: Boolean,
    default: false  }}


]



   },{ timestamps: true });
 formSchema.index({ eventInfo: 1 });

module.exports = mongoose.model("form", formSchema);