import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { settings } = useSettings();
    const social = settings?.socialMedia || {};
    const siteName = settings?.siteName || 'Dore Adem';
    const contactEmail = settings?.contactEmail;
    const contactPhone = settings?.contactPhone;
    const address = settings?.address;
    const footerText = settings?.footerText;

    return (
        <footer className="bg-lux-dark text-white pt-20 pb-10 border-t border-white/5 mt-auto">
            <div className="container mx-auto px-4 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="md:col-span-1">
                    <Link to="/" className="font-display text-3xl tracking-[0.2em] text-white mb-6 inline-block hover:opacity-70 transition-opacity uppercase">
                        {siteName}
                    </Link>
                    <p className="text-lux-muted text-sm leading-relaxed mb-8 font-sans">
                        {footerText || 'Özenle seçilmiş en taze çiçekler, usta tasarımcılarımızın elinde sanata dönüşüyor. Sevdiklerinizi mutlu etmenin en zarif yolu.'}
                    </p>
                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {social.instagram && (
                            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center text-lux-muted hover:text-white hover:border-lux-accent hover:bg-lux-accent transition-all duration-300 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                        )}
                        {social.facebook && (
                            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center text-lux-muted hover:text-white hover:border-lux-accent hover:bg-lux-accent transition-all duration-300 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                        )}
                        {social.pinterest && (
                            <a href={social.pinterest} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center text-lux-muted hover:text-white hover:border-lux-accent hover:bg-lux-accent transition-all duration-300 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                            </a>
                        )}
                        {social.tiktok && (
                            <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/20 flex items-center justify-center text-lux-muted hover:text-white hover:border-lux-accent hover:bg-lux-accent transition-all duration-300 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Collections */}
                <div>
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase mb-6 text-pink-100">Kategoriler</h3>
                    <ul className="space-y-4 text-sm text-lux-muted font-sans flex flex-col">
                        {[
                            { to: '/kategori/tasarim-buketler', label: 'Tasarım Buketler' },
                            { to: '/kategori/guller', label: 'Zarif Güller' },
                            { to: '/kategori/orkideler', label: 'Lüks Orkideler' },
                            { to: '/kategori/saksi-cicekleri', label: 'Saksı Çiçekleri' },
                            { to: '/kampanyalar', label: 'Haftanın Fırsatları', accent: true },
                        ].map(({ to, label, accent }) => (
                            <Link key={to} to={to} className={`hover:text-white transition-colors w-fit ${accent ? 'text-lux-accent font-bold' : ''}`}>{label}</Link>
                        ))}
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase mb-6 text-pink-100">Müşteri Hizmetleri</h3>
                    <ul className="space-y-4 text-sm text-lux-muted font-sans flex flex-col">
                        {[
                            { to: '/siparis-takip', label: 'Sipariş Takibi' },
                            { to: '/', label: 'Teslimat Hakkında' },
                            { to: '/', label: 'Çiçek Bakım Rehberi' },
                            { to: '/iletisim', label: 'Bize Ulaşın' },
                        ].map(({ to, label }) => (
                            <Link key={label} to={to} className="hover:text-white transition-colors w-fit">{label}</Link>
                        ))}
                    </ul>
                    {/* Contact Info */}
                    {(contactEmail || contactPhone || address) && (
                        <div className="mt-8 space-y-2 text-xs text-lux-muted">
                            {contactEmail && <p><a href={`mailto:${contactEmail}`} className="hover:text-white hover:text-lux-accent transition-colors">{contactEmail}</a></p>}
                            {contactPhone && <p><a href={`tel:${contactPhone}`} className="hover:text-white hover:text-lux-accent transition-colors">{contactPhone}</a></p>}
                            {address && <p className="leading-relaxed">{address}</p>}
                        </div>
                    )}
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase mb-6 text-pink-100">Aşkı Kutlayın</h3>
                    <p className="text-sm text-lux-muted mb-6 font-sans leading-relaxed">
                        Yeni koleksiyonlar, taze mevsim çiçekleri ve özel kampanyalar için e-posta listemize katılın.
                    </p>
                    <form className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="bg-white/5 border border-white/10 px-5 py-4 rounded-xl text-sm text-white placeholder-lux-muted focus:outline-none focus:border-lux-accent focus:bg-white/10 transition-all"
                        />
                        <button
                            type="submit"
                            className="bg-lux-accent text-white rounded-xl px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-pink-700 transition-colors"
                        >
                            Abone Ol
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar with Trust Seals */}
            <div className="container mx-auto px-4 lg:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-lux-muted font-sans gap-6 uppercase tracking-widest">
                <p>© {new Date().getFullYear()} {siteName}. TÜM HAKLARI SAKLIDIR.</p>
                <div className="flex gap-4 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-300 mix-blend-screen">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-5 object-contain" />
                    <img src="https://cdn.iyzico.com/iyzico_logo_white.svg" alt="Iyzico" className="h-5 object-contain invert" />
                    <svg className="h-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                </div>
                <div className="flex gap-6">
                    <Link to="/" className="hover:text-white transition-colors">Gizlilik</Link>
                    <Link to="/" className="hover:text-white transition-colors">Şartlar</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
