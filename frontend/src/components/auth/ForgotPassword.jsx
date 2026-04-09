import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../store/actions/userActions';
import { useNotification } from '../../context/NotificationContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(resetPassword(email));
            showNotification('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi', 'success');
            setEmail('');
        } catch (error) {
            showNotification('Şifre sıfırlama işlemi başarısız oldu', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-brown-800">
                        Şifremi Unuttum
                    </h2>
                    <p className="mt-2 text-center text-sm text-brown-600">
                        E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            E-posta Adresi
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brown-500 focus:border-brown-500 focus:z-10 sm:text-sm"
                            placeholder="E-posta adresi"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i className="fas fa-spinner fa-spin"></i>
                                </span>
                            ) : null}
                            Şifre Sıfırlama Bağlantısı Gönder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword; 