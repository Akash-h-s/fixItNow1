const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  role:String,
  name: String,
  email: String,
  password: String,
  workSpecification: String,
  experience: Number,
  location: String,
  phoneNumber: String, // Added field
  photo: String,
  qrCode:String,
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  latitude: Number,
  longitude: Number,
  booked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Worker', workerSchema);
