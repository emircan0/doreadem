import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Account from './pages/Account';
import Campaigns from './pages/Campaigns';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { SettingsProvider } from './context/SettingsContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ForgotPassword from './components/auth/ForgotPassword';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import { NotificationProvider } from './context/NotificationContext';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import Organizations from './pages/Organizations';
import OrganizationDetail from './pages/OrganizationDetail';
import { ToastContainer } from 'react-toastify';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <SettingsProvider>
        <NotificationProvider>
          <Router>
            <CartProvider>
              <div className="flex flex-col min-h-screen overflow-x-hidden">
                  <ToastContainer 
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  toastClassName="bg-lux-dark text-white font-sans text-xs tracking-widest uppercase border border-white/10"
                  progressClassName="bg-lux-accent"
                />
                <Navbar />
                <CartDrawer />
                <main className="flex-grow pt-[115px] md:pt-[145px] min-h-screen bg-lux-bg transition-all duration-500">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/hesabim/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/sepet" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/siparislerim" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/adreslerim" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/kategori/:categorySlug" element={<CategoryPage />} />
                    <Route path="/kampanyalar" element={<Campaigns />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/siparis-takip" element={<OrderTracking />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/odeme" element={<Checkout />} />
                    <Route path="/hakkimizda" element={<About />} />
                    <Route path="/iletisim" element={<Contact />} />
                    <Route path="/organizasyonlar" element={<Organizations />} />
                    <Route path="/organizasyon/:slug" element={<OrganizationDetail />} />
                  </Routes>
                </main>
                <FloatingWhatsApp />
                <Footer />
              </div>
            </CartProvider>
          </Router>
        </NotificationProvider>
      </SettingsProvider>
    </Provider>
  );
};

export default App;
