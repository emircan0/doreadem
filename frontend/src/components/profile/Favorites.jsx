import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { removeFromFavorites } from '../../store/actions/userActions';

const Favorites = () => {
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    const handleRemoveFromFavorites = async (productId) => {
        try {
            await dispatch(removeFromFavorites(productId));
            showNotification('Ürün favorilerden kaldırıldı', 'success');
        } catch (error) {
            showNotification('Bir hata oluştu', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Favori Ürünlerim</h2>
            
            {userInfo.favoriteProducts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userInfo.favoriteProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="relative">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveFromFavorites(product._id)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                                >
                                    <i className="fas fa-heart text-red-500"></i>
                                </button>
                            </div>
                            
                            <div className="p-4">
                                <Link 
                                    to={`/product/${product._id}`}
                                    className="text-lg font-medium text-brown-800 hover:text-brown-600"
                                >
                                    {product.name}
                                </Link>
                                <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-brown-800">
                                        {product.price} TL
                                    </span>
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 text-sm"
                                    >
                                        Ürüne Git
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <i className="far fa-heart text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Henüz favori ürününüz bulunmuyor.</p>
                    <Link 
                        to="/urunler" 
                        className="mt-4 inline-block text-brown-600 hover:text-brown-800"
                    >
                        Ürünleri Keşfet
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites; 