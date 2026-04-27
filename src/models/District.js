const mongoose = require('mongoose');
const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true }
});
module.exports = mongoose.model('District', DistrictSchema);
