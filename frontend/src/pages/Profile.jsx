import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { logout } from '../store/actions/userActions';
import ProfileInfo from '../components/profile/ProfileInfo';
import AddressList from '../components/profile/AddressList';
import OrderHistory from '../components/profile/OrderHistory';
import NotificationSettings from '../components/profile/NotificationSettings';
import ChangePassword from '../components/profile/ChangePassword';

const Profile = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const { userInfo } = useSelector(state => state.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const tabs = [
        { id: 'profile', label: 'Profilim', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'orders', label: 'Siparişlerim', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'addresses', label: 'Adreslerim', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'password', label: 'Güvenlik', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'notifications', label: 'Tercihler', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    ];

    const handleTabClick = (id) => {
        setActiveTab(id);
        navigate(`/hesabim?tab=${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-16">
                {/* Sol Menü - Sidebar */}
                <div className="w-full md:w-72 shrink-0">
                    <div className="sticky top-40 space-y-12">
                        <div className="space-y-4 px-2">
                            <span className="text-[10px] tracking-[0.3em] text-lux-accent font-bold uppercase">Hesap Paneli</span>
                            <h3 className="text-3xl font-serif text-lux-dark lowercase tracking-tighter" style={{ fontFamily: 'var(--font-serif)' }}>
                                hoş geldin, {userInfo?.name?.split(' ')[0] || 'sevgili misafir'}
                            </h3>
                        </div>

                        <nav className="flex flex-col space-y-1 border-l border-lux-accent/10">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`group flex items-center gap-4 px-6 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative
                                        ${activeTab === tab.id 
                                            ? 'text-lux-dark opacity-100' 
                                            : 'text-lux-dark/40 hover:text-lux-dark hover:opacity-100'
                                        }`}
                                >
                                    {activeTab === tab.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-lux-accent shadow-[0_0_15px_rgba(184,159,128,0.5)]" />
                                    )}
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 text-lux-accent' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                                    </svg>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                        
                        <div className="px-6 pt-12 border-t border-gray-100">
                             <button 
                                onClick={handleLogout}
                                className="text-[10px] font-bold tracking-widest text-red-400 uppercase hover:text-red-500 transition-colors"
                             >
                                Hesaptan Çıkış Yap
                             </button>
                        </div>
                    </div>
                </div>

                {/* Sağ İçerik */}
                <div className="flex-1 min-h-[600px]">
                    <div className="bg-white/40 backdrop-blur-sm border border-lux-accent/5 p-8 md:p-12 shadow-lux transition-all duration-500">
                        {activeTab === 'profile' && <ProfileInfo />}
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'addresses' && <AddressList />}
                        {activeTab === 'password' && <ChangePassword />}
                        {activeTab === 'notifications' && <NotificationSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
 