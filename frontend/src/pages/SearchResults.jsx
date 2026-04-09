import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api/index';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Search data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (query) {
      const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  return (
    <div className="bg-lux-bg min-h-screen pb-24">
      {/* Search Header */}
      <div className="bg-white border-b border-lux-dark/5 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 lg:px-12 text-center animate-fade-in">
          <span className="text-lux-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block">Arama Sonuçları</span>
          <h1 className="font-display text-4xl md:text-6xl text-lux-dark mb-6 tracking-tight uppercase">
            "{query}"
          </h1>
          <p className="text-lux-muted text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
            {filteredProducts.length} Ürün Bulundu
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-12 py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-t-2 border-lux-accent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 animate-fade-in-up">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 max-w-lg mx-auto animate-fade-in-up">
            <div className="mb-8 opacity-10 flex justify-center">
               <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={1} /></svg>
            </div>
            <h2 className="font-display text-2xl text-lux-dark mb-4 uppercase tracking-wider">Sonuç Bulunamadı</h2>
            <p className="text-lux-muted text-sm font-light leading-relaxed mb-10">
              Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı anahtar kelimeler ile tekrar deneyiniz.
            </p>
            <Link to="/" className="btn-primary">Koleksiyona Dön</Link>
          </div>
        )}
      </div>

      {/* Recommended for Empty */}
      {filteredProducts.length === 0 && !loading && (
        <div className="container mx-auto px-4 lg:px-12 py-16 border-t border-lux-dark/5">
           <h3 className="font-display text-xl text-lux-dark mb-12 text-center uppercase tracking-[0.2em]">Sizin İçin Seçtiklerimiz</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;