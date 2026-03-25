const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  full_name:          { type: String, required: true, trim: true },
  specialization:     { type: String, required: true },
  affiliated_hospital:{ type: String, required: true },
  availability_status:{ type: Boolean, default: true },
  contact_information:{ type: String, default: '' },
  rating:             { type: Number, min: 0, max: 5, default: 0 },
  experience_years:   { type: Number, default: 0 },
  location: {
    address: { type: String, default: '' },
    lat:     { type: Number, default: null },
    lng:     { type: Number, default: null },
  },
}, { timestamps: true });

specialistSchema.index({ specialization: 1, availability_status: 1 });

module.exports = mongoose.model('Specialist', specialistSchema);