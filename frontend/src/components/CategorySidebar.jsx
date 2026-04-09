import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchBrands } from '../api/index'; // API fonksiyonlarını doğru import et

function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    // Kategorileri API'den al
    fetchCategories()
      .then(response => setCategories(response.data)) // API'den gelen veriyi set et
      .catch(error => console.error('Error fetching categories:', error));

    // Markaları API'den al
    fetchBrands()
      .then(response => setBrands(response.data)) // API'den gelen veriyi set et
      .catch(error => console.error('Error fetching brands:', error));
  }, []);

  return (
    <div className="w-64 pr-8">
      <div className="bg-cream-50 p-6 rounded-lg shadow-sm border border-cream-200">
        <h2 className="font-serif text-xl text-brown-800 mb-4">Kategoriler</h2>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.name} className="group">
              <Link 
                to={`/kategori/${category.name.toLowerCase().replace(' ', '-')}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-cream-100 transition-colors"
              >
                <span className="text-brown-700 group-hover:text-brown-900">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h2 className="font-serif text-xl text-brown-800 mb-4">Fiyat Aralığı</h2>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-brown-600 text-sm">
              <span>{priceRange[0].toLocaleString('tr-TR')} ₺</span>
              <span>{priceRange[1].toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
  <h2 className="font-serif text-xl text-brown-800 mb-4">Markalar</h2>
  <div className="space-y-2">
    {brands.map(brand => (
      brand && brand.name ? (
        <label key={brand._id} className="flex items-center space-x-2 group cursor-pointer">
          <input type="checkbox" className="form-checkbox text-brown-800 rounded border-cream-300" />
          <span className="text-brown-700 group-hover:text-brown-900">{brand.name}</span>
        </label>
      ) : null // Boş marka verisi yoksa render edilmesin
    ))}
  </div>
</div>


      

      


        <div className="mt-8">
          <h2 className="font-serif text-xl text-brown-800 mb-4">Koleksiyonlar</h2>
          <div className="space-y-4">
            <div className="relative h-32 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d" 
                alt="Sonbahar Koleksiyonu"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-cream-50 font-serif text-lg">Sonbahar Koleksiyonu</span>
              </div>
            </div>
            <div className="relative h-32 rounded-lg overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3" 
                alt="Özel Koleksiyon"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-cream-50 font-serif text-lg">Özel Koleksiyon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;
