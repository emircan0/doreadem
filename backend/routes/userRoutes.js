const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware'); 
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUserOrAdmin, allowSelfOrAdmin } = require('../middleware/roleMiddleware');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserProfileId,
    deleteUser,
    getAddresses,
    addAddressToUser,  // Adres ekleme fonksiyonu
    updateAddressForUser,  // Adres güncelleme fonksiyonu
    deleteAddressForUser,  // Adres silme fonksiyonu
    changePassword,
    resetPassword,
    addToFavorites,
    removeFromFavorites,
    updateNotificationSettings
} = require('../controllers/userController');

// Kullanıcı kayıt rotası
router.post('/register', registerUser);

// Kullanıcı giriş rotası
router.post('/login', loginUser);

// Kullanıcı silme rotası
router.delete('/:id', protectAdmin, deleteUser);

// Giriş yapan kullanıcının profilini almak
router.get('/profile', protectAdmin, getUserProfile);

// Adres yönetimi (Parametrik profil rotalarından ÖNCE olmalı)
router.get('/profile/address', protect, getAddresses);
router.post('/profile/address', protect, addAddressToUser);
router.put('/profile/address/:addressId', protect, updateAddressForUser);
router.delete('/profile/address/:addressId', protect, deleteAddressForUser);

// Kullanıcı profili için ID'ye göre getir
router.get('/profile/:userId', protectUserOrAdmin, allowSelfOrAdmin('userId'), getUserProfileId);

// Kullanıcı profilini güncelleme rotası (ID'ye göre)
router.put('/profile/:userId', protectUserOrAdmin, allowSelfOrAdmin('userId'), updateUserProfile);


// Şifre değiştirme rotası (Giriş yapan kullanıcının şifresini değiştirir)
router.post('/change-password', protect, changePassword);

// Şifre sıfırlama rotası (Kullanıcıya e-posta gönderir)
router.post('/reset-password', resetPassword);

// Favori işlemleri
router.post('/favorites', protect, addToFavorites);
router.delete('/favorites/:productId', protect, removeFromFavorites);

// Bildirim ayarları
router.put('/profile/notifications', protect, updateNotificationSettings);


module.exports = router;
