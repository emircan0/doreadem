const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dore_adem_products', // Cloudinary'de oluşturulacak klasör adı
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  },
});

module.exports = { cloudinary, storage };
