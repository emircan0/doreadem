const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const getAdminJwtSecret = () => (
  process.env.ADMIN_JWT_SECRET ||
  process.env.JWT_SECRET ||
  'secret_key'
);

const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Admin oturumu bulunamadı' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getAdminJwtSecret());
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Admin kullanıcısı bulunamadı' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Admin oturumu geçersiz veya süresi dolmuş' });
  }
};

module.exports = { protectAdmin, getAdminJwtSecret };
