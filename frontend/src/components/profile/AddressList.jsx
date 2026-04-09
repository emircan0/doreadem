import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../context/NotificationContext';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../../store/actions/userActions';

const AddressList = () => {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        zipCode: '',
        fullAddress: '',
        isDefault: false,
    });
    const [hasFetchError, setHasFetchError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Adres verileri yükleniyor...');
                const result = await dispatch(fetchAddresses());
                console.log('Adresler verisi:', result);
                setHasFetchError(false);
            } catch (error) {
                console.error('Adresler yüklenirken bir hata oluştu:', error);
                if (!hasFetchError) {
                    showNotification('Adresler yüklenirken bir hata oluştu', 'error');
                    setHasFetchError(true);
                }
            }
        };
        fetchData();
    }, [dispatch, showNotification, hasFetchError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                console.log('Adres güncelleniyor...', formData);
                await dispatch(updateAddress(editingAddress._id, formData));
                showNotification('Adres güncellendi', 'success');
            } else {
                console.log('Yeni adres ekleniyor...', formData);
                await dispatch(addAddress(formData));
                showNotification('Yeni adres eklendi', 'success');
            }

            setShowAddForm(false);
            setEditingAddress(null);
            setFormData({
                title: '',
                fullName: '',
                phone: '',
                city: '',
                district: '',
                zipCode: '',
                fullAddress: '',
                isDefault: false,
            });

            console.log('Adresler yeniden yükleniyor...');
            await dispatch(fetchAddresses());
        } catch (error) {
            console.error('Form gönderiminde bir hata oluştu:', error);
            showNotification('Bir hata oluştu', 'error');
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
            try {
                console.log('Adres siliniyor, ID:', addressId);
                await dispatch(deleteAddress(addressId));
                showNotification('Adres silindi', 'success');
                console.log('Adres silindi, adresler yeniden yükleniyor...');
                await dispatch(fetchAddresses());
            } catch (error) {
                console.error('Silme işlemi başarısız oldu:', error);
                showNotification('Silme işlemi başarısız oldu', 'error');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-12 flex justify-between items-end border-b border-lux-accent/10 pb-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-lux-dark lowercase tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        adreslerim
                    </h2>
                    <p className="text-[10px] text-lux-dark/40 uppercase tracking-[0.2em] font-medium">
                        Kayıtlı teslimat ve fatura adresleriniz.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingAddress(null);
                        setFormData({
                            title: '', fullName: '', phone: '', city: '', district: '', zipCode: '', fullAddress: '', isDefault: false,
                        });
                        setShowAddForm(true);
                    }}
                    className="group relative pb-1"
                >
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-lux-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-lux-dark">Yeni Adres Ekle</span>
                </button>
            </div>

            {/* Adres Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {userInfo?.addresses?.length > 0 ? (
                    userInfo.addresses.map((address) => (
                        <div key={address._id} className="group relative bg-white/40 backdrop-blur-sm border border-lux-accent/5 p-8 transition-all duration-500 hover:shadow-lux hover:border-lux-accent/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-lux-accent">{address.title}</h3>
                                    {address.isDefault && (
                                        <span className="text-[8px] tracking-[0.1em] uppercase text-lux-dark/30 font-bold italic">Varsayılan Adres</span>
                                    )}
                                </div>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => {
                                            setEditingAddress(address);
                                            setFormData(address);
                                            setShowAddForm(true);
                                        }}
                                        className="text-lux-dark/40 hover:text-lux-accent transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address._id)}
                                        className="text-lux-dark/40 hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <p className="text-sm text-lux-dark font-medium">{address.fullName}</p>
                                <p className="text-xs text-lux-dark/60 tracking-wider font-light">{address.phone}</p>
                                <p className="text-xs text-lux-dark/60 leading-relaxed font-light">
                                    {address.fullAddress}<br/>
                                    {address.district} / {address.city} {address.zipCode}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-lux-accent/20">
                         <p className="text-[10px] tracking-[0.3em] uppercase text-lux-dark/30 font-bold">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* Adres Formu Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-lux-dark/60 backdrop-blur-md transition-opacity" onClick={() => setShowAddForm(false)} />
                    
                    <div className="relative w-full max-w-xl bg-lux-bg p-12 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh]">
                        <div className="mb-10 space-y-2">
                             <h3 className="text-2xl font-serif text-lux-dark lowercase tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                                {editingAddress ? 'adresi düzenle' : 'yeni adres ekle'}
                            </h3>
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-8 right-8 text-lux-dark/40 hover:text-lux-dark transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Adres Başlığı</label>
                                    <input
                                        type="text" name="title" value={formData.title} onChange={handleChange} required
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                        placeholder="Örn: Ev, İş"
                                    />
                                </div>
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Ad Soyad</label>
                                    <input
                                        type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                        placeholder="Alıcı Adı"
                                    />
                                </div>
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Telefon</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                        placeholder="+90 (___) ___ __ __"
                                    />
                                </div>
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Şehir</label>
                                    <input
                                        type="text" name="city" value={formData.city} onChange={handleChange} required
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">İlçe</label>
                                    <input
                                        type="text" name="district" value={formData.district} onChange={handleChange} required
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                    <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Posta Kodu</label>
                                    <input
                                        type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                                        className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 border-b border-lux-accent/20 focus-within:border-lux-accent transition-colors pb-2">
                                <label className="block text-[8px] font-bold text-lux-accent uppercase tracking-[0.2em]">Tam Adres</label>
                                <textarea
                                    name="fullAddress" value={formData.fullAddress} onChange={handleChange} required rows={2}
                                    className="block w-full bg-transparent border-none p-0 text-lux-dark text-sm placeholder:text-lux-dark/20 focus:ring-0 resize-none"
                                    placeholder="Mahalle, sokak, numara..."
                                />
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-3 group cursor-pointer w-fit">
                                    <div className="relative flex items-center justify-center w-4 h-4 border border-lux-accent/40 group-hover:border-lux-accent transition-colors bg-transparent">
                                        <input
                                            type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange}
                                            className="appearance-none w-full h-full cursor-pointer checked:bg-lux-accent transition-colors"
                                        />
                                        {formData.isDefault && (
                                            <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-lux-dark/60 group-hover:text-lux-dark transition-colors">Varsayılan Adres Yap</span>
                                </label>
                            </div>

                            <div className="pt-10 flex justify-end gap-6 text-[10px] font-bold tracking-[0.3em] uppercase">
                                <button type="button" onClick={() => setShowAddForm(false)} className="text-lux-dark/40 hover:text-lux-dark py-4 px-8">İptal</button>
                                <button type="submit" className="bg-lux-dark text-white py-4 px-12 hover:bg-lux-accent transition-colors">
                                    {editingAddress ? 'güncelle' : 'kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressList;
