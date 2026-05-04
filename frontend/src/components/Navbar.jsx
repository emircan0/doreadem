import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/userActions';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { fetchCategories } from '../api';

const Navbar = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);
    const { cartItemCount, setIsCartOpen } = useCart();
    const { settings } = useSettings();
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show if scrolling up OR at the top
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsVisible(true);
            } 
            // Hide if scrolling down AND past a certain threshold
            else if (currentScrollY > lastScrollY && currentScrollY > 150) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const getCats = async () => {
            try {
                const { data } = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error("Kategoriler yüklenemedi:", error);
            }
        };
        getCats();
    }, []);

    // Filter categories by location and sort by order
    const getNavbarCategories = () => {
        return categories
            .filter(cat => cat.location === 'navbar' || cat.location === 'both')
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const navbarCategories = getNavbarCategories();

    const handleLogout = () => dispatch(logout());

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const siteName = settings?.siteName || 'Dore Adem';

    return (
        <header className={`fixed w-full top-0 z-[100] bg-white border-b border-gray-100 flex flex-col transition-transform duration-500 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* TIER 1: Utility Bar (Top) */}
            <div className="hidden md:block w-full border-b border-gray-50 bg-gray-50/30">
                <div className="container mx-auto px-6 lg:px-12 flex justify-end items-center h-9 text-[11px] text-gray-500 font-medium">
                    <div className="flex gap-6">
                        <Link to="/magaza-ac" className="hover:text-lux-accent transition-colors flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Mağaza Açmak İstiyorum
                        </Link>
                        <a href="tel:08501234567" className="hover:text-lux-accent transition-colors">0850 123 45 67</a>
                        <Link to="/siparis-takip" className="hover:text-lux-accent transition-colors">Sipariş Takibi</Link>
                        <Link to="/iletisim" className="hover:text-lux-accent transition-colors">İletişim</Link>
                    </div>
                </div>
            </div>

            {/* TIER 2: Main Brand Bar (Logo, Search, Actions) */}
            <div className="w-full py-4 md:py-6 bg-white">
                <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between gap-8 md:gap-12">
                    
                    {/* Left: Search (Desktop Only) */}
                    <div className="hidden md:flex flex-col flex-1 max-w-sm">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Dore Adem'de ara..."
                                className="w-full min-h-[46px] border border-gray-100 rounded-lg pl-5 pr-12 text-sm focus:outline-none focus:border-lux-accent bg-gray-50/50 transition-all group-hover:bg-white group-hover:shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-lux-accent transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>
                    </div>

                    {/* Left: Mobile Toggle & Search */}
                    <div className="flex md:hidden items-center gap-1">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-lux-dark hover:text-lux-accent transition-colors"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <Link to="/" className="flex flex-col items-center group">
                            <span 
                                className="text-xl md:text-3xl lg:text-4xl font-serif text-lux-dark tracking-tighter uppercase font-bold group-hover:text-lux-accent transition-colors"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {siteName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="h-[1px] w-4 md:w-8 bg-lux-accent opacity-30"></div>
                                <span className="text-[8px] md:text-[10px] font-bold text-lux-accent tracking-[0.2em] uppercase">Premium Çiçek Butiği</span>
                                <div className="h-[1px] w-4 md:w-8 bg-lux-accent opacity-30"></div>
                            </div>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-0.5 md:gap-8 flex-1 justify-end">
                        {/* Mobile Search Button */}
                        <Link to="/search" className="md:hidden p-2.5 text-lux-dark hover:text-lux-accent transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </Link>

                        <Link to="/favoriler" className="flex flex-col items-center group">
                            <div className="p-2 md:p-2.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                <svg className="w-6 h-6 text-lux-dark group-hover:text-lux-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <span className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 mt-0.5 group-hover:text-lux-accent transition-colors uppercase">Favoriler</span>
                        </Link>

                        {userInfo ? (
                            <div className="flex items-center gap-4">
                                <Link to="/hesabim" className="flex flex-col items-center group">
                                    <div className="p-2 md:p-2.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                        <svg className="w-6 h-6 text-lux-dark group-hover:text-lux-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <span className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 mt-0.5 group-hover:text-lux-accent transition-colors uppercase">Profil</span>
                                </Link>
                                <button onClick={handleLogout} className="flex flex-col items-center group">
                                    <div className="p-2 md:p-2.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                        <svg className="w-6 h-6 text-lux-dark group-hover:text-lux-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    </div>
                                    <span className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 mt-0.5 group-hover:text-lux-accent transition-colors uppercase">Çıkış</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex flex-col items-center group">
                                <div className="p-2 md:p-2.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                    <svg className="w-6 h-6 text-lux-dark group-hover:text-lux-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                                </div>
                                <span className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 mt-0.5 group-hover:text-lux-accent transition-colors uppercase">Giriş</span>
                            </Link>
                        )}

                        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center group cursor-pointer">
                            <div className="relative p-2 md:p-2.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                <svg className="w-6 h-6 text-lux-dark group-hover:text-lux-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <span className="absolute top-1 right-1 w-4 h-4 bg-lux-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cartItemCount}
                                </span>
                            </div>
                            <span className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 mt-0.5 group-hover:text-lux-accent transition-colors uppercase">Sepetim</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* TIER 3: Nested Category Bar (Desktop & Mobile Scrollable) */}
            <div className="w-full bg-white border-t border-gray-100 overflow-x-auto scrollbar-hide">
                <div className="container mx-auto flex items-center min-w-max px-2 md:px-6 lg:px-12 md:justify-center">
                    <Link 
                        to="/tumu" 
                        className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.2em] text-lux-accent hover:bg-lux-bg transition-all uppercase whitespace-nowrap bg-lux-bg/50"
                    >
                        HIZLI TESLİMAT
                    </Link>
                    <Link 
                        to="/organizasyonlar" 
                        className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.2em] text-lux-dark hover:text-lux-accent transition-all duration-300 uppercase whitespace-nowrap flex items-center gap-1.5 md:gap-2 group border-l border-gray-100"
                    >
                        <span className="text-xs md:text-sm group-hover:scale-110 transition-transform">🎭</span>
                        ORGANİZASYONLAR
                    </Link>
                    
                    {navbarCategories.map((cat) => (
                        <Link
                            key={cat._id}
                            to={`/kategori/${cat.slug}`}
                            className="px-4 md:px-5 py-3 md:py-4 text-[10px] md:text-[11px] font-bold tracking-[0.05em] md:tracking-[0.1em] text-gray-700 hover:text-lux-accent transition-all duration-300 uppercase whitespace-nowrap flex items-center gap-1.5 md:gap-2 group"
                        >
                            <span className="text-xs md:text-sm group-hover:scale-110 transition-transform">{cat.icon || '🌹'}</span>
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-[150] transition-all duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <span className="font-serif text-2xl font-bold text-lux-dark">{siteName}</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-lux-dark">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex flex-col h-[calc(100%-80px)]">
                    <div className="flex-1 overflow-y-auto py-8 px-8">
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-bold text-lux-accent tracking-widest uppercase mb-6">Koleksiyonlar</p>
                                <ul className="flex flex-col gap-5">
                                    <li>
                                        <Link to="/tumu" className="text-lg font-black text-lux-accent flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                            <span>✨</span> HIZLI TESLİMAT
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/organizasyonlar" className="text-lg font-black text-lux-dark flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                            <span>🎭</span> ORGANİZASYONLARIMIZ
                                        </Link>
                                    </li>
                                    {navbarCategories.map((cat) => (
                                        <li key={cat._id} className="border-b border-gray-50 pb-4">
                                            <Link 
                                                to={`/kategori/${cat.slug}`}
                                                className="text-lg font-bold text-gray-900 flex items-center gap-3" 
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span className="text-xl">{cat.icon || '🌹'}</span>
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Mobile Support */}
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">Destek Hattı</p>
                                <a 
                                    href="https://wa.me/905000000000" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-green-50 text-green-600 p-4 rounded-2xl font-bold text-sm"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                WhatsApp ile Sipariş Ver
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 border-t border-gray-100 grid grid-cols-2 gap-6 bg-gray-50/50">
                        <Link to="/hesabim" className="text-xs font-bold text-gray-500 uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Profil</Link>
                        {userInfo && (
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-xs font-bold text-red-500 uppercase tracking-widest">Çıkış</button>
                        )}
                        <Link to="/favoriler" className="text-xs font-bold text-gray-500 uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Favoriler</Link>
                        <Link to="/siparis-takip" className="text-xs font-bold text-gray-500 uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Sipariş</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
