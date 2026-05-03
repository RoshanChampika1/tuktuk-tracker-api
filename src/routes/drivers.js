const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getDrivers, getDriver, createDriver } = require('../controllers/driverController');

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all registered drivers
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 */
router.get('/', auth, getDrivers);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a single driver by ID
 *     tags: [Drivers]
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
 *         description: Driver details
 */
router.get('/:id', auth, getDriver);

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Register a new driver (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nic:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created
 */
router.post('/', auth, roles('admin'), createDriver);

module.exports = router;