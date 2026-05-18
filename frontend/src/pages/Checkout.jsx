import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '../api/index';
import config from '../config';
import { fetchAddresses } from '../store/actions/userActions';

const API_BASE = config.API_BASE;

const STEPS = ['ADRES', 'KARGO', 'ÖDEME', 'ONAY'];

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const { userInfo } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [addressData, setAddressData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    address: '',
    city: 'İstanbul',
    district: '',
    postalCode: ''
  });

  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('bank_transfer');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!cart || cart.length === 0) {
      navigate('/sepet');
    }
  }, [cart, navigate]);

  // Fetch addresses on mount if logged in
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, userInfo]);

  // Pre-fill form with default or first saved address
  useEffect(() => {
    if (userInfo?.addresses?.length > 0) {
      const defaultAddr = userInfo.addresses.find(a => a.isDefault) || userInfo.addresses[0];
      if (defaultAddr) {
        setAddressData({
          name: defaultAddr.fullName || userInfo.name || '',
          email: userInfo.email || '',
          phone: defaultAddr.phone || userInfo.phone || '',
          address: defaultAddr.fullAddress || '',
          city: defaultAddr.city || 'İstanbul',
          district: defaultAddr.district || '',
          postalCode: defaultAddr.zipCode || ''
        });
      }
    }
  }, [userInfo]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!addressData.name || !addressData.email || !addressData.phone || !addressData.address) {
        alert('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }
    }
    if (currentStep === 1 && !selectedShipping) {
      alert('Lütfen bir kargo firması seçin.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const calculateShipping = () => {
    if (!selectedShipping) return 0;
    if (selectedShipping.freeAbove && cartTotal >= selectedShipping.freeAbove) return 0;
    return selectedShipping.price || 0;
  };

  const shippingCost = calculateShipping();
  const totalAmount = cartTotal + shippingCost;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    const orderData = {
      customer: {
        name: addressData.name,
        email: addressData.email,
        phone: addressData.phone,
        user: userInfo?._id
      },
      items: cart.map(item => ({
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: {
        subtotal: cartTotal,
        shipping: shippingCost,
        total: totalAmount
      },
      shippingAddress: {
        address: addressData.address,
        city: addressData.city,
        district: addressData.district,
        postalCode: addressData.postalCode
      },
      shippingMethod: selectedShipping,
      payment: {
        method: selectedPayment,
        status: selectedPayment === 'credit_card' ? 'completed' : 'pending'
      },
      status: {
        current: 'pending'
      }
    };

    try {
      const response = await createOrder(orderData);
      if (response.status === 201 || response.status === 200) {
        // Success
        setCurrentStep(3); // Go to success step
        clearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-lux-bg min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 lg:px-12">

        {/* Progress Tracker */}
        <div className="max-w-3xl mx-auto mb-16 px-4">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-lux-dark/10 w-full -z-10"></div>
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-xs border transition-all duration-500 bg-white ${i <= currentStep ? 'border-lux-accent text-lux-accent shadow-lg shadow-lux-accent/20' : 'border-lux-dark/10 text-lux-muted'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-[9px] font-bold tracking-[0.2em] transition-colors duration-500 ${i <= currentStep ? 'text-lux-dark' : 'text-lux-muted'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Main Content */}
          <div className="flex-1 w-full min-h-[500px]">
            {currentStep === 0 && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl text-lux-dark mb-10 uppercase tracking-widest border-b border-lux-dark/5 pb-4">Teslimat Bilgileri</h2>
                
                {/* Saved Address Selector */}
                {userInfo?.addresses?.length > 0 && (
                  <div className="mb-10 animate-fade-in">
                    <label className="lux-label mb-5 text-lux-accent font-bold tracking-[0.2em] uppercase block">Kayıtlı Adresleriniz</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userInfo.addresses.map((addr) => {
                        const isSelected = 
                          addressData.address === addr.fullAddress && 
                          addressData.city === addr.city && 
                          addressData.district === addr.district;

                        return (
                          <div 
                            key={addr._id}
                            onClick={() => setAddressData({
                              name: addr.fullName || userInfo.name || '',
                              email: userInfo.email || '',
                              phone: addr.phone || userInfo.phone || '',
                              address: addr.fullAddress || '',
                              city: addr.city || 'İstanbul',
                              district: addr.district || '',
                              postalCode: addr.zipCode || ''
                            })}
                            className={`p-6 bg-white border cursor-pointer transition-all duration-300 hover:border-lux-accent flex flex-col justify-between shadow-sm hover:shadow-md ${isSelected ? 'border-lux-accent ring-1 ring-lux-accent/20 bg-lux-accent/[0.02]' : 'border-lux-dark/5'}`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-lux-accent">{addr.title}</span>
                                {addr.isDefault && <span className="text-[8px] text-lux-muted uppercase tracking-widest font-bold bg-gray-50 px-2 py-0.5 rounded">Varsayılan</span>}
                              </div>
                              <p className="text-xs font-bold text-lux-dark mb-1">{addr.fullName}</p>
                              <p className="text-[10px] text-lux-muted mb-2 tracking-wide">{addr.phone}</p>
                              <p className="text-xs text-lux-dark/80 leading-relaxed font-light line-clamp-2">{addr.fullAddress}</p>
                              <p className="text-[10px] text-lux-muted mt-2 font-medium tracking-wide">{addr.district} / {addr.city}</p>
                            </div>
                            {isSelected && (
                              <span className="text-[9px] font-bold text-lux-accent uppercase tracking-widest mt-5 flex items-center gap-1.5 self-end">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                SEÇİLİ
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 md:p-12 border border-lux-dark/5 shadow-sm">
                  <div className="md:col-span-2">
                    <label className="lux-label">AD SOYAD *</label>
                    <input className="lux-input" value={addressData.name} onChange={e => setAddressData({ ...addressData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="lux-label">E-POSTA *</label>
                    <input className="lux-input" value={addressData.email} onChange={e => setAddressData({ ...addressData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="lux-label">TELEFON *</label>
                    <input className="lux-input" value={addressData.phone} onChange={e => setAddressData({ ...addressData, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="lux-label">ADRES *</label>
                    <textarea className="lux-input" rows={3} value={addressData.address} onChange={e => setAddressData({ ...addressData, address: e.target.value })} placeholder="Mahalle, sokak, no, daire..." />
                  </div>
                  <div>
                    <label className="lux-label">İLÇE</label>
                    <input className="lux-input" value={addressData.district} onChange={e => setAddressData({ ...addressData, district: e.target.value })} />
                  </div>
                  <div>
                    <label className="lux-label">ŞEHİR *</label>
                    <input className="lux-input" value={addressData.city} onChange={e => setAddressData({ ...addressData, city: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl text-lux-dark mb-10 uppercase tracking-widest border-b border-lux-dark/5 pb-4">Kargo Seçimi</h2>
                <div className="space-y-4">
                  {(settings?.shippingMethods || []).map((m, idx) => (
                    <label key={idx} className={`block p-6 bg-white border cursor-pointer transition-all hover:border-lux-accent ${selectedShipping?.name === m.name ? 'border-lux-accent ring-1 ring-lux-accent/20' : 'border-lux-dark/5'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <input type="radio" className="w-4 h-4 accent-lux-accent" checked={selectedShipping?.name === m.name} onChange={() => setSelectedShipping(m)} />
                          <div>
                            <p className="font-sans font-bold text-lux-dark uppercase tracking-wider">{m.name}</p>
                            <p className="text-[10px] text-lux-muted mt-0.5 tracking-widest">{m.description}</p>
                          </div>
                        </div>
                        <p className="font-sans font-bold text-lux-dark">
                          {m.freeAbove && cartTotal >= m.freeAbove ? 'ÜCRETSİZ' : `₺${m.price.toLocaleString('tr-TR')}`}
                        </p>
                      </div>
                    </label>
                  ))}
                  {(!settings?.shippingMethods || settings.shippingMethods.length === 0) && (
                    <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-2xl text-center">
                      <svg className="w-10 h-10 text-amber-500/80 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800">⚠️ Aktif kargo yöntemi bulunmamaktadır.</p>
                      <p className="text-[10px] text-amber-700/70 mt-1.5 leading-relaxed">Sitede aktif kargo firması tanımlanmamış. Lütfen site yöneticisiyle iletişime geçin.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl text-lux-dark mb-10 uppercase tracking-widest border-b border-lux-dark/5 pb-4">Ödeme Yöntemi</h2>
                <div className="space-y-6">
                  {/* Bank Transfer */}
                  {settings?.paymentMethods?.bankTransfer?.enabled && (
                    <div className={`p-6 bg-white border transition-all ${selectedPayment === 'bank_transfer' ? 'border-lux-accent ring-1 ring-lux-accent/20' : 'border-lux-dark/5'}`}>
                      <label className="flex items-center gap-4 cursor-pointer mb-4">
                        <input type="radio" className="w-4 h-4 accent-lux-accent" checked={selectedPayment === 'bank_transfer'} onChange={() => setSelectedPayment('bank_transfer')} />
                        <span className="font-sans font-bold text-lux-dark uppercase tracking-widest">Havale / EFT</span>
                      </label>
                      {selectedPayment === 'bank_transfer' && (
                        <div className="ml-8 p-4 bg-lux-bg border border-lux-dark/5 text-[11px] text-lux-muted leading-relaxed font-sans whitespace-pre-wrap">
                          {settings?.paymentMethods?.bankTransfer?.details || 'Hesap bilgileri henüz eklenmemiş.'}
                          <p className="mt-4 font-bold text-lux-dark italic">* Sipariş numaranızı açıklama kısmına yazmayı unutmayınız.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Credit Card */}
                  {settings?.paymentMethods?.creditCard?.enabled && (
                    <div className={`p-6 bg-white border transition-all ${selectedPayment === 'credit_card' ? 'border-lux-accent ring-1 ring-lux-accent/20' : 'border-lux-dark/5'}`}>
                      <label className="flex items-center gap-4 cursor-pointer mb-4">
                        <input type="radio" className="w-4 h-4 accent-lux-accent" checked={selectedPayment === 'credit_card'} onChange={() => setSelectedPayment('credit_card')} />
                        <span className="font-sans font-bold text-lux-dark uppercase tracking-widest">Kredi / Banka Kartı</span>
                      </label>
                      {selectedPayment === 'credit_card' && (
                        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown">
                          <div className="md:col-span-2">
                            <label className="lux-label text-[9px]">KART NUMARASI</label>
                            <input className="lux-input" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div>
                            <label className="lux-label text-[9px]">SON KULLANMA TARİHİ</label>
                            <input className="lux-input" placeholder="AA / YY" />
                          </div>
                          <div>
                            <label className="lux-label text-[9px]">CVC / GÜVENLİK KODU</label>
                            <input className="lux-input" placeholder="***" />
                          </div>
                          <p className="md:col-span-2 text-[10px] text-lux-muted italic">* Bu bir deneme ortamıdır, gerçek kart bilgisi girmenize gerek yoktur.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="font-display text-4xl text-lux-dark mb-4">Siparişiniz Alındı!</h2>
                <p className="text-lux-muted max-w-md mx-auto mb-12 font-sans leading-relaxed">
                  Zarif seçimleriniz için teşekkürler. Sipariş detaylarını içeren bir onay e-postası kayıtlı e-posta adresinize gönderildi.
                </p>
                <div className="space-x-4">
                  <button onClick={() => navigate('/')} className="inline-block bg-lux-dark text-white px-10 py-4 font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-black transition-all">Keşfetmeye Devam Et</button>
                  <button onClick={() => navigate(userInfo ? '/hesabim?tab=orders' : '/')} className="inline-block border border-lux-dark/10 text-lux-dark px-10 py-4 font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all">Sipariş Takibi</button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="mt-16 flex gap-4">
                {currentStep > 0 && (
                  <button onClick={handleBack} className="flex-1 border border-lux-dark/10 text-lux-dark py-5 font-sans text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all">Geri</button>
                )}
                <button
                  onClick={currentStep === 2 ? handleSubmitOrder : handleNext}
                  disabled={isSubmitting}
                  className={`py-5 font-sans text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-lg active:scale-[0.98] ${currentStep === 0 ? 'w-full' : 'flex-1'} bg-lux-dark text-white hover:bg-black`}
                >
                  {isSubmitting ? 'İşleniyor...' : (currentStep === 2 ? 'Ödemeyi Tamamla ve Onayla' : 'Devam Et')}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {currentStep < 3 && (
            <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-32">
              <div className="bg-white border border-lux-dark/5 p-8 md:p-10 shadow-xl shadow-lux-dark/5">
                <h3 className="font-display text-lg text-lux-dark mb-8 uppercase tracking-widest border-b border-lux-dark/5 pb-4">Ürünler</h3>

                <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, idx) => {
                    const img = item.images?.[0]?.startsWith('http') ? item.images[0] : `${API_BASE}${item.images?.[0] || ''}`;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 h-20 bg-cream-50 overflow-hidden shrink-0">
                          <img src={img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-lux-dark uppercase truncate">{item.name}</p>
                          <p className="text-[9px] text-lux-muted mt-1 uppercase">Miktar: {item.quantity}</p>
                          <p className="text-[10px] font-bold text-lux-dark mt-2">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-6 border-t border-lux-dark/5">
                  <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-lux-muted">
                    <span>ARA TOPLAM</span>
                    <span className="text-lux-dark">₺{cartTotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-lux-muted">
                    <span>KARGO</span>
                    <span className="text-lux-dark">{shippingCost === 0 ? 'ÜCRETSİZ' : `₺${shippingCost.toLocaleString('tr-TR')}`}</span>
                  </div>
                  <div className="pt-6 border-t border-lux-dark/10 flex justify-between items-baseline">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-lux-dark">TOPLAM</span>
                    <span className="text-2xl font-sans font-bold text-lux-dark">₺{totalAmount.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
