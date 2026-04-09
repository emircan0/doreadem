import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import config from '../config';

const API = config.API_BASE;

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    axios.get(`${API}/api/users/profile/${id}`)
      .then(res => {
        const { password, ...data } = res.data;
        setUser(prev => ({ ...prev, ...data }));
      })
      .catch(() => toast({ type: 'error', message: 'Kullanıcı bilgileri alınamadı.' }))
      .finally(() => setFetching(false));
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email) {
      toast({ type: 'warning', message: 'Ad ve e-posta zorunludur.' });
      return;
    }
    if (!id && !user.password) {
      toast({ type: 'warning', message: 'Yeni kullanıcı için şifre zorunludur.' });
      return;
    }
    setLoading(true);
    try {
      if (id) {
        const payload = { name: user.name, email: user.email, phone: user.phone, role: user.role };
        if (user.password) payload.password = user.password;
        await axios.put(`${API}/api/users/profile/${id}`, payload);
        toast({ type: 'success', title: 'Güncellendi', message: `${user.name} başarıyla güncellendi.` });
      } else {
        await axios.post(`${API}/api/users/register`, {
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          role: user.role,
        });
        toast({ type: 'success', title: 'Oluşturuldu', message: `${user.name} başarıyla eklendi.` });
      }
      navigate('/users');
    } catch (error) {
      const msg = error.response?.data?.message || 'Bir hata oluştu.';
      toast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-wrap"><div className="spinner"></div></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/users')} className="text-sm text-gray-400 hover:text-indigo-600 mb-1 flex items-center gap-1">
            ← Kullanıcılara Dön
          </button>
          <h1 className="page-title">{id ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Kullanıcı Bilgileri
        </div>
        <div className="card-body">
          {/* ... existing form content ... */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label">Ad Soyad *</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={e => setUser({ ...user, name: e.target.value })}
                  className="form-input"
                  placeholder="Ahmet Yılmaz"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-posta *</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={e => setUser({ ...user, email: e.target.value })}
                  className="form-input"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={e => setUser({ ...user, phone: e.target.value })}
                  className="form-input"
                  placeholder="+90 555 000 00 00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  value={user.role || 'user'}
                  onChange={e => setUser({ ...user, role: e.target.value })}
                  className="form-select"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="editor">Editör</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{id ? 'Yeni Şifre (değiştirmek için doldurun)' : 'Şifre *'}</label>
              <input
                type="password"
                value={user.password || ''}
                onChange={e => setUser({ ...user, password: e.target.value })}
                className="form-input"
                placeholder={id ? 'Boş bırakırsanız değişmez' : 'Minimum 6 karakter'}
                required={!id}
                minLength={id ? undefined : 6}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
              <button type="button" onClick={() => navigate('/users')} className="btn btn-ghost">
                İptal
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: 130 }}>
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Kaydediliyor...
                  </>
                ) : (
                  id ? '✓ Güncelle' : '✓ Kaydet'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {id && user.previousStates?.length > 0 && (
        <div className="card mt-8 animate-fadeIn">
          <div className="card-header flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Değişiklik Geçmişi
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Cinsiyet</th>
                </tr>
              </thead>
              <tbody>
                {user.previousStates.slice().reverse().map((state, idx) => (
                  <tr key={idx}>
                    <td className="text-xs font-bold text-gray-500">
                      {new Date(state.updatedAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="text-[13px]">{state.name}</td>
                    <td className="text-[13px] text-gray-500">{state.email}</td>
                    <td className="text-[13px] text-gray-500">{state.phone || '—'}</td>
                    <td className="text-[13px] uppercase text-gray-400 font-bold">{state.gender || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserForm;
