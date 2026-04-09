import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../store/actions/userActions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
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
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen bg-lux-bg flex items-center justify-center px-4 py-20 animate-fade-in">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-lux-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block animate-fade-in">Hoş Geldiniz</span>
                    <h2 className="font-display text-4xl md:text-5xl text-lux-dark tracking-tight uppercase animate-fade-in-up">Giriş Yap</h2>
                    <div className="w-12 h-0.5 bg-lux-accent mx-auto mt-6 animate-scale-x"></div>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-lux-dark/5 p-8 md:p-12 shadow-xl shadow-black/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {error && (
                        <div className="bg-red-50 border-l-2 border-red-500 text-red-700 p-4 mb-8 text-xs font-semibold tracking-wider uppercase flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} /></svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
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

                        <div className="relative">
                             <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-lux-muted">ŞİFRE</label>
                                <Link to="/forgot-password" size="sm" className="text-[9px] font-bold tracking-widest text-lux-accent hover:text-lux-dark transition-colors uppercase">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-lux-bg/30 border border-lux-dark/10 px-4 py-4 text-sm focus:outline-none focus:border-lux-accent transition-all duration-300 rounded-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-lux-muted hover:text-lux-dark transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.049m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeWidth={1.5} /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={1.5} /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={1.5} /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-lux-dark text-white py-4 font-sans text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:bg-black relative overflow-hidden group ${loading ? 'opacity-70' : ''}`}
                        >
                            <span className={loading ? 'opacity-0' : 'opacity-100'}>Giriş Yap</span>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-lux-dark/5">
                        <p className="text-[11px] font-bold tracking-widest text-lux-muted uppercase mb-4">Henüz hesabınız yok mu?</p>
                        <Link to="/register" className="inline-block text-[11px] font-bold tracking-[0.2em] text-lux-accent hover:text-lux-dark transition-all duration-300 uppercase border-b border-lux-accent/30 hover:border-lux-dark pb-1">
                            Hemen Kayıt Olun
                        </Link>
                    </div>
                </div>
                
                {/* Brand Note */}
                <p className="mt-12 text-center text-[10px] text-lux-muted font-medium tracking-[0.2em] uppercase leading-relaxed max-w-sm mx-auto">
                    Kişisel verileriniz, gizlilik politikamız doğrultusunda en üst düzey güvenlik standartları ile korunmaktadır.
                </p>
            </div>
        </div>
    );
};

export default Login;