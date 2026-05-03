const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { getLatest, getHistory } = require('../controllers/locationController');

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all registered tuk-tuks
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', auth, getVehicles);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a new tuk-tuk (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: WP-TUK-0201
 *               licensePlate:
 *                 type: string
 *                 example: WP AB-1234
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created
 */
router.post('/', auth, roles('admin'), createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a single vehicle by ID
 *     tags: [Vehicles]
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
 *         description: Vehicle details
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', auth, getVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle (Admin only)
 *     tags: [Vehicles]
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
 *         description: Vehicle updated
 */
router.put('/:id', auth, roles('admin'), updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Deactivate a vehicle (Admin only)
 *     tags: [Vehicles]
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
 *         description: Vehicle deactivated
 */
router.delete('/:id', auth, roles('admin'), deleteVehicle);

/**
 * @swagger
 * /api/vehicles/{id}/location/latest:
 *   get:
 *     summary: Get last known location of a vehicle
 *     tags: [Vehicles]
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
 *         description: Latest location ping
 *       404:
 *         description: No location found
 */
router.get('/:id/location/latest', auth, getLatest);

/**
 * @swagger
 * /api/vehicles/{id}/location/history:
 *   get:
 *     summary: Get movement history of a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         example: "2026-04-20"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         example: "2026-04-27"
 *     responses:
 *       200:
 *         description: List of location pings
 */
router.get('/:id/location/history', auth, getHistory);

module.exports = router;