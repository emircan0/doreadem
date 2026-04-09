const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('orderId', 'orderNumber status createdAt')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Faturalar getirilirken hata oluştu', error: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { orderId, customerType, taxDetails, billingAddress, items, totals, notes } = req.body;
    
    const existingInvoice = await Invoice.findOne({ orderId });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Bu sipariş için zaten bir fatura oluşturulmuş' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    const newInvoice = new Invoice({
      orderId,
      customerType,
      taxDetails,
      billingAddress,
      items: items || order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        vat: 20,
        total: item.price * item.quantity
      })),
      totals: totals || {
        subtotal: order.totalAmount.subtotal,
        taxTotal: order.totalAmount.total - order.totalAmount.subtotal,
        grandTotal: order.totalAmount.total
      },
      status: 'issued', // Issued by default if manually created for now
      notes
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: 'Fatura oluşturulurken hata oluştu', error: error.message });
  }
};

const getInvoiceByOrderId = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ orderId: req.params.orderId });
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ message: 'Fatura bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fatura getirilirken hata oluştu', error: error.message });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totals.grandTotal' },
          totalInvoices: { $sum: 1 },
          issuedCount: { $sum: { $cond: [{ $eq: ['$status', 'issued'] }, 1, 0] } }
        }
      }
    ]);

    const dailyIssued = await Invoice.aggregate([
      { $match: { status: 'issued' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$invoiceDate' } },
          amount: { $sum: '$totals.grandTotal' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    res.json({
      summary: stats[0] || { totalRevenue: 0, totalInvoices: 0, issuedCount: 0 },
      daily: dailyIssued
    });
  } catch (error) {
    res.status(500).json({ message: 'Fatura istatistikleri getirilirken hata oluştu', error: error.message });
  }
};

module.exports = {
  getInvoices,
  createInvoice,
  getInvoiceByOrderId,
  getInvoiceStats
};
