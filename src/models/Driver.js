const mongoose = require('mongoose');
const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nic: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  phone: String
});
module.exports = mongoose.model('Driver', DriverSchema);
