const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı.');

    const adminData = {
      username: 'emircanmertt',
      email: 'emircanmertt@gmail.com',
      password: '0'
    };

    // Mevcut admin var mı kontrol et
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Bu e-posta ile kayıtlı bir admin zaten var. Güncelleniyor...');
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
    } else {
      const newAdmin = new Admin(adminData);
      await newAdmin.save();
    }

    console.log('Admin başarıyla oluşturuldu/güncellendi!');
    console.log('E-posta: emircanmertt@gmail.com');
    console.log('Şifre: 0');
    
    process.exit(0);
  } catch (error) {
    console.error('Hata oluştu:', error.message);
    process.exit(1);
  }
};

createAdmin();
