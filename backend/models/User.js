const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    title: { type: String, required: true, default: 'Ev' },
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    zipCode: { type: String },
    fullAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional if using social login later
    phone: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', 'unspecified'], default: 'unspecified' },
    role: { type: String, enum: ['user', 'admin', 'editor'], default: 'user' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    previousStates: [{
        name: String,
        email: String,
        phone: String,
        birthDate: Date,
        gender: String,
        updatedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Method to safely return user object (hide password)
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
