import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import config from '../config'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`${config.API_BASE}/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Ürün detayı yüklenirken hata:', error)
    }
  }

  if (!product) return <div>Yükleniyor...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-blue-600 my-4">{product.price} TL</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <button 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            onClick={() => addToCart(product)}
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 