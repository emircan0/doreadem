import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../context/NotificationContext';
import { updateNotificationSettings } from '../../store/actions/userActions';

const NotificationSettings = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);
    const { showNotification } = useNotification();
    const [settings, setSettings] = useState({
        email: userInfo.notifications?.email ?? true,
        sms: userInfo.notifications?.sms ?? true,
        promotions: userInfo.notifications?.promotions ?? true,
        orderUpdates: userInfo.notifications?.orderUpdates ?? true,
        newsletter: userInfo.notifications?.newsletter ?? true
    });

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateNotificationSettings(settings));
            showNotification('Bildirim ayarlarınız güncellendi', 'success');
        } catch (error) {
            showNotification('Güncelleme sırasında bir hata oluştu', 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Bildirim Ayarları</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">E-posta Bildirimleri</h3>
                            <p className="text-sm text-gray-500">
                                Sipariş durumu ve özel teklifler hakkında e-posta alın
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="email"
                                checked={settings.email}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">SMS Bildirimleri</h3>
                            <p className="text-sm text-gray-500">
                                Kargo takibi ve önemli bilgilendirmeler için SMS alın
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="sms"
                                checked={settings.sms}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Promosyon ve İndirimler</h3>
                            <p className="text-sm text-gray-500">
                                Özel kampanya ve indirimlerden haberdar olun
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="promotions"
                                checked={settings.promotions}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700"
                    >
                        Ayarları Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings; 