const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { getAdminJwtSecret, protectAdmin } = require('../middleware/adminAuthMiddleware');


// Admin giriş yap
const adminLogin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const identifier = username || email;
    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!admin) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya e-posta' });
    }

    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Geçersiz parola' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      getAdminJwtSecret(),
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu', error: error.message });
  }
};

module.exports = { adminLogin, protectAdmin };
