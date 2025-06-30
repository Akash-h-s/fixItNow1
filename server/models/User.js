const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: String,
  email: String,
  name: String,
  password: String,
  workSpecification: String,
  experience: String,
  location: String,
  phoneNumber: String,
  photo: String
});

module.exports = mongoose.model('User', userSchema);
