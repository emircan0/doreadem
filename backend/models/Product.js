const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Ürün açıklaması zorunludur']
    },
    shortDescription: {
        type: String,
        maxLength: 200
    },
    price: {
        type: Number,
        required: [true, 'Ürün fiyatı zorunludur'],
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'En az bir kategori seçilmelidir']
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Marka zorunludur']
    },
    variants: [{
        size: String,
        color: String,
        stock: { type: Number, default: 0 },
        sku: String,
        priceOverride: Number
    }],
    images: {
        type: [String],
        validate: [v => v.length > 0, 'En az bir resim yüklenmelidir']
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: { type: String, default: 'cm' }
    },
    weight: {
        value: Number,
        unit: { type: String, default: 'kg' }
    },
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    upsellOptions: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to generate slug
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', sku: 'text' });
productSchema.index({ categories: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
