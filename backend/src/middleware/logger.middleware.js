const SystemLog = require('../models/SystemLog');

const logAction = async (userId, actionType, entityName, status, meta = {}) => {
  try {
    await SystemLog.create({
      user_id: userId || null,
      action_type: actionType,
      entity_name: entityName,
      operation_status: status,
      meta,
    });
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};

module.exports = { logAction };