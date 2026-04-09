const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User modelini dahil edin

const protect = async (req, res, next) => {
    let token;

    // Token başlıktaki "Authorization" kısmından alınır
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token'ı al
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'undefined' || token === 'null') {
                console.error('Malformed token detected');
                return res.status(401).json({ message: 'Geçersiz token formatı. Lütfen tekrar giriş yapın.' });
            }

            // Token'ı doğrula ve id'yi al
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlianahtar123');
            
            // Kullanıcıyı veritabanından bul ve req.user'a ata
            req.user = await User.findById(decoded.id).select('-password'); // Şifreyi gizle
            next(); // Middleware chain'ini devam ettir
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Yetkisiz giriş' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Token bulunamadı, lütfen giriş yapın' });
    }
};

module.exports = protect;

