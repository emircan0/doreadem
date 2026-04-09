const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori adı zorunludur'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: String,
    image: String,
    icon: String, // Store emoji or SVG path
    location: { 
        type: String, 
        enum: ['navbar', 'sidebar', 'both'],
        default: 'navbar'
    },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

// Middleware to generate slug
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
