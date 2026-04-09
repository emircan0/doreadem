const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Marka adı zorunludur'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    logo: String,
    description: String,
    website: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Middleware to generate slug
brandSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Brand', brandSchema);
