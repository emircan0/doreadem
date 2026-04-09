import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { 
    CalendarIcon, 
    MapPinIcon, 
    ChevronLeftIcon,
    PhotoIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const API = config.API_BASE;

const OrganizationDetail = () => {
    const { slug } = useParams();
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`${API}/api/organizations/${slug}`);
                setOrg(res.data);
                setActiveImage(res.data.mainImage);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Detay hatası:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-lux-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!org) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-serif mb-4">Organizasyon bulunamadı.</h2>
                <Link to="/organizasyonlar" className="text-lux-accent hover:underline">Tüm organizasyonlara dön</Link>
            </div>
        );
    }

    const imageUrl = (path) => path.startsWith('http') ? path : `${API}${path}`;

    return (
        <div className="min-h-screen bg-lux-bg pb-20 animate-fadeIn">
            {/* Navigation / Back Button */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/organizasyonlar" className="inline-flex items-center gap-2 text-gray-500 hover:text-lux-dark text-xs font-black uppercase tracking-widest transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" /> Tüm Organizasyonlar
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4">
                {/* Image Showcase */}
                <div className="space-y-6">
                    <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <img 
                            src={imageUrl(activeImage)} 
                            alt={org.title}
                            className="w-full h-full object-cover transition-all duration-700 animate-fadeIn"
                        />
                    </div>
                    {/* Gallery Thumbnails */}
                    {org.gallery && org.gallery.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            <button 
                                onClick={() => setActiveImage(org.mainImage)}
                                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === org.mainImage ? 'border-lux-accent ring-4 ring-lux-accent/10' : 'border-transparent'}`}
                            >
                                <img src={imageUrl(org.mainImage)} className="w-full h-full object-cover" alt="Main" />
                            </button>
                            {org.gallery.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-lux-accent ring-4 ring-lux-accent/10' : 'border-transparent'}`}
                                >
                                    <img src={imageUrl(img)} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-10 py-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-[1px] bg-lux-accent"></span>
                            <span className="text-xs font-black text-lux-accent tracking-[0.4em] uppercase">Etkinlik Hikayesi</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif text-lux-dark leading-[1.1] lowercase tracking-tighter">
                            {org.title}
                        </h1>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-lux-border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lux-accent shadow-lg shadow-lux-accent/5">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tarih</p>
                                <p className="text-sm font-bold text-lux-dark">
                                    {org.date ? new Date(org.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Belirtilmedi'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lux-accent shadow-lg shadow-lux-accent/5">
                                <MapPinIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Konum</p>
                                <p className="text-sm font-bold text-lux-dark">{org.location || 'Konum Belirtilmedi'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Story / Description */}
                    <div className="prose prose-lux max-w-none">
                        <div className="flex items-center gap-2 mb-4 text-lux-accent">
                            <SparklesIcon className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">Öne Çıkan Detaylar</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-lg italic font-serif">
                            {org.description}
                        </p>
                    </div>

                    {/* CTA / Contact for similar events */}
                    <div className="pt-10">
                        <Link to="/iletisim" className="inline-flex items-center justify-center bg-lux-dark text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-lux-accent transition-all duration-300 shadow-2xl shadow-lux-dark/10">
                            Benzer Bir Organizasyon İstiyorum
                        </Link>
                    </div>
                </div>
            </div>

            {/* Gallery Full Width Section */}
            {org.gallery && org.gallery.length > 0 && (
                <div className="mt-20 max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-serif text-lux-dark">Etkinlik <span className="text-lux-accent">Galerisi</span></h2>
                        <div className="flex items-center gap-2 text-gray-400">
                             <PhotoIcon className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-widest">{org.gallery.length + 1} Fotoğraf</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[org.mainImage, ...org.gallery].map((img, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-2xl group cursor-zoom-in">
                                <img 
                                    src={imageUrl(img)} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    alt={`Gallery full ${i}`} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationDetail;
