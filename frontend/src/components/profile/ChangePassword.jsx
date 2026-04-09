import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNotification } from '../../context/NotificationContext';
import { changePassword } from '../../store/actions/userActions';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            showNotification('Yeni şifreler eşleşmiyor', 'error');
            return;
        }

        try {
            await dispatch(changePassword(formData));
            showNotification('Şifreniz başarıyla güncellendi', 'success');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            showNotification('Şifre değiştirme işlemi başarısız oldu', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Şifre Değiştir</h2>
            
            <form onSubmit={handleSubmit} className="max-w-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mevcut Şifre
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.current ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Yeni Şifre
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Yeni Şifre Tekrar
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700"
                    >
                        Şifreyi Güncelle
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword; 