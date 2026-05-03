const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const District = require('../models/District');
const PoliceStation = require('../models/PoliceStation');

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: Get all 25 districts
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/', auth, async (req, res) => {
  try {
    const districts = await District.find().populate('province', 'name code');
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/districts/{id}/stations:
 *   get:
 *     summary: Get all police stations in a district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of police stations
 */
router.get('/:id/stations', auth, async (req, res) => {
  try {
    const stations = await PoliceStation.find({ district: req.params.id });
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;