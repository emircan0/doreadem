import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

import { fetchCategories } from '../api';
import config from '../config';

const HomeSlider = () => {
  const { settings } = useSettings();
  const slides = settings?.heroSlides?.length > 0 ? settings.heroSlides : [];
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sideCategories, setSideCategories] = useState([]);

  useEffect(() => {
    const getSideCats = async () => {
      try {
        const { data } = await fetchCategories();
        const filtered = data.filter(cat => cat.location === 'sidebar' || cat.location === 'both');
        setSideCategories(filtered);
      } catch (err) {
        console.error("Side categories fetch error:", err);
      }
    };
    getSideCats();
  }, []);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 800);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const API_BASE = config.API_BASE;

  return (
    <div className="relative w-full bg-lux-bg pt-[110px] md:pt-[140px] pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation - Hizli Cicek Style */}
          <div className="hidden lg:flex flex-col w-[260px] bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden self-stretch">
            <div className="bg-lux-dark text-white p-6">
              <h3 className="font-serif text-lg font-medium">Kategoriler</h3>
            </div>
            <nav className="flex-1 py-4">
              {sideCategories.map((cat, idx) => (
                <Link
                  key={cat.slug}
                  to={`/kategori/${cat.slug}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-lux-bg hover:text-lux-accent transition-all duration-300 border-b border-gray-50 last:border-0 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-[13px] font-medium tracking-wide">{cat.name}</span>
                  </div>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>
            <div className="p-6 bg-lux-bg/30">
              <p className="text-[10px] text-lux-muted font-bold tracking-widest uppercase mb-1">HIZLI TESLİMAT</p>
              <p className="text-[11px] text-gray-500">İstanbul'un her yerine 90 dakikada teslimat.</p>
            </div>
          </div>

          {/* Slider Container */}
          <div className="flex-1">
            <div className="relative h-[450px] md:h-[520px] lg:h-[600px] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden group shadow-xl bg-white">
              {/* Slides as Links */}
              {slides.map((s, i) => {
                const fullUrl = s.imageUrl?.startsWith('http') ? s.imageUrl : `${API_BASE}${s.imageUrl?.startsWith('/') ? '' : '/'}${s.imageUrl}`;
                return (
                  <Link
                    key={s._id || i}
                    to={s.ctaLink || '/kategori/tumu'}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out block ${i === current ? 'opacity-100 z-10 scale-100 cursor-pointer' : 'opacity-0 z-0 scale-105 pointer-events-none'}`}
                  >
                    <img
                      src={fullUrl}
                      alt={s.title}
                      className={`w-full h-full object-cover object-center ${i === current ? 'animate-ken-burns' : ''}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </Link>
                );
              })}

              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center hover:bg-white hover:text-lux-dark"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center hover:bg-white hover:text-lux-dark"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Progress Bar & Indicators */}
              <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goTo(i);
                    }}
                    className={`transition-all duration-500 rounded-full h-1.5 ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;

