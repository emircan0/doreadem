const initialState = {
    products: [],
    loading: false,
    error: null,
    product: null
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload };
        case 'FETCH_PRODUCTS_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'FETCH_PRODUCT_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_PRODUCT_SUCCESS':
            return { ...state, loading: false, product: action.payload };
        case 'FETCH_PRODUCT_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}; 