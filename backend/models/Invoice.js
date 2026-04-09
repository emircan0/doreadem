const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `SOS${new Date().getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  customerType: {
    type: String,
    enum: ['individual', 'corporate'],
    default: 'individual'
  },
  taxDetails: {
    tcNo: String,
    taxId: String,
    taxOffice: String,
    companyName: String
  },
  billingAddress: {
    fullName: String,
    address: String,
    city: String,
    district: String,
    phone: String
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    vat: { type: Number, default: 20 }, // Default VAT in Turkey
    total: Number
  }],
  totals: {
    subtotal: Number,
    taxTotal: Number,
    grandTotal: Number
  },
  status: {
    type: String,
    enum: ['draft', 'issued', 'cancelled'],
    default: 'draft'
  },
  eInvoiceStatus: {
    type: String,
    enum: ['none', 'pending', 'sent', 'failed'],
    default: 'none'
  },
  pdfUrl: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
