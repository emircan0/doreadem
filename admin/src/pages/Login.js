import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(credentials);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-sidebar)',
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--color-white)',
        borderRadius: 12,
        padding: '40px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,.3)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Dore Adem
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              className="form-input"
              placeholder="admin@example.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 8, width: '100%', height: 42, justifyContent: 'center', fontSize: 14 }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Giriş yapılıyor...</>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> Giriş Yap</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;