import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../store/actions/userActions';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, userInfo } = useSelector(state => state.user);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
        window.scrollTo(0, 0);
    }, [userInfo, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        if (password !== confirmPassword) {
            setMessage('Şifreler eşleşmiyor');
        } else {
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="min-h-screen bg-lux-bg flex items-center justify-center px-4 py-24 animate-fade-in">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-lux-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block">Ayrıcalıklı Dünya</span>
                    <h2 className="font-display text-4xl md:text-5xl text-lux-dark tracking-tight uppercase">Üye Olun</h2>
                    <div className="w-12 h-0.5 bg-lux-accent mx-auto mt-6"></div>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-lux-dark/5 p-8 md:p-12 shadow-xl shadow-black/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {(message || error) && (
                        <div className="bg-red-50 border-l-2 border-red-500 text-red-700 p-4 mb-8 text-[10px] font-bold tracking-wider uppercase flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} /></svg>
                            {message || error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-lux-muted mb-2">AD SOYAD</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-lux-bg/30 border border-lux-dark/10 px-4 py-4 text-sm focus:outline-none focus:border-lux-accent transition-all duration-300 rounded-none"
                                placeholder="Adınız ve Soyadınız"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-lux-muted mb-2">E-POSTA ADRESİ</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-lux-bg/30 border border-lux-dark/10 px-4 py-4 text-sm focus:outline-none focus:border-lux-accent transition-all duration-300 rounded-none"
                                placeholder="ornek@mail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-lux-muted mb-2">ŞİFRE</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-lux-bg/30 border border-lux-dark/10 px-4 py-4 text-sm focus:outline-none focus:border-lux-accent transition-all duration-300 rounded-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-lux-muted mb-2">ŞİFRE TEKRAR</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-lux-bg/30 border border-lux-dark/10 px-4 py-4 text-sm focus:outline-none focus:border-lux-accent transition-all duration-300 rounded-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-lux-dark text-white py-4 font-sans text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:bg-black relative overflow-hidden group ${loading ? 'opacity-70' : ''}`}
                        >
                            <span className={loading ? 'opacity-0' : 'opacity-100'}>Kaydı Tamamla</span>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-lux-dark/5">
                        <p className="text-[11px] font-bold tracking-widest text-lux-muted uppercase mb-4">Zaten üye misiniz?</p>
                        <Link to="/login" className="inline-block text-[11px] font-bold tracking-[0.2em] text-lux-accent hover:text-lux-dark transition-all duration-300 uppercase border-b border-lux-accent/30 hover:border-lux-dark pb-1">
                            Giriş Yapın
                        </Link>
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] text-lux-muted font-medium tracking-[0.2em] uppercase leading-relaxed max-w-sm mx-auto">
                    Kayıt olarak üyelik sözleşmesini ve gizlilik metnini kabul etmiş sayılırsınız.
                </p>
            </div>
        </div>
    );
};

export default Register;