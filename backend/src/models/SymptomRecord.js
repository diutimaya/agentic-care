const mongoose = require('mongoose');

const symptomRecordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true,
  },
  symptom_description:  { type: String, required: true, minlength: 5 },
  ai_generated_response:{ type: String, default: '' },
  confidence_score:     { type: Number, min: 0, max: 100, default: null },
  predicted_conditions: [{ condition: String, score: Number }],
  status: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('SymptomRecord', symptomRecordSchema);