const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role');

dotenv.config({ path: '../../.env' });

const roles = [
  { role_name: 'super_admin',            description: 'Full system access' },
  { role_name: 'ai_engineer',            description: 'Manages AI models' },
  { role_name: 'data_scientist',         description: 'Analyzes system data' },
  { role_name: 'cybersecurity_specialist', description: 'Manages security policies' },
  { role_name: 'patient',                description: 'Primary user' },
  { role_name: 'primary_care_physician', description: 'Reviews patient records' },
  { role_name: 'specialist',             description: 'Receives appointments' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { role_name: role.role_name },
      role,
      { upsert: true, new: true }
    );
    console.log(`Seeded role: ${role.role_name}`);
  }

  console.log('Seeding complete');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});