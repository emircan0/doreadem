import { useState } from 'react'
import Navbar from '../components/Navbar'

function Account() {
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <div className="bg-cream-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl text-brown-800 mb-8">Hesabım</h1>
        
        <div className="flex gap-8">
          {/* Sol Menü */}
          <div className="w-64">
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
              <button 
                className={`w-full text-left px-6 py-4 hover:bg-cream-50 transition-colors ${
                  activeTab === 'orders' ? 'bg-cream-50 text-brown-800 font-medium' : 'text-brown-600'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-box-open w-6"></i>
                Siparişlerim
              </button>
              <button 
                className={`w-full text-left px-6 py-4 hover:bg-cream-50 transition-colors ${
                  activeTab === 'profile' ? 'bg-cream-50 text-brown-800 font-medium' : 'text-brown-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user w-6"></i>
                Bilgilerim
              </button>
              <button 
                className={`w-full text-left px-6 py-4 hover:bg-cream-50 transition-colors ${
                  activeTab === 'addresses' ? 'bg-cream-50 text-brown-800 font-medium' : 'text-brown-600'
                }`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="fas fa-map-marker-alt w-6"></i>
                Adreslerim
              </button>
              <button 
                className={`w-full text-left px-6 py-4 hover:bg-cream-50 transition-colors ${
                  activeTab === 'password' ? 'bg-cream-50 text-brown-800 font-medium' : 'text-brown-600'
                }`}
                onClick={() => setActiveTab('password')}
              >
                <i className="fas fa-lock w-6"></i>
                Şifre Değiştir
              </button>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-cream-200">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-serif text-2xl text-brown-800 mb-6">Siparişlerim</h2>
                  {/* Sipariş listesi buraya gelecek */}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-serif text-2xl text-brown-800 mb-6">Bilgilerim</h2>
                  {/* Profil bilgileri formu buraya gelecek */}
                </div>
              )}
              
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-serif text-2xl text-brown-800 mb-6">Adreslerim</h2>
                  {/* Adres listesi buraya gelecek */}
                </div>
              )}
              
              {activeTab === 'password' && (
                <div>
                  <h2 className="font-serif text-2xl text-brown-800 mb-6">Şifre Değiştir</h2>
                  {/* Şifre değiştirme formu buraya gelecek */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account 