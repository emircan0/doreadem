import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

const Organizations = () => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await axios.get(`${API}/api/organizations`);
                setOrgs(res.data);
            } catch (error) {
                console.error('Organizasyonlar yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrgs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-lux-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
            {/* Header Section */}
            <div className="text-center mb-16 space-y-4">
                <span className="text-xs font-black text-lux-accent tracking-[0.3em] uppercase block">Portfolyo</span>
                <h1 className="text-4xl md:text-6xl font-serif text-lux-dark lowercase tracking-tighter">
                    Organizasyon<span className="text-lux-accent">larımız</span>
                </h1>
                <p className="max-w-xl mx-auto text-gray-400 text-sm leading-relaxed">
                    Hayallerinizi gerçeğe dönüştürdüğümüz anlar. Her detayı özenle tasarlanmış, 
                    unutulmaz etkinliklerimizden bir seçki.
                </p>
            </div>

            {/* Grid Section */}
            {orgs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orgs.map((org) => (
                        <Link 
                            key={org._id} 
                            to={`/organizasyon/${org.slug}`}
                            className="group relative h-[450px] overflow-hidden rounded-2xl bg-lux-dark border border-white/5"
                        >
                            {/* Background Image */}
                            <img 
                                src={org.mainImage.startsWith('http') ? org.mainImage : `${API}${org.mainImage}`} 
                                alt={org.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex items-center gap-4 text-white/60 text-[10px] uppercase tracking-widest mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {org.date ? new Date(org.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) : 'Tarih Belirtilmedi'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPinIcon className="w-3.5 h-3.5" />
                                        {org.location || 'Konum Belirtilmedi'}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-4 leading-tight">{org.title}</h3>
                                <div className="flex items-center gap-2 text-lux-accent text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Detayları İncele <ArrowRightIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-gray-400 font-serif italic text-xl">Yakın zamanda yapılan organizasyonlarımız burada sergilenecek.</p>
                </div>
            )}
        </div>
    );
};

export default Organizations;
