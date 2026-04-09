const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Belirli bir e-posta adresine sahip siparişleri getir
const getUserOrders = async (req, res) => {
  try {
    const email = req.params.email; // Query parametresinden email alınır.
    
    if (!email) {
      return res.status(400).json({ message: 'E-posta adresi gereklidir' });
    }
    const orders = await Order.find({ 'customer.email': email }).populate('items.product');
    res.json(orders);
    console.log(orders);
  } catch (error) {
    res.status(500).json({ message: 'Siparişler getirilirken hata oluştu', error: error.message });
  }
};


// Sipariş ID'sine göre sipariş getir
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sipariş getirilirken hata oluştu', error: error.message });
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// İstatistikleri getir (Admin için)
const getStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const totalCustomers = await User.countDocuments();
    
    const orders = await Order.find({ 
      $nor: [
        { 'status.current': 'cancelled' },
        { status: 'cancelled' }
      ]
    });
    
    const totalRevenue = orders.reduce((acc, curr) => {
      const amount = curr.totalAmount?.total ?? curr.totalAmount ?? 0;
      return acc + (+amount || 0);
    }, 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock products
    const lowStockProducts = await Product.find({ 
      status: 'active', 
      stock: { $lt: 5 } 
    }).limit(5).select('name stock price images');

    // Daily sales for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const salesAggregate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          'status.current': { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount.total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      lowStockProducts,
      dailySales: salesAggregate
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'İstatistikler alınamadı' });
  }
};


// Sipariş durumunu güncelle
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status.current = req.body.status;
      // pre-save hook status history'e otomatik ekleme yapacak
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Sipariş durumu güncellenirken hata oluştu', error: error.message });
  }
};

// Yeni sipariş oluştur (Profesyonel Şema Uyumlu)
const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, shippingAddress, payment, shippingMethod } = req.body;
    
    const newOrder = new Order({
      customer: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        user: customer?.user || req.user?._id
      },
      items: items.map(p => ({
        product: mongoose.Types.ObjectId.isValid(p.product) ? p.product : null,
        name: p.name || 'Ürün',
        price: p.price,
        quantity: p.quantity,
        sku: p.sku
      })),
      totalAmount: {
        subtotal: totalAmount.subtotal,
        shipping: totalAmount.shipping,
        total: totalAmount.total
      },
      shippingAddress: {
        address: shippingAddress?.address || 'Adres belirtilmemiş',
        city: shippingAddress?.city || 'İstanbul',
        district: shippingAddress?.district || '',
        postalCode: shippingAddress?.postalCode || '',
        phone: customer?.phone || '0000000000'
      },
      shippingMethod: shippingMethod,
      payment: {
        method: payment?.method || 'bank_transfer',
        status: payment?.status || 'pending'
      },
      status: {
        current: 'pending'
      }
    });

    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Sipariş oluşturulurken hata oluştu', error: error.message });
  }
};

// Sipariş sil
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      res.json({ message: 'Sipariş silindi' });
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Sipariş silinirken hata oluştu', error: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  deleteOrder,
  getOrders,
  getStatistics
};
