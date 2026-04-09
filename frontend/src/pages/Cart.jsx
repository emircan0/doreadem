import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';

const API_BASE = config.API_BASE;

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  
  const threshold = settings?.freeShippingThreshold || 2000;
  const progress = Math.min((cartTotal / threshold) * 100, 100);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-lux-bg min-h-screen flex items-center justify-center pt-20 animate-fade-in">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <div className="mb-12 opacity-10 flex justify-center scale-150">
             <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-lux-dark mb-8 tracking-tight uppercase">Sepetiniz Boş</h2>
          <p className="font-sans text-lux-muted mb-16 font-light leading-relaxed text-base md:text-lg">
            Koleksiyonumuzdaki seçkin parçaları keşfederek stilinize yeni bir soluk getirebilirsiniz.
          </p>
          <Link 
            to="/" 
            className="btn-primary"
          >
            ALIŞVERİŞE BAŞLA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lux-bg min-h-screen pb-32">
      <div className="container mx-auto px-6 lg:px-12 pt-16 md:pt-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-6 border-b border-lux-border pb-10">
          <h1 className="font-display text-4xl md:text-5xl text-lux-dark tracking-tight uppercase">Alışveriş Sepeti</h1>
          <p className="text-lux-muted text-[10px] font-bold tracking-mega-wide uppercase">
            TOPLAM {cart.reduce((acc, item) => acc + item.quantity, 0)} ÜRÜN
          </p>
        </div>

        {/* Progress Bar (Free Shipping) - Refined Design */}
        <div className="max-w-3xl mx-auto mb-20 animate-fade-in p-8 bg-white/40 backdrop-blur-md border border-lux-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-[10px] font-bold tracking-mega-wide uppercase">
            <span className={cartTotal >= threshold ? 'text-lux-accent' : 'text-lux-dark'}>
              {cartTotal >= threshold ? 'TEBRİKLER! ÜCRETSİZ KARGO KAZANDINIZ' : `ÜCRETSİZ KARGO İÇİN ₺${(threshold - cartTotal).toLocaleString('tr-TR')} KALDI`}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-lux-muted opacity-50">EYLÜL AYI ÖZEL</span>
              <span className="text-lux-dark">₺{cartTotal.toLocaleString('tr-TR')} / ₺{threshold.toLocaleString('tr-TR')}</span>
            </div>
          </div>
          <div className="h-1.5 bg-lux-dark/10 overflow-hidden relative">
            <div 
              className="h-full bg-lux-accent transition-all duration-[2000ms] ease-out relative z-10"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Main Content - Cart Items List */}
          <div className="flex-1 w-full">
            <div className="divide-y divide-lux-border border-t border-lux-border">
              {cart.map((item, idx) => {
                const img = item.images?.[0]?.startsWith('http') ? item.images[0] : `${API_BASE}${item.images?.[0] || ''}`;
                return (
                  <div key={item.id || item._id} className="py-10 flex flex-col md:flex-row gap-10 animate-fade-in-up group" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {/* Item Image */}
                    <Link to={`/product/${item._id || item.id}`} className="w-full md:w-40 aspect-[3/4] bg-lux-bg overflow-hidden shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-700">
                      <img src={img} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </Link>

                    {/* Item Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <p className="text-lux-accent text-[9px] font-bold tracking-mega-wide uppercase opacity-70">
                            {item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'KOLEKSİYON')}
                          </p>
                          <Link to={`/product/${item._id || item.id}`}>
                            <h3 className="font-display text-2xl text-lux-dark hover:text-lux-accent transition-colors duration-500 tracking-wide uppercase">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[10px] text-lux-muted uppercase tracking-widest font-light">REF: {item.sku || 'SC-2026-X'}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="w-10 h-10 flex items-center justify-center border border-lux-border rounded-full hover:bg-lux-dark hover:text-white hover:border-lux-dark transition-all duration-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={1} /></svg>
                        </button>
                      </div>

                      <div className="mt-auto flex flex-col md:flex-row justify-between items-end md:items-center gap-8 pt-8">
                        {/* Quantity Controls - Premium Style */}
                        <div className="flex items-center border border-lux-border h-12 bg-white/50 backdrop-blur-sm self-start group/qty">
                          <button 
                            className="w-10 h-full flex items-center justify-center text-lux-muted hover:text-lux-dark transition-colors" 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth={1} /></svg>
                          </button>
                          <span className="w-10 text-center text-xs font-semibold font-sans">{item.quantity}</span>
                          <button 
                            className="w-10 h-full flex items-center justify-center text-lux-muted hover:text-lux-dark transition-colors" 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={1} /></svg>
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-lux-muted uppercase tracking-mega-wide mb-1 opacity-50">TOPLAM</p>
                          <p className="font-sans text-xl font-medium text-lux-dark tracking-tighter">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Summary - Premium Panel */}
          <div className="w-full lg:w-[440px] shrink-0 lg:sticky lg:top-40 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white border border-lux-border p-10 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-lux-accent" />
              <h2 className="font-display text-2xl text-lux-dark mb-10 uppercase tracking-mega-wide border-b border-lux-border pb-6">SİPARİŞ ÖZETİ</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex justify-between text-[11px] font-bold tracking-mega-wide uppercase text-lux-muted">
                  <span>ARA TOPLAM</span>
                  <span className="text-lux-dark">₺{cartTotal.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold tracking-mega-wide uppercase text-lux-muted">
                  <span>TESLİMAT</span>
                  <span className={`${cartTotal >= threshold ? 'text-lux-accent' : 'text-lux-dark'}`}>
                    {cartTotal >= threshold ? 'ÜCRETSİZ' : 'HESAPLANACAK'}
                  </span>
                </div>
                <div className="pt-8 border-t border-lux-border flex justify-between items-baseline">
                  <span className="text-[11px] font-bold tracking-mega-wide uppercase text-lux-dark">GENEL TOPLAM</span>
                  <span className="text-4xl font-sans font-medium text-lux-dark tracking-tighter">₺{cartTotal.toLocaleString('tr-TR')}</span>
                </div>
                <p className="text-[10px] text-lux-muted italic font-light leading-relaxed">
                  * Kargo ve vergi hesaplamaları bir sonraki aşamada adres bilgilerinize göre kesinleşecektir.
                </p>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => navigate('/odeme')}
                  className="w-full btn-primary"
                >
                  ÖDEMEYE GEÇ
                </button>
                <Link to="/" className="block text-center py-4 text-[10px] font-bold tracking-mega-wide uppercase text-lux-muted hover:text-lux-dark transition-all duration-500 border-b border-transparent hover:border-lux-dark max-w-max mx-auto">
                  ALIŞVERİŞE DEVAM ET
                </Link>
              </div>

              {/* Secure Checkout Trust Icons */}
              <div className="mt-16 pt-10 border-t border-lux-border grid grid-cols-1 gap-6">
                 <div className="flex items-center gap-5 text-lux-dark group">
                    <div className="w-10 h-10 rounded-full bg-lux-bg flex items-center justify-center text-lux-accent group-hover:bg-lux-accent group-hover:text-white transition-all duration-700">
                      <i className="fas fa-lock text-xs"></i>
                    </div>
                    <span className="text-[10px] font-bold tracking-mega-wide uppercase">GÜVENLİ VE ŞİFRELİ ÖDEME</span>
                 </div>
                 <div className="flex items-center gap-5 text-lux-dark group">
                    <div className="w-10 h-10 rounded-full bg-lux-bg flex items-center justify-center text-lux-accent group-hover:bg-lux-accent group-hover:text-white transition-all duration-700">
                      <i className="fas fa-certificate text-xs"></i>
                    </div>
                    <span className="text-[10px] font-bold tracking-mega-wide uppercase">ORİJİNALLİK GARANTİSİ</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-10 p-8 border border-lux-accent/10 bg-lux-accent/5 text-center">
              <p className="text-[10px] text-lux-accent font-bold tracking-mega-wide uppercase mb-3">PROFESYONEL ZERAFET</p>
              <p className="text-[11px] text-lux-muted leading-relaxed font-light italic">
                Siparişiniz usta eller tarafından özenle paketlenip, size ulaşana dek tam sigorta kapsamımız altındadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
