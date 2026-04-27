const mongoose = require('mongoose');
const VehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deviceToken: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Vehicle', VehicleSchema);
