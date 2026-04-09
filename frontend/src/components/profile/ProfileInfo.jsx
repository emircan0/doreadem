import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../context/NotificationContext';
import { fetchUserProfile, updateProfile } from '../../store/actions/userActions';

const ProfileInfo = () => {
    const { userInfo } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: ''
    });

    useEffect(() => {
        if (userInfo && userInfo._id) {
            dispatch(fetchUserProfile(userInfo._id));
        }
    }, [dispatch]); // Only on mount

    useEffect(() => {
        if (userInfo) {
            // Safe date formatting
            let formattedDate = '';
            if (userInfo.birthDate) {
                const date = new Date(userInfo.birthDate);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().split('T')[0];
                }
            }

            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                phone: userInfo.phone || '',
                birthDate: formattedDate,
                gender: userInfo.gender === 'unspecified' ? '' : (userInfo.gender || '')
            });
        }
    }, [userInfo]);
    
    // Debug logging to help identify mapping issues
    useEffect(() => {
        if (userInfo) {
            console.log('Received UserInfo:', userInfo);
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userInfo && userInfo._id) {
            try {
                await dispatch(updateProfile(userInfo._id, formData));
                showNotification('Profiliniz başarıyla güncellendi', 'success');
            } catch (error) {
                showNotification('Bir hata oluştu, lütfen tekrar deneyin', 'error');
            }
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-12 space-y-2">
                <h2 className="text-2xl font-serif text-lux-dark lowercase tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    hesap detayları
                </h2>
                <p className="text-[10px] text-lux-dark/40 uppercase tracking-[0.2em] font-medium">
                    Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                        <label className="block text-[9px] font-bold text-lux-accent uppercase tracking-[0.2em]">Ad Soyad</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                            placeholder="Adınız Soyadınız"
                        />
                    </div>

                    <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                        <label className="block text-[9px] font-bold text-lux-accent uppercase tracking-[0.2em]">E-posta</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                            placeholder="eposta@adresiniz.com"
                        />
                    </div>

                    <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                        <label className="block text-[9px] font-bold text-lux-accent uppercase tracking-[0.2em]">Telefon</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                            placeholder="+90 (___) ___ __ __"
                        />
                    </div>

                    <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                        <label className="block text-[9px] font-bold text-lux-accent uppercase tracking-[0.2em]">Doğum Tarihi</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm focus:ring-0 [color-scheme:light]"
                        />
                    </div>

                    <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                        <label className="block text-[9px] font-bold text-lux-accent uppercase tracking-[0.2em]">Cinsiyet</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm focus:ring-0 appearance-none cursor-pointer"
                        >
                            <option value="">Belirtilmedi</option>
                            <option value="male">Erkek</option>
                            <option value="female">Kadın</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-start pt-6">
                    <button
                        type="submit"
                        className="group relative px-10 py-4 overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-lux-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        <span className="relative text-[10px] font-bold tracking-[0.3em] uppercase text-lux-dark whitespace-nowrap">
                            Değişiklikleri Kaydet
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;