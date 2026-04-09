const express = require('express');
const router = express.Router();
const { getUserOrders, updateOrderStatus, getOrderById, createOrder, deleteOrder, getOrders } = require('../controllers/orderController');

// Siparişleri filtreli getir (Email bazlı)
router.get('/user/:email', getUserOrders);

// Tüm siparişleri getir (Admin için)
router.get('/', getOrders);

// Sipariş ID'sine göre sipariş getir (En sona gelmeli)
router.get('/:id', getOrderById);

// Sipariş durumunu güncelle
router.put('/:id/status', updateOrderStatus);

// Yeni sipariş oluştur
router.post('/', createOrder);

// Sipariş sil
router.delete('/:id', deleteOrder);

module.exports = router;

