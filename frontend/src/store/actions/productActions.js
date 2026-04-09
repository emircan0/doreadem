import * as api from '../../api';

export const getProducts = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
        const { data } = await api.fetchProducts();
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ 
            type: 'FETCH_PRODUCTS_FAIL', 
            payload: error.response?.data?.message || error.message 
        });
    }
};

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
        const { data } = await api.fetchProduct(id);
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ 
            type: 'FETCH_PRODUCT_FAIL', 
            payload: error.response?.data?.message || error.message 
        });
    }
}; 