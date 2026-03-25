const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', default: null,
  },
  action_type: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'login_failed', 'register',
      'account_locked', 'appointment_created', 'appointment_cancelled',
      'symptom_submitted', 'ai_request', 'ai_response',
      'travel_request', 'unauthorized_access', 'system_error',
    ],
  },
  entity_name:      { type: String, default: '' },
  operation_status: { type: String, enum: ['success', 'failure'], required: true },
  meta:             { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

systemLogSchema.index({ action_type: 1, createdAt: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);