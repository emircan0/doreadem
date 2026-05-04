const express = require('express');
const router = express.Router();
const { getUserOrders, updateOrderStatus, getOrderById, createOrder, deleteOrder, getOrders } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUserOrAdmin, allowEmailOwnerOrAdmin } = require('../middleware/roleMiddleware');

// Siparişleri filtreli getir (Email bazlı)
router.get('/user/:email', protectUserOrAdmin, allowEmailOwnerOrAdmin('email'), getUserOrders);

// Tüm siparişleri getir (Admin için)
router.get('/', protectAdmin, getOrders);

// Sipariş ID'sine göre sipariş getir (En sona gelmeli)
router.get('/:id', getOrderById);

// Sipariş durumunu güncelle
router.put('/:id/status', protectAdmin, updateOrderStatus);

// Yeni sipariş oluştur
router.post('/', createOrder);

// Sipariş sil
router.delete('/:id', protectAdmin, deleteOrder);

module.exports = router;
