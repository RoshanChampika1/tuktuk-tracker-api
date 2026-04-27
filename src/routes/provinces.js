const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Province = require('../models/Province');
const District = require('../models/District');

router.get('/', auth, async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/districts', auth, async (req, res) => {
  try {
    const districts = await District.find({ province: req.params.id });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;