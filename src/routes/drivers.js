const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getDrivers, getDriver, createDriver } = require('../controllers/driverController');

router.get('/',    auth,                 getDrivers);
router.get('/:id', auth,                 getDriver);
router.post('/',   auth, roles('admin'), createDriver);

module.exports = router;