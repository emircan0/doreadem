import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [deliveryDetails, setDeliveryDetails] = useState(() => {
    const savedDelivery = localStorage.getItem('deliveryDetails');
    return savedDelivery ? JSON.parse(savedDelivery) : { date: null, timeSlot: null };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
  }, [deliveryDetails]);

  // Sepete ürün ekleme
  const addToCart = (product, qty = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => (item._id || item.id) === (product._id || product.id));
      
      if (existingItem) {
        return currentCart.map(item =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + (qty || 1) }
            : item
        )
      }
      
      return [...currentCart, { ...product, quantity: qty || 1 }]
    })
  };

  const updateDeliveryDetails = (details) => {
    setDeliveryDetails(prev => ({ ...prev, ...details }));
  };

  // Sepetten ürün çıkarma
  const removeFromCart = (productId) => {
    setCart(currentCart => 
      currentCart.filter(item => (item._id || item.id) !== productId)
    )
  }

  // Ürün miktarını güncelleme
  const updateQuantity = (productId, newQuantity) => {
    setCart(currentCart => {
      if (newQuantity === 0) {
        return currentCart.filter(item => (item._id || item.id) !== productId)
      }

      return currentCart.map(item =>
        (item._id || item.id) === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  }

  // Sepeti temizleme
  const clearCart = () => {
    setCart([])
    setDeliveryDetails({ date: null, timeSlot: null })
  }

  // Sepetteki toplam ürün sayısı
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Sepet toplamı
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    deliveryDetails,
    updateDeliveryDetails
  }


  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook for using cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}