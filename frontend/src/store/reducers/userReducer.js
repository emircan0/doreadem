// reducers/userReducer.js

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
    orders: null,
    resetSuccess: false,  // Şifre sıfırlama başarı durumu
};

// Kullanıcı işlemleri için reducer
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN_REQUEST':
            return { ...state, loading: true };
        case 'USER_LOGIN_SUCCESS':
            return { ...state, loading: false, userInfo: action.payload };
        case 'USER_LOGIN_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'USER_LOGOUT':
            return { ...state, userInfo: null, orders: [] };  // Logout sonrası kullanıcı ve siparişleri temizle
        case 'USER_REGISTER_REQUEST':
            return { ...state, loading: true };
        case 'USER_REGISTER_SUCCESS':
            return { ...state, loading: false, userInfo: action.payload };
        case 'USER_REGISTER_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'USER_RESET_PASSWORD_REQUEST':
            return { ...state, loading: true };
        case 'USER_RESET_PASSWORD_SUCCESS':
            return { ...state, loading: false, resetSuccess: true };
        case 'USER_RESET_PASSWORD_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'USER_ORDERS_REQUEST':
            return { ...state, loading: true };  // Siparişleri yüklerken loading'i aktif et
        case 'USER_ORDERS_SUCCESS':
            return { ...state, loading: false, orders: action.payload };  // Sipariş verisi geldiğinde güncelle
        case 'USER_ORDERS_FAIL':
            return { ...state, loading: false, error: action.payload };  // Siparişlerde hata oluşursa error ekle
        case 'USER_PROFILE_REQUEST':
            return { ...state, loading: true };  // Profil güncellenirken loading'i aktif et
        case 'USER_PROFILE_SUCCESS':
            return { ...state, loading: false, userInfo: action.payload };  // Profil güncelleme başarılı olduğunda kullanıcı bilgilerini güncelle
        case 'USER_PROFILE_FAIL':
            return { ...state, loading: false, error: action.payload };  // Profil güncelleme hatasında error ekle
        default:
            return state;
    }
};
