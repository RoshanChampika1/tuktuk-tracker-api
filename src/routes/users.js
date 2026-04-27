const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getUsers, createUser, deleteUser } = require('../controllers/userController');

router.get('/',       auth, roles('admin'), getUsers);
router.post('/',      auth, roles('admin'), createUser);
router.delete('/:id', auth, roles('admin'), deleteUser);

module.exports = router;