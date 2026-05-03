const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitPing, getActive } = require('../controllers/locationController');

/**
 * @swagger
 * /api/locations/ping:
 *   post:
 *     summary: Submit a GPS location ping from a tracking device
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - longitude
 *               - latitude
 *             properties:
 *               vehicleId:
 *                 type: string
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *               speed:
 *                 type: number
 *                 example: 35
 *               heading:
 *                 type: number
 *                 example: 90
 *     responses:
 *       201:
 *         description: Ping recorded
 */
router.post('/ping', auth, submitPing);

/**
 * @swagger
 * /api/locations/active:
 *   get:
 *     summary: Get active vehicles with latest pings filtered by province or district
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Province ID to filter
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: District ID to filter
 *     responses:
 *       200:
 *         description: List of active vehicles with latest location
 */
router.get('/active', auth, getActive);

module.exports = router;