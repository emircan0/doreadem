const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { getAdminJwtSecret } = require('./adminAuthMiddleware');

const getUserJwtSecret = () => process.env.JWT_SECRET || 'gizlianahtar123';

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

const protectUserOrAdmin = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Oturum bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, getUserJwtSecret());
    const user = await User.findById(decoded.id).select('-password');

    if (user) {
      req.user = user;
      return next();
    }
  } catch (error) {
    // Token admin token'ı olabilir; aşağıda ayrıca denenir.
  }

  try {
    const decoded = jwt.verify(token, getAdminJwtSecret());
    const admin = await Admin.findById(decoded.id).select('-password');

    if (admin) {
      req.admin = admin;
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: 'Oturum geçersiz veya süresi dolmuş' });
  }

  return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
};

const allowSelfOrAdmin = (paramName, userField = '_id') => (req, res, next) => {
  if (req.admin) return next();

  const requestedValue = req.params[paramName];
  const currentValue = req.user?.[userField]?.toString();

  if (currentValue && requestedValue && currentValue === requestedValue.toString()) {
    return next();
  }

  return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
};

const allowEmailOwnerOrAdmin = (paramName) => (req, res, next) => {
  if (req.admin) return next();

  const requestedEmail = (req.params[paramName] || '').toLowerCase();
  const currentEmail = (req.user?.email || '').toLowerCase();

  if (requestedEmail && currentEmail && requestedEmail === currentEmail) {
    return next();
  }

  return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
};

module.exports = {
  protectUserOrAdmin,
  allowSelfOrAdmin,
  allowEmailOwnerOrAdmin
};
