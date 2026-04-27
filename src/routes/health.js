const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

function mapState(state) {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}

router.get('/', (req, res) => {
  res.json({ ok: true, db: mapState(mongoose.connection.readyState) });
});

module.exports = router;
