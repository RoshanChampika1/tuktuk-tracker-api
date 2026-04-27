const LocationPing = require('../models/LocationPing');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// POST /api/locations/ping - Device submits a ping
exports.submitPing = async (req, res) => {
  try {
    const { vehicleId, longitude, latitude, speed, heading } = req.body;
    const ping = await LocationPing.create({
      vehicle: vehicleId,
      location: { type: 'Point', coordinates: [longitude, latitude] },
      speed,
      heading
    });
    res.status(201).json(ping);
  } catch (err) {
    console.error('submitPing error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/vehicles/:id/location/latest
exports.getLatest = async (req, res) => {
  try {
    const ping = await LocationPing.findOne({ vehicle: req.params.id })
      .sort({ timestamp: -1 });
    if (!ping) return res.status(404).json({ message: 'No location found' });
    res.json(ping);
  } catch (err) {
    console.error('getLatest error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/vehicles/:id/location/history?startDate=&endDate=
exports.getHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { vehicle: req.params.id };
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    const pings = await LocationPing.find(filter)
      .sort({ timestamp: -1 })
      .limit(1000);
    res.json(pings);
  } catch (err) {
    console.error('getHistory error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/locations/active?province=&district=
exports.getActive = async (req, res) => {
  try {
    const { province, district } = req.query;
    const vehicleFilter = { status: 'active' };
    if (province) vehicleFilter.province = new mongoose.Types.ObjectId(province);
    if (district) vehicleFilter.district = new mongoose.Types.ObjectId(district);
    const vehicles = await Vehicle.find(vehicleFilter).select('_id');
    const ids = vehicles.map(v => v._id);
    const latestPings = await LocationPing.aggregate([
      { $match: { vehicle: { $in: ids } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$vehicle', ping: { $first: '$$ROOT' } } }
    ]);
    res.json(latestPings);
  } catch (err) {
    console.error('getActive error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};