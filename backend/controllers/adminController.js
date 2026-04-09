const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');


// Admin giriş yap
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı' });
    }

    const isPasswordMatch = await admin.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Geçersiz parola' });
    }

    const token = jwt.sign({ id: admin._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu', error: error.message });
  }
};

// Admin kimlik doğrulama
const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }
    req.admin = decoded;
    next();
  });
};

module.exports = { adminLogin, protectAdmin };

