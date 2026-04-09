import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './reducers/productReducer';
import { userReducer } from './reducers/userReducer';

export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});