const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Province = require('../models/Province');
const District = require('../models/District');

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     summary: Get all 9 provinces
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all provinces
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/provinces/{id}/districts:
 *   get:
 *     summary: Get all districts in a province
 *     tags: [Provinces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Province ID
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/:id/districts', auth, async (req, res) => {
  try {
    const districts = await District.find({ province: req.params.id });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;