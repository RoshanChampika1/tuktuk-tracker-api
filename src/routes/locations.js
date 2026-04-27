const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitPing, getActive } = require('../controllers/locationController');

router.post('/ping',  auth, submitPing);
router.get('/active', auth, getActive);

module.exports = router;