const mongoose = require('mongoose');
const PingSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  speed: Number,
  heading: Number,
  timestamp: { type: Date, default: Date.now }
});
PingSchema.index({ vehicle: 1, timestamp: -1 });
PingSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('LocationPing', PingSchema);
