const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { getLatest, getHistory } = require('../controllers/locationController');

router.get('/',           auth,                 getVehicles);
router.post('/',          auth, roles('admin'), createVehicle);
router.get('/:id',        auth,                 getVehicle);
router.put('/:id',        auth, roles('admin'), updateVehicle);
router.delete('/:id',     auth, roles('admin'), deleteVehicle);
router.get('/:id/location/latest',  auth, getLatest);
router.get('/:id/location/history', auth, getHistory);

module.exports = router;