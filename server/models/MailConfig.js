// models/MailConfig.js
const mongoose = require('mongoose');

const mailConfigSchema = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model('MailConfig', mailConfigSchema);
