const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Category = require('./models/Categories');
const Brand = require('./models/Brands');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dore_adem';

async function fixSlugs() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        
        const categories = await Category.find({ slug: { $exists: false } });
        console.log('Categories without slug:', categories.length);
        for (const c of categories) {
            c.slug = slugify(c.name, { lower: true, strict: true });
            await c.save();
            console.log(`- Fixed Category: ${c.name} -> ${c.slug}`);
        }

        // Also fix those with null or undefined
        const categoriesNull = await Category.find({ slug: null });
        for (const c of categoriesNull) {
            c.slug = slugify(c.name, { lower: true, strict: true });
            await c.save();
            console.log(`- Fixed Null Category: ${c.name} -> ${c.slug}`);
        }
        
        const brands = await Brand.find({ slug: { $exists: false } });
        console.log('Brands without slug:', brands.length);
        for (const b of brands) {
            b.slug = slugify(b.name, { lower: true, strict: true });
            await b.save();
            console.log(`- Fixed Brand: ${b.name} -> ${b.slug}`);
        }

        const brandsNull = await Brand.find({ slug: null });
        for (const b of brandsNull) {
            b.slug = slugify(b.name, { lower: true, strict: true });
            await b.save();
            console.log(`- Fixed Null Brand: ${b.name} -> ${b.slug}`);
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

fixSlugs();
