const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Categories');
const Brand = require('./models/Brands');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dore_adem';

async function checkDb() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        
        const categories = await Category.find({});
        console.log('Categories:', categories.length);
        categories.forEach(c => console.log(`- ${c.name} (slug: ${c.slug})`));
        
        const brands = await Brand.find({});
        console.log('Brands:', brands.length);
        brands.forEach(b => console.log(`- ${b.name} (slug: ${b.slug})`));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDb();
