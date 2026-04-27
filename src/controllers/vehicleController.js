const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'officer') {
      if (req.user.district) filter.district = req.user.district;
      else if (req.user.province) filter.province = req.user.province;
    }
    const vehicles = await Vehicle.find(filter)
      .populate('province', 'name code')
      .populate('district', 'name')
      .populate('driver', 'name nic phone');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/vehicles/:id
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('province', 'name code')
      .populate('district', 'name')
      .populate('driver', 'name nic phone licenseNumber');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/vehicles/:id  (deactivate)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deactivated', vehicle });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};