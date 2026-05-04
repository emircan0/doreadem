const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { getAdminJwtSecret, protectAdmin } = require('../middleware/adminAuthMiddleware');


// Admin giriş yap
const adminLogin = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('--- LOGIN ATTEMPT ---');
  console.log('Identifier (User/Email):', username || email);

  try {
    const identifier = username || email;
    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!admin) {
      console.log('LOGIN FAIL: Admin bulunamadı.');
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya e-posta' });
    }

    console.log('Admin bulundu, şifre kontrol ediliyor...');
    const isPasswordMatch = await admin.matchPassword(password);

    if (!isPasswordMatch) {
      console.log('LOGIN FAIL: Şifre uyuşmadı.');
      return res.status(401).json({ message: 'Geçersiz parola' });
    }

    console.log('LOGIN SUCCESS: Giriş başarılı.');
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
    console.error('LOGIN ERROR DETAIL:', error);
    res.status(500).json({ 
      message: 'Giriş sırasında hata oluştu', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { adminLogin, protectAdmin };
