import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Products from './Products';
import Orders from './Orders';
import Invoices from './Invoices';
import Statistics from './Statistics';
import ProductForm from './ProductForm';
import Users from './Users';
import Settings from './Settings';
import UserForm from './UserForm';
import CategoriesAndBrandsForm from './CategoriesAndBrandsForm';
import ShippingManagement from './ShippingManagement';
import PaymentManagement from './PaymentManagement';
import Organizations from './Organizations';
import OrganizationForm from './OrganizationForm';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';

const PAGE_TITLES = {
  '/':                       'Dashboard',
  '/products':               'Ürünler',
  '/products/add':           'Yeni Ürün Ekle',
  '/categories-and-brands':  'Kategori & Marka',
  '/orders':                 'Siparişler',
  '/invoices':               'Faturalar',
  '/shipping':               'Kargo Yönetimi',
  '/payment':                'Ödeme Yönetimi',
  '/organizations':          'Organizasyon Yönetimi',
  '/organizations/add':      'Yeni Organizasyon',
  '/users':                  'Kullanıcılar',
  '/settings':               'Ayarlar',
};

function Dashboard() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Login />;

  const title = Object.entries(PAGE_TITLES).find(([path]) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  })?.[1] ?? 'Admin Panel';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          background: 'var(--color-white)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 40px',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <span style={{ 
            fontWeight: 800, 
            fontSize: 12, 
            color: 'var(--color-text)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em' 
          }}>{title}</span>
          <div style={{ 
            fontSize: 10, 
            fontWeight: 700,
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              background: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
            }}></div>
            Sistem Aktif
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '40px' }}>
          <Routes>
            <Route path="/"                     element={<Statistics />} />
            <Route path="/products"             element={<Products />} />
            <Route path="/products/add"         element={<ProductForm />} />
            <Route path="/products/edit/:id"    element={<ProductForm />} />
            <Route path="/categories-and-brands" element={<CategoriesAndBrandsForm />} />
            <Route path="/orders"               element={<Orders />} />
            <Route path="/invoices"             element={<Invoices />} />
            <Route path="/shipping"             element={<ShippingManagement />} />
            <Route path="/payment"              element={<PaymentManagement />} />
            <Route path="/organizations"        element={<Organizations />} />
            <Route path="/organizations/add"    element={<OrganizationForm />} />
            <Route path="/organizations/edit/:id" element={<OrganizationForm />} />
            <Route path="/users"                element={<Users />} />
            <Route path="/users/add"            element={<UserForm />} />
            <Route path="/users/edit/:id"       element={<UserForm />} />
            <Route path="/settings"             element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;