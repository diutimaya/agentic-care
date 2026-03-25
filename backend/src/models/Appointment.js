const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true,
  },
  specialist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialist', required: true,
  },
  appointment_date: {
    type: Date,
    required: true,
    validate: {
      validator: (v) => v > new Date(),
      message: 'Appointment date must be in the future',
    },
  },
  appointment_time: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  notes:             { type: String, default: '' },
  reminder_sent:     { type: Boolean, default: false },
}, { timestamps: true });

appointmentSchema.index({ specialist_id: 1, appointment_date: 1, appointment_time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);