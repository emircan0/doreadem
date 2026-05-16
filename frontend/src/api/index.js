import axios from 'axios';
import config from '../config';

const API = axios.create({ baseURL: config.API_URL });

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            const parsed = JSON.parse(userInfo);
            if (parsed && parsed.token) {
                req.headers.Authorization = `Bearer ${parsed.token}`;
            }
        } catch (e) {
            console.error('Error parsing userInfo from localStorage', e);
        }
    }
    return req;
});

// Ürün API'leri
export const fetchProducts = (params) => API.get('/products', { params });
export const searchProducts = (query) => API.get(`/products?q=${encodeURIComponent(query)}`);

export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (newProduct) => API.post('/products', newProduct);
export const updateProduct = (id, updatedProduct) => API.patch(`/products/${id}`, updatedProduct);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Kullanıcı API'leri
export const signin = (formData) => API.post('/users/login', formData);
export const signup = (formData) => API.post('/users/register', formData);

// Profil Güncelleme (userId parametreli)
export const updateProfile = (userId, userData) => API.put(`/users/profile/${userId}`, userData);
export const getUserProfileId = (userId) => API.get(`/users/profile/${userId}`);

// Şifre Değiştirme
export const changePassword = (passwordData) => API.post('/users/change-password', passwordData);
export const resetPassword = (email) => API.post('/users/reset-password', { email });
export const updateAddress = (id, addressData) => API.put(`/users/profile/address/${id}`, addressData); 
export const addAddress = (addressData) => API.post(`/users/profile/address`, addressData);
export const deleteAddress = (id) => API.delete(`/users/profile/address/${id}`);
export const updateNotificationSettings = (settings) => API.put('/users/profile/notifications', settings);
export const getAddresses = () => API.get(`/users/profile/address`);


// Kategori API'leri
export const fetchCategories = () => API.get('/categories');  // Kategorileri al

// Marka API'leri
export const fetchBrands = () => API.get('/brands');  // Markaları al

export const createOrder = (orderData) => API.post('/orders', orderData);
export const fetchUserOrders = (userEmail) => API.get(`/orders/user/${userEmail}`);
export const trackOrder = (orderNumber) => API.get(`/orders/track/${orderNumber}`);

