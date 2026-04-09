import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { fetchCategories } from '../api';

function CategoryPage() {
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const getCats = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
        const current = data.find(c => c.slug === categorySlug);
        setCurrentCategory(current);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };
    getCats();
  }, [categorySlug]);

  return (
    <div className="bg-lux-bg min-h-screen pt-10">
      
      {/* Category Header */}
      <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden bg-white border-b border-gray-100">
        <div className="relative z-10 text-center px-4">
          <span className="text-lux-accent text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">Koleksiyon</span>
          <h1 className="font-serif text-4xl md:text-6xl text-lux-dark mb-4 uppercase tracking-tighter font-bold">
            {currentCategory?.name || (categorySlug === 'tumu' ? 'Tüm Ürünler' : 'Yükleniyor...')}
          </h1>
          <div className="w-12 h-0.5 bg-lux-accent/30 mx-auto"></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-20 z-40 transition-all duration-300">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
            
            <nav className="flex gap-6 overflow-x-auto w-full md:w-auto scrollbar-hide py-2">
              <Link 
                to="/kategori/tumu" 
                className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap pb-2 border-b-2 ${
                  categorySlug === 'tumu' || !categorySlug
                    ? 'text-lux-accent border-lux-accent' 
                    : 'text-gray-400 border-transparent hover:text-lux-dark'
                }`}
              >
                Tümü
              </Link>
              {categories.slice(0, 8).map(cat => (
                <Link 
                  key={cat.slug}
                  to={`/kategori/${cat.slug}`} 
                  className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap pb-2 border-b-2 ${
                    categorySlug === cat.slug
                      ? 'text-lux-accent border-lux-accent' 
                      : 'text-gray-400 border-transparent hover:text-lux-dark'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <span className="text-[9px] font-black tracking-widest text-gray-400 uppercase">Sırala</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold tracking-widest uppercase text-lux-dark focus:ring-0 cursor-pointer"
              >
                <option value="newest">En Yeniler</option>
                <option value="price_asc">Fiyat: Artan</option>
                <option value="price_desc">Fiyat: Azalan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-20">
        <ProductList category={categorySlug} sortBy={sortBy} />
      </div>
    </div>
  );
}

export default CategoryPage;