import { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '../api/index';
import ProductCard from './ProductCard';
import axios from 'axios';
import config from '../config';

function ProductList({ category, sortBy, featuredOnly = false, infinite = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Fetch with server-side filtering and sorting
        const url = `${config.API_URL}/products?${category ? `category=${category}` : ''}&${sortBy ? `sort=${sortBy}` : ''}`;
        const { data } = await axios.get(url);
        
        let filteredData = data;
        if (featuredOnly) {
          filteredData = data.filter(p => p.featured);
        }
        
        setProducts(filteredData);
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [category, sortBy, featuredOnly]);

  const visibleProducts = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 aspect-square mb-4 rounded-xl" />
            <div className="bg-gray-100 h-3 w-1/2 mb-2 rounded" />
            <div className="bg-gray-100 h-3 w-3/4 mb-2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-lux-accent text-[10px] font-bold tracking-widest uppercase hover:underline"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {visibleProducts.map((product, idx) => (
          <div 
            key={product._id} 
            className="animate-reveal" 
            style={{ animationDelay: `${(idx % 4) * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {infinite && visibleCount < products.length && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            className="group relative px-12 py-4 border border-gray-100 text-[10px] font-bold tracking-widest uppercase hover:border-lux-accent transition-all duration-500 rounded-full"
          >
            <span className="text-lux-dark group-hover:text-lux-accent">DAHA FAZLA ÜRÜN</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
