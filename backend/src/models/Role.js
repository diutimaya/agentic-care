const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    unique: true,
    enum: ['super_admin', 'ai_engineer', 'data_scientist',
           'cybersecurity_specialist', 'patient',
           'primary_care_physician', 'specialist'],
  },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);