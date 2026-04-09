const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminController');
const { getOrders, updateOrderStatus, getStatistics } = require('../controllers/orderController');
const { createProduct, deleteProduct, getProducts } = require('../controllers/productController');
const { getInvoices, createInvoice, getInvoiceByOrderId, getInvoiceStats } = require('../controllers/invoiceController');

// Admin giriş
router.post('/login', adminLogin);

// İstatistikler
router.get('/statistics', getStatistics);

// Tüm siparişleri getir
router.get('/orders', getOrders);

// Sipariş durumunu güncelle
router.put('/orders/:id/status', updateOrderStatus);

// Faturalar
router.get('/invoices', getInvoices);
router.get('/invoices/stats', getInvoiceStats);
router.post('/invoices', createInvoice);
router.get('/invoices/order/:orderId', getInvoiceByOrderId);

// Tüm ürünleri getir
router.get('/products', getProducts);

// Yeni ürün oluştur
router.post('/products', createProduct);

// Ürün sil
router.delete('/products/:id', deleteProduct);

module.exports = router;
