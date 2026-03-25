const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  full_name:      { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash:  { type: String, required: true },
  phone_number:   { type: String, default: '' },
  role_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  account_status: { type: String, enum: ['active', 'inactive', 'locked'], default: 'active' },
  failed_login_attempts: { type: Number, default: 0 },
  locked_until:   { type: Date, default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

userSchema.methods.isLocked = function () {
  return this.account_status === 'locked' &&
    this.locked_until && this.locked_until > Date.now();
};

module.exports = mongoose.model('User', userSchema);