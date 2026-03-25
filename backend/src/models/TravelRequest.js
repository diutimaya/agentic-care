const mongoose = require('mongoose');

const travelRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true,
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', required: true,
  },
  facility_location:    { type: String, required: true },
  calculated_distance:  { type: Number, default: null },
  estimated_travel_time:{ type: Number, default: null },
  route_status: {
    type: String,
    enum: ['pending', 'retrieved', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('TravelRequest', travelRequestSchema);