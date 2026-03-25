const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userRole = req.user.role_id.role_name;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Role '${userRole}' is not authorized for this action`,
      });
    }

    next();
  };
};

module.exports = { authorize };