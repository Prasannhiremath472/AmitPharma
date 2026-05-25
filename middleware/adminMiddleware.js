const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
};

const adminOrSelf = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === parseInt(req.params.id))) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied.' });
};

module.exports = { admin, adminOrSelf };
