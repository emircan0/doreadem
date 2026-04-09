const mongoose = require('mongoose');
const slugify = require('slugify');

const organizationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Organizasyon başlığı zorunludur'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Açıklama zorunludur']
    },
    mainImage: {
        type: String,
        required: [true, 'Ana görsel zorunludur']
    },
    gallery: [{
        type: String
    }],
    location: {
        type: String,
        trim: true
    },
    date: {
        type: Date
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Generate slug before saving
organizationSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Organization', organizationSchema);
