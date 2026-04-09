import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProduct } from '../api/index';
import { toast } from 'react-toastify';
import config from '../config';

const API_BASE = config.API_BASE;

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProduct(id);
        if (!data) throw new Error('Not found');

        if (data.images && data.images.length > 0) {
          data.images = data.images.map(img => img.startsWith('http') ? img : `${API_BASE}${img}`);
        } else {
          data.images = ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200'];
        }

        setProduct(data);
      } catch (error) {
        console.warn('Demo verisi yükleniyor...', error);
        setProduct({
          _id: id,
          name: 'Signature Deri Çanta',
          price: 4950,
          discount: 0,
          description: 'Sıra dışı işçilik, premium İtalyan derisi. Gündüzden geceye her anınıza zarif bir dokunuş katan bu tasarım, zamansız şıklığın en saf halini temsil ediyor.',
          brand: 'Signature Collection',
          category: 'El Çantaları',
          sku: 'SG-2026-LNX',
          dimensions: { width: 30, height: 22, depth: 12 },
          weight: 0.8,
          stock: 4,
          images: [
            'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1200',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200',
            'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200'
          ],
          upsellOptions: [
            { name: 'Kristal Vazo', price: 150, imageUrl: 'https://images.unsplash.com/photo-1542176880-974d6c4e09f5?w=500&q=80' },
            { name: 'Premium Çikolata', price: 250, imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    getProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleUpsell = (option) => {
    setSelectedUpsells(prev => 
      prev.find(item => item.name === option.name)
        ? prev.filter(item => item.name !== option.name)
        : [...prev, option]
    );
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      // Calculate total price including upsells for the cart item
      const upsellsTotal = selectedUpsells.reduce((acc, curr) => acc + curr.price, 0);
      const cartItem = { 
        ...product, 
        quantity,
        selectedUpsells,
        price: product.price + upsellsTotal // Final price with options
      };

      await addToCart(cartItem, quantity);
      toast.success('Ürün sepetinize eklendi', {
        position: "bottom-right",
        theme: "dark",
      });
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lux-bg flex justify-center items-center">
         <div className="w-10 h-10 border-t-2 border-lux-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-lux-bg min-h-screen pb-32">
      {/* Breadcrumbs - Slim & Sophisticated */}
      <div className="border-b border-lux-border bg-white/30 backdrop-blur-md sticky top-16 md:top-20 z-30 transition-all duration-500">
        <div className="container mx-auto px-6 lg:px-12 py-3.5 flex items-center text-[9px] font-bold tracking-mega-wide uppercase text-lux-muted">
          <Link to="/" className="hover:text-lux-dark transition-colors">Ana Sayfa</Link>
          <span className="mx-4 opacity-20">/</span>
          <Link to={`/kategori/${product.category?.slug || product.category?.name?.toLowerCase() || 'tumu'}`} className="hover:text-lux-dark transition-colors">
            {product.category?.name || (typeof product.category === 'string' ? product.category : 'Kategori')}
          </Link>
          <span className="mx-4 opacity-20">/</span>
          <span className="text-lux-dark truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pt-12 md:pt-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Gallery (Left) - Expanded Width for Square Layout */}
          <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-6">
            {/* Thumbnails (Side) */}
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden bg-white transition-all duration-700 border ${selectedImage === idx ? 'border-lux-accent opacity-100 shadow-sm' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image - Now Square & Wider */}
            <div className="flex-1 relative aspect-square max-h-[850px] overflow-hidden bg-white group cursor-crosshair shadow-xl rounded-sm">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-[3000ms] ease-out group-hover:scale-105"
              />
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-lux-accent text-white text-[9px] font-bold px-3 py-1.5 tracking-mega-wide uppercase shadow-lg z-10">
                  -%{product.discount} İNDİRİM
                </div>
              )}
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-4 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 aspect-square shrink-0 overflow-hidden border transition-all duration-500 rounded-sm ${selectedImage === idx ? 'border-lux-accent' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details (Right) */}
          <div className="w-full lg:w-[45%]">
            <div className="lg:sticky lg:top-48">
              <div className="mb-12">
                {product.brand && (
                  <span className="text-lux-accent text-[10px] font-bold tracking-mega-wide uppercase block mb-6 animate-fade-in">
                    {product.brand?.name || (typeof product.brand === 'string' ? product.brand : '')}
                  </span>
                )}
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-lux-dark mb-8 leading-[1.05] animate-fade-in-up tracking-tight uppercase">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <p className="text-3xl font-sans font-medium text-lux-dark tracking-tighter">
                    ₺{(product.price * (1 - (product.discount || 0) / 100)).toLocaleString('tr-TR')}
                  </p>
                  {product.discount > 0 && (
                    <p className="text-xl text-lux-muted line-through decoration-lux-accent/30 opacity-40">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
                <div className="w-20 h-px bg-lux-dark/10 mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}></div>
                <p className="text-lux-muted font-light leading-relaxed mb-12 text-base md:text-lg max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {product.description}
                </p>
              </div>

              {/* Delivery Date Picker (Mockup for now, handled in Cart) */}
              <div className="mb-8 p-5 border border-pink-100 bg-pink-50/20 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-lux-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-xs font-bold text-lux-dark tracking-widest uppercase">Hızlı Teslimat</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">İstanbul'un her noktasına taze ve özenli teslimat yapıyoruz. Teslimat saatini bir sonraki adımda seçebilirsiniz.</p>
              </div>

              {/* Upsells (Cross-sell) Section */}
              {product.upsellOptions?.length > 0 && (
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">Sürprizi Büyütün (Opsiyonel)</p>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {product.upsellOptions.map((item, i) => {
                            const isSelected = selectedUpsells.find(s => s.name === item.name);
                            return (
                                <div 
                                  key={i} 
                                  className="flex-shrink-0 w-24 group cursor-pointer"
                                  onClick={() => toggleUpsell(item)}
                                >
                                    <div className={`w-24 h-24 rounded-2xl overflow-hidden border transition-all duration-500 mb-2 relative ${isSelected ? 'border-lux-accent shadow-lg shadow-lux-accent/10 scale-105' : 'border-gray-100 group-hover:border-gray-200'}`}>
                                        <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {isSelected && (
                                          <div className="absolute inset-0 bg-lux-accent/10 flex items-center justify-center">
                                            <div className="bg-lux-accent text-white rounded-full p-1 shadow-xl">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                    <p className={`text-[10px] font-bold text-center leading-tight transition-colors ${isSelected ? 'text-lux-accent' : 'text-lux-dark'}`}>{item.name}</p>
                                    <p className="text-[9px] text-center text-lux-muted mt-0.5">+{item.price} TL</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
              )}

              {/* Purchase Section */}
              <div className="space-y-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Qty Selector - Custom & Elegant */}
                  <div className="flex items-center justify-between border border-gray-200 h-16 rounded-full bg-white self-start sm:self-auto group hover:border-gray-300 transition-all duration-300 px-2 w-full sm:w-32 shrink-0">
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" strokeWidth={2} /></svg>
                    </button>
                    <span className="font-sans text-sm font-bold text-lux-dark">{quantity}</span>
                    <button 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} /></svg>
                    </button>
                  </div>
                  
                  {/* Add to Cart - Premium Button */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="flex-1 h-16 btn-primary group"
                  >
                    <span className="relative z-20 flex items-center justify-center gap-3">
                      {addingToCart ? 'İŞLENİYOR...' : (product.stock === 0 ? 'TÜKENDİ' : 'SEPETE EKLE')}
                      {!addingToCart && product.stock > 0 && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </span>
                  </button>
                </div>

                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-[10px] font-bold text-lux-accent tracking-mega-wide uppercase text-center animate-pulse">
                     Yalnızca {product.stock} aranjman malzemesi kaldı.
                  </p>
                )}
              </div>

              {/* Service Benefits - Refined for Florist */}
              <div className="grid grid-cols-1 gap-6 py-12 border-t border-gray-100">
                {[
                  { icon: 'M5 13l4 4L19 7', text: '%100 Taze Teslimat Garantisi', outline: true },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Seçili Saatlerde Tam Zamanında', outline: true },
                  { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', text: 'Özenle Hazırlanmış Aranjman' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 text-lux-dark group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-lux-accent group-hover:bg-lux-accent group-hover:text-white transition-all duration-500">
                      <svg className="w-4 h-4" fill={item.outline ? "none" : "currentColor"} stroke={item.outline ? "currentColor" : "none"} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold tracking-mega-wide uppercase">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Details Accordions - Floral */}
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {[
                  { 
                    title: 'Ürün İçeriği', 
                    content: (
                      <p className="text-[13px] font-light text-gray-500 leading-relaxed">
                        Tasarımcılarımız tarafından özenle seçilen mevsimin en taze ithal gülleri, okaliptüs yaprakları ve mevsime uygun garnitür çiçeklerle hazırlanmıştır. Görseldeki vazo teslimata dahildir/değildir (Ürün özelliklerine göre değişir).
                      </p>
                    )
                  },
                  { 
                    title: 'Çiçek Bakım Sırları', 
                    content: (
                      <div className="text-[13px] font-light text-gray-500 leading-relaxed space-y-4">
                        <p>Çiçeklerinizin daha uzun ömürlü olması için vazonuzdaki suyu 2 günde bir değiştirin. Suyun içine yarım çay kaşığı şeker eklemek besin kaynağı sağlar.</p>
                        <p>Direkt güneş ışığından, ısıtıcı ve klimalardan uzak tutunuz. Serin ortamlar çiçeklerin canlı kalmasını uzatır.</p>
                      </div>
                    )
                  },
                  { 
                    title: 'Teslimat Hakkında', 
                    content: (
                      <div className="text-[13px] font-light text-gray-500 leading-relaxed space-y-4">
                        <p>İstanbul içi aynı gün teslimat seçeceğimiz mevcuttur. Çiçekleriniz, zarar görmeyeceği özel soğutmalı araçlarımızla ve özel taşıma çantalarında teslim edilir.</p>
                        <p>Alıcı adreste bulunamazsa, siparişiniz güvenliğe veya komşuya (alıcının onayıyla) bırakılabilir.</p>
                      </div>
                    )
                  }
                ].map((item, idx) => (
                  <details key={idx} className="group py-8" open={idx === 0}>
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-[10px] font-bold tracking-mega-wide uppercase text-lux-dark">{item.title}</span>
                      <span className="text-gray-300 transition-transform duration-500 group-open:rotate-180 group-open:text-lux-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    </summary>
                    <div className="pt-6 animate-fade-in">
                      {item.content}
                    </div>
                  </details>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
