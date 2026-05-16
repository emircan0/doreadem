import * as api from '../../api';
import axios from 'axios';


// Kullanıcı Girişi
export const login = (formData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_LOGIN_REQUEST' });
        const { data } = await api.signin(formData);
        
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: 'USER_LOGIN_FAIL',
            payload: error.response?.data?.message || 'Giriş başarısız'
        });
    }
};

// Kullanıcı Kaydı
export const register = (formData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_REGISTER_REQUEST' });
        const { data } = await api.signup(formData);
        
        dispatch({ type: 'USER_REGISTER_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: 'USER_REGISTER_FAIL',
            payload: error.response?.data?.message || 'Kayıt başarısız'
        });
    }
};

// Profil Güncelleme
export const updateProfile = (userId, userData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_UPDATE_PROFILE_REQUEST' });
        const { data } = await api.updateProfile(userId, userData); // Backend expected to return user object directly
        
        dispatch({ type: 'USER_UPDATE_PROFILE_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Updated fields + persistent token
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: 'USER_UPDATE_PROFILE_FAIL',
            payload: error.response?.data?.message || 'Güncelleme başarısız'
        });
        throw error;
    }
};

export const fetchUserProfile = (userId) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'USER_PROFILE_REQUEST' });

        const { user: { userInfo } } = getState();
        const { data } = await api.getUserProfileId(userId);
        
        const updatedUserInfo = { ...userInfo, ...data }; 
        
        dispatch({ type: 'USER_PROFILE_SUCCESS', payload: updatedUserInfo });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: updatedUserInfo });
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    } catch (error) {
        dispatch({
            type: 'USER_PROFILE_FAIL',
            payload: error.response?.data?.message || error.message,
        });
    }
};


// Şifre Değiştirme
export const changePassword = (passwordData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_CHANGE_PASSWORD_REQUEST' });
        const { data } = await api.changePassword(passwordData);
        
        dispatch({ type: 'USER_CHANGE_PASSWORD_SUCCESS' });
        return data;
    } catch (error) {
        dispatch({
            type: 'USER_CHANGE_PASSWORD_FAIL',
            payload: error.response?.data?.message || 'Şifre değiştirme başarısız'
        });
        throw error;
    }
};

// Adresleri Getir
export const fetchAddresses = () => async (dispatch) => {
    try {
        dispatch({ type: 'USER_FETCH_ADDRESSES_REQUEST' });
        const { data } = await api.getAddresses(); // API isteği adresleri getirir
        console.log('Adresler getirildi:', data);
        dispatch({ type: 'USER_FETCH_ADDRESSES_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'USER_FETCH_ADDRESSES_FAIL',
            payload: error.response?.data?.message || 'Adresler getirilemedi'
        });
        throw error;
    }
};


// Redux fonksiyonları
export const addAddress = (addressData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_ADD_ADDRESS_REQUEST' });
        const { data } = await api.addAddress(addressData); // API işlemi burada çağrılır
        console.log('Gelen veriler son:', data);
        dispatch({ type: 'USER_ADD_ADDRESS_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Kullanıcı bilgilerini güncelle
        localStorage.setItem('userInfo', JSON.stringify(data)); // Kullanıcı bilgilerini localStorage'a kaydet
    } catch (error) {
        dispatch({
            type: 'USER_ADD_ADDRESS_FAIL',
            payload: error.response?.data?.message || 'Adres ekleme başarısız'
        });
        throw error;
    }
};

// Güncelleme işlemi için benzer bir yapı
export const updateAddress = (id, addressData) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_UPDATE_ADDRESS_REQUEST' });
        const { data } = await api.updateAddress(id, addressData); // API güncelleme işlemi
        dispatch({ type: 'USER_UPDATE_ADDRESS_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Sync Redux with new user data
        localStorage.setItem('userInfo', JSON.stringify(data)); // Sync LocalStorage
    } catch (error) {
        dispatch({
            type: 'USER_UPDATE_ADDRESS_FAIL',
            payload: error.response?.data?.message || 'Adres güncelleme başarısız'
        });
        throw error;
    }
};

// Adres Silme
export const deleteAddress = (addressId) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_DELETE_ADDRESS_REQUEST' });
        const { data } = await api.deleteAddress(addressId);
        
        dispatch({ type: 'USER_DELETE_ADDRESS_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Updated user state
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: 'USER_DELETE_ADDRESS_FAIL',
            payload: error.response?.data?.message || 'Adres silme başarısız'
        });
        throw error;
    }
};

// Bildirim Ayarlarını Güncelleme
export const updateNotificationSettings = (settings) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_UPDATE_NOTIFICATIONS_REQUEST' });
        const { data } = await api.updateNotificationSettings(settings);
        
        dispatch({ type: 'USER_UPDATE_NOTIFICATIONS_SUCCESS', payload: data });
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Kullanıcı bilgilerini güncelle
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: 'USER_UPDATE_NOTIFICATIONS_FAIL',
            payload: error.response?.data?.message || 'Ayarlar güncellenemedi'
        });
        throw error;
    }
};

// Çıkış Yap
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'USER_LOGOUT' });
};

// Şifre Sıfırlama
export const resetPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_RESET_PASSWORD_REQUEST' });
        const { data } = await api.resetPassword(email);
        
        dispatch({ type: 'USER_RESET_PASSWORD_SUCCESS', payload: data });
        return data;
    } catch (error) {
        dispatch({
            type: 'USER_RESET_PASSWORD_FAIL',
            payload: error.response?.data?.message || 'Şifre sıfırlama başarısız'
        });
        throw error;
    }
};


export const createOrder = (orderData) => async (dispatch) => {

    try {
        const { data } = await axios.post('/api/orders', orderData);
        dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'ORDER_CREATE_FAIL',
            payload: error.response?.data?.message || 'Sipariş oluşturulamadı'
        });
        throw error;
    } 
};
export const getUserOrders = (userEmail) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_ORDERS_REQUEST' });

        const response = await api.fetchUserOrders(userEmail);  // API çağrısı
        const data = response.data;  // Gelen veriyi alıyoruz
        console.log("API'den gelen sipariş verisi: ", data);
        
        // API'den gelen veriyi doğrudan payload olarak gönderiyoruz
        dispatch({ type: 'USER_ORDERS_SUCCESS', payload: data });  
    } catch (error) {
        dispatch({
            type: 'USER_ORDERS_FAIL',
            payload: error.message || 'Sipariş bilgileri getirilemedi',
        });
    }
};

    

