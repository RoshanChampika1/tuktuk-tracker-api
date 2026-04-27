const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const District = require('../models/District');
const PoliceStation = require('../models/PoliceStation');

router.get('/', auth, async (req, res) => {
  try {
    const districts = await District.find().populate('province', 'name code');
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/stations', auth, async (req, res) => {
  try {
    const stations = await PoliceStation.find({ district: req.params.id });
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;