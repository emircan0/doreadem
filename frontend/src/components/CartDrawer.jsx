import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, deliveryDetails, updateDeliveryDetails } = useCart();
    
    // Yetersiz tutar hesaplama (Free shipping threshold: 500 TL)
    const FREE_SHIPPING_THRESHOLD = 500;
    const amountLeft = FREE_SHIPPING_THRESHOLD - cartTotal;
    const progressPercent = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    // Delivery Selection Helpers
    const getNextDays = () => {
        const days = [];
        const today = new Date();
        const locale = 'tr-TR';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            let label = '';
            if (i === 0) label = 'Bugün';
            else if (i === 1) label = 'Yarın';

            days.push({
                full: date.toISOString().split('T')[0],
                label: label,
                dayNum: date.getDate(),
                month: date.toLocaleDateString(locale, { month: 'short' })
            });
        }
        return days;
    };

    const TIME_SLOTS = [
        '09:00 - 12:00',
        '12:00 - 15:00',
        '15:00 - 18:00',
        '18:00 - 21:00'
    ];

    // Prevent scrolling on body when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity duration-500"
                onClick={() => setIsCartOpen(false)}
            />
            
            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[160] flex flex-col transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <h2 className="text-xl font-serif font-bold text-lux-dark flex items-center gap-2">
                        Sepetim 
                        <span className="bg-lux-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold">
                            {cart.length}
                        </span>
                    </h2>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:rotate-90 duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Free Shipping Progress */}
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                        {amountLeft > 0 ? (
                            <>
                                <p className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-mega-wide">
                                    Ücretsiz kargo için <span className="text-lux-accent font-black tracking-normal">₺{amountLeft.toLocaleString('tr-TR')}</span> kaldı
                                </p>
                                <div className="w-full h-1.5 bg-white border border-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-lux-accent transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 py-1">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest">Ücretsiz Kargo Kazandınız!</p>
                            </div>
                        )}
                    </div>

                    {/* Delivery Time Selection */}
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[10px] font-bold text-lux-dark tracking-mega-wide uppercase flex items-center gap-2">
                                <svg className="w-4 h-4 text-lux-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Teslimat Zamanı
                            </h3>
                            {deliveryDetails.date && <span className="text-[10px] font-bold text-lux-accent uppercase bg-pink-50 px-2 py-1 rounded">Seçildi</span>}
                        </div>
                        
                        {/* Date List */}
                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {getNextDays().map((day) => (
                                <button
                                    key={day.full}
                                    onClick={() => updateDeliveryDetails({ date: day.full })}
                                    className={`flex flex-col items-center justify-center min-w-[72px] h-[85px] rounded-2xl border transition-all duration-500 ${deliveryDetails.date === day.full ? 'border-lux-accent bg-lux-accent/5 ring-1 ring-lux-accent/20' : 'border-gray-100 hover:border-lux-accent/30 bg-gray-50/20'}`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter mb-1 h-3 ${deliveryDetails.date === day.full ? 'text-lux-accent' : 'text-gray-400'}`}>{day.label}</span>
                                    <span className={`text-xl font-serif font-black ${deliveryDetails.date === day.full ? 'text-lux-dark' : 'text-gray-700'}`}>{day.dayNum}</span>
                                    <span className={`text-[9px] font-bold uppercase ${deliveryDetails.date === day.full ? 'text-lux-accent' : 'text-gray-400'}`}>{day.month}</span>
                                </button>
                            ))}
                        </div>

                        {/* Time Slots Grid */}
                        {deliveryDetails.date && (
                            <div className="grid grid-cols-2 gap-2 mt-4 animate-fade-in-up">
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => updateDeliveryDetails({ timeSlot: slot })}
                                        className={`py-3.5 px-4 rounded-xl border text-[11px] font-bold tracking-tight transition-all duration-500 ${deliveryDetails.timeSlot === slot ? 'border-lux-dark bg-lux-dark text-white shadow-xl translate-y-[-1px]' : 'border-gray-100 bg-gray-50/50 text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="p-6 flex flex-col divide-y divide-gray-50">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <p className="text-lg font-serif italic text-lux-dark">Sepetiniz Boş</p>
                                <p className="text-[10px] mt-2 font-bold tracking-mega-wide uppercase text-gray-400">Güzellikleri Keşfetmeye Başla</p>
                            </div>
                        ) : (
                            cart.map((item) => {
                                const price = item.price || 0;
                                const discount = item.discount || 0;
                                const quantity = item.quantity || 1;
                                const finalPrice = price * (1 - discount / 100) * quantity;
                                
                                return (
                                    <div key={item._id || item.id} className="flex gap-5 py-6 group first:pt-0 last:pb-0">
                                        <div className="relative">
                                            <Link to={`/product/${item._id || item.id}`} onClick={() => setIsCartOpen(false)} className="block w-20 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-[800ms] ease-out">
                                                <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                                            </Link>
                                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-lux-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                {quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-serif text-[15px] font-black text-lux-dark leading-snug group-hover:text-lux-accent transition-colors duration-300 pr-4">{item.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1.5 rotate-0">
                                                        <span className="text-[9px] font-black text-lux-accent uppercase tracking-[0.2em]">Premium Butik</span>
                                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.category?.name || (typeof item.category === 'string' ? item.category : 'Hızlı Teslimat')}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item._id || item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center border border-gray-100 rounded-xl h-8 bg-white shadow-sm overflow-hidden p-0.5">
                                                    <button 
                                                        className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-lux-accent hover:bg-gray-50 transition-all"
                                                        onClick={() => updateQuantity(item._id || item.id, Math.max(1, quantity - 1))}
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth={3} strokeLinecap="round" /></svg>
                                                    </button>
                                                    <span className="w-6 text-center text-[12px] font-black text-lux-dark">{quantity}</span>
                                                    <button 
                                                        className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-lux-accent hover:bg-gray-50 transition-all"
                                                        onClick={() => updateQuantity(item._id || item.id, quantity + 1)}
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} strokeLinecap="round" /></svg>
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    {discount > 0 && <span className="block text-[10px] text-gray-300 line-through font-bold">₺{(price * quantity).toLocaleString('tr-TR')}</span>}
                                                    <p className="font-black text-lux-dark text-lg tracking-tighter leading-none">
                                                        ₺{finalPrice.toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer / Summary */}
                {cart.length > 0 && (
                    <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] text-gray-400 font-bold uppercase tracking-メガ-wide">
                                <span>Ara Toplam</span>
                                <span className="text-gray-600 font-black tracking-normal">₺{cartTotal.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-gray-400 font-bold uppercase tracking-メガ-wide pb-4 border-b border-gray-50">
                                <span>Lojistik / Kargo</span>
                                <span className={amountLeft <= 0 ? 'text-green-600 font-black tracking-normal' : 'text-gray-600 font-black tracking-normal'}>
                                    {amountLeft <= 0 ? 'Ücretsiz' : 'Hesaplanacak'}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="font-serif text-xl font-black text-lux-dark uppercase tracking-tight">Toplam</span>
                                <div className="text-right">
                                    <span className="font-serif text-3xl font-black text-lux-accent tracking-tighter">₺{cartTotal.toLocaleString('tr-TR')}</span>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-mega-wide mt-1 italic">KDV Dahil Fiyattır</p>
                                </div>
                            </div>
                        </div>

                        <Link 
                            to="/odeme" 
                            onClick={(e) => {
                                if (!deliveryDetails.date || !deliveryDetails.timeSlot) {
                                  e.preventDefault();
                                  toast.error('Lütfen teslimat zamanı seçiniz.', { position: "top-center", autoClose: 3000 });
                                  return;
                                }
                                setIsCartOpen(false);
                            }}
                            className={`w-full h-15 rounded-2xl flex items-center justify-center text-xs font-black tracking-[0.3em] uppercase transition-all duration-700 relative overflow-hidden group ${(!deliveryDetails.date || !deliveryDetails.timeSlot) ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-lux-dark text-white hover:bg-lux-accent shadow-2xl hover:shadow-lux-accent/30 active:scale-[0.98]'}`}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                SİPARİŞİ TAMAMLA
                                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
