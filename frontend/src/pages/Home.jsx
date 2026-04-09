import React from 'react';
import { Link } from 'react-router-dom';
import HomeSlider from '../components/HomeSlider';
import ProductList from '../components/ProductList';
import { useSettings } from '../context/SettingsContext';

const CATEGORY_CARDS = [
  {
    label: 'Tasarım Buketler',
    slug: 'tasarim-buketler',
    image: 'https://images.unsplash.com/photo-1583327171620-ca4803739b7c?q=80&w=800&auto=format&fit=crop',
    count: 'GÜNLÜK TAZE ARANJMANLAR'
  },
  {
    label: 'Zarif Güller',
    slug: 'guller',
    image: 'https://images.unsplash.com/photo-1548683311-e1c503ffb1c5?q=80&w=800&auto=format&fit=crop',
    count: 'AŞKIN EN SAF HALİ'
  },
  {
    label: 'Lüks Orkideler',
    slug: 'orkideler',
    image: 'https://images.unsplash.com/photo-1534885412334-dfcaaa936558?q=80&w=800&auto=format&fit=crop',
    count: 'ZAMANSIZ ZERAFET'
  },
  {
    label: 'Saksı Çiçekleri',
    slug: 'saksi-cicekleri',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
    count: 'YAŞAYAN HEDİYELER'
  },
];

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Slider & Side Menu */}
      <HomeSlider />

      {/* Main Product Feed - Directly after Slider */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-lux-dark">Tüm Ürünler</h2>
              <p className="text-gray-400 text-[11px] font-bold tracking-widest uppercase mt-1">GÜNLÜK TAZE ARANJMANLAR</p>
            </div>
            <Link to="/kategori/tumu" className="text-lux-accent text-xs font-bold tracking-widest uppercase hover:underline">
              TÜMÜNÜ GÖR
            </Link>
          </div>
          <ProductList infinite={true} />
        </div>
      </section>
    </div>
  );
};

export default Home;

