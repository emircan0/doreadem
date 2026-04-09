import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

function Favorites() {
  const { addToCart } = useCart()
  const [favorites] = useState([
    {
      id: 1,
      name: "Elegance Deri El Çantası",
      price: 4299.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      description: "El yapımı deri detaylar",
      category: "El Çantaları"
    },
    // Diğer favori ürünler...
  ])

  if (favorites.length === 0) {
    return (
      <div className="bg-cream-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <i className="far fa-heart text-6xl text-brown-300 mb-6"></i>
            <h2 className="font-serif text-3xl text-brown-800 mb-4">Favori Ürününüz Bulunmuyor</h2>
            <p className="text-brown-600 mb-8">Beğendiğiniz ürünleri favorilere ekleyerek takip edebilirsiniz.</p>
            <Link 
              to="/" 
              className="inline-block bg-brown-800 text-cream-50 px-8 py-3 rounded-lg hover:bg-brown-700 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl text-brown-800 mb-8">Favorilerim</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(product => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-cream-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-brown-800 text-cream-50 px-4 py-2 rounded-lg hover:bg-brown-700 transition-colors"
                      >
                        Sepete Ekle
                      </button>
                      <Link 
                        to={`/product/${product.id}`}
                        className="text-brown-800 hover:text-brown-600"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-serif text-xl text-brown-800">{product.name}</h3>
                <p className="text-brown-600 text-sm mt-1">{product.description}</p>
                <p className="text-brown-900 font-semibold mt-2">{product.price.toLocaleString('tr-TR')} ₺</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Favorites 