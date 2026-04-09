import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import config from '../config';

const API_BASE = config.API_BASE;

const ProductCard = ({ product }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const images = product?.images || [];
  const mainImg = images[0] ? (images[0].startsWith('http') ? images[0] : `${API_BASE}${images[0]}`) : null;
  const hoverImg = images[1] ? (images[1].startsWith('http') ? images[1] : `${API_BASE}${images[1]}`) : mainImg;

  const finalPrice = product?.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product?.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await addToCart(product, 1);
      setIsCartOpen(true);
      toast.success('Ürün sepetinize eklendi', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="group relative flex flex-col bg-transparent transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-700">
        {mainImg ? (
          <>
            <img
              src={mainImg}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1500ms] ease-out ${isHovered && hoverImg !== mainImg ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
            />
            {hoverImg && hoverImg !== mainImg && (
              <img
                src={hoverImg}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1500ms] ease-out ${isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        
        {/* Badges - Minimal Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 transition-transform duration-500 group-hover:-translate-y-1">
          {product.discount > 0 && (
            <span className="bg-red-500/90 backdrop-blur-md text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">
              -%{product.discount}
            </span>
          )}
        </div>
 
        {/* Quick Add Overlay - Sleek Glassmorphism */}
        <div className={`absolute inset-x-4 bottom-4 transition-all duration-700 ease-in-out z-20 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 text-[0px]'}`}>
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className="w-full bg-white/95 backdrop-blur-md text-lux-dark py-3.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-lux-accent hover:text-white transition-all duration-300 shadow-xl active:scale-95 disabled:bg-white/50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : (product.stock === 0 ? 'TÜKENDİ' : 'SEPETE EKLE')}
          </button>
        </div>
      </Link>
 
      {/* Product Info - Clean & Minimal */}
      <div className="pt-5 pb-2 px-1 text-left">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-serif text-base md:text-lg text-lux-dark hover:text-lux-accent transition-colors duration-300 mb-2 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3">
          {product.discount > 0 ? (
            <>
              <span className="text-gray-400 text-sm line-through decoration-red-400/30">{product.price?.toLocaleString('tr-TR')} ₺</span>
              <span className="text-lux-accent font-bold text-lg">{finalPrice?.toLocaleString('tr-TR')} ₺</span>
            </>
          ) : (
            <span className="text-lux-dark font-bold text-lg">{product.price?.toLocaleString('tr-TR')} ₺</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

