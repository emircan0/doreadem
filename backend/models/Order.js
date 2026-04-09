const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional for guests
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, // Snapshot at time of order
    sku: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
        size: String,
        color: String
    }
  }],
  totalAmount: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'Türkiye' }
  },
  shippingMethod: {
    name: String,
    price: Number,
    estimatedDelivery: String
  },
  payment: {
    method: { type: String, enum: ['credit_card', 'bank_transfer', 'cod'], default: 'bank_transfer' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String
  },
  status: {
    current: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    history: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: String
    }]
  },
  notes: String,
  giftOptions: {
    isGift: { type: Boolean, default: false },
    giftNote: { type: String },
    senderName: { type: String }
  },
  deliveryDate: { type: String }
}, {
  timestamps: true
});

// Middleware to track status history
orderSchema.pre('save', function(next) {
    if (this.isModified('status.current')) {
        this.status.history.push({
            status: this.status.current,
            timestamp: new Date(),
            note: 'Durum güncellendi'
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
