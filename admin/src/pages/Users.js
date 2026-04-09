import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import Drawer from '../components/Drawer';
import config from '../config';

const API = config.API_BASE;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/api/users/profile`);
      const data = Array.isArray(r.data) ? r.data : [r.data];
      setUsers(data);
    } catch (e) { 
      toast({ type: 'error', message: 'Kullanıcılar yüklenirken hata oluştu.' });
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast({ type: 'success', message: 'Kullanıcı başarıyla silindi.' });
    } catch (e) {
      toast({ type: 'error', message: 'Kullanıcı silinirken hata oluştu.' });
    }
    setConfirmId(null);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API}/api/users/profile/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast({ type: 'success', message: 'Kullanıcı rolü güncellendi.' });
    } catch (e) {
      toast({ type: 'error', message: 'Rol değiştirilirken hata oluştu.' });
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search);
    const matchRole = roleFilter === 'all' || (u.role || 'user') === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => !u.role || u.role === 'user').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ConfirmModal
        isOpen={!!confirmId}
        title="Kullanıcıyı Sil"
        message="Bu kullanıcı kalıcı olarak silinecek. Bu işlem geri alınamaz."
        onConfirm={() => handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
        confirmText="Evet, Sil"
      />

      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Kullanıcı Detayları"
        width={500}
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* User Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%',
                background: selectedUser.role === 'admin' ? '#4f46e5' : '#e2e8f0',
                color: selectedUser.role === 'admin' ? '#fff' : '#475569',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, flexShrink: 0
              }}>
                {(selectedUser.name?.[0] || selectedUser.email?.[0] || '?').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{selectedUser.name || 'Ad Belirtilmemiş'}</div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>{selectedUser.email}</div>
                <div style={{ 
                  display: 'inline-block', marginTop: 8, padding: '4px 10px', 
                  borderRadius: 12, background: '#f1f5f9', fontSize: 11, 
                  fontWeight: 700, color: '#475569', textTransform: 'uppercase'
                }}>
                  {selectedUser.role || 'Kullanıcı'}
                </div>
              </div>
            </div>

            {/* Quick Stats/Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Telefon</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{selectedUser.phone || '—'}</div>
              </div>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Doğum Tarihi</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                  {selectedUser.birthDate ? new Date(selectedUser.birthDate).toLocaleDateString('tr-TR') : '—'}
                </div>
              </div>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Cinsiyet</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                  {selectedUser.gender === 'male' ? 'Erkek' : selectedUser.gender === 'female' ? 'Kadın' : selectedUser.gender === 'other' ? 'Diğer' : 'Belirtilmemiş'}
                </div>
              </div>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Kayıt</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</div>
              </div>
            </div>

            {/* Addresses Section */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                 🏠 Kayıtlı Adresler
                 {selectedUser.addresses?.length > 0 && <span style={{ padding: '2px 6px', background: '#eff6ff', color: '#3b82f6', borderRadius: 8, fontSize: 10 }}>{selectedUser.addresses.length}</span>}
              </div>
              {!selectedUser.addresses?.length ? (
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                  Adres kaydı bulunamadı.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedUser.addresses.map((addr, idx) => (
                    <div key={idx} style={{ padding: 12, border: '1px solid #f1f5f9', borderRadius: 10, background: addr.isDefault ? '#eff6ff' : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#1e293b' }}>{addr.title || 'Adres'}</span>
                        {addr.isDefault && <span style={{ fontSize: 9, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>Varsayılan</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                        {addr.fullName}<br/>
                        {addr.fullAddress}<br/>
                        {addr.district} / {addr.city}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Change History (Timeline) */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
                 🕒 Değişiklik Geçmişi
              </div>
              {!selectedUser.previousStates?.length ? (
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                  Henüz bir değişiklik kaydı yok.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 12, borderLeft: '2px solid #f1f5f9' }}>
                  {selectedUser.previousStates.map((state, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingBottom: 24, paddingLeft: 20 }}>
                      <div style={{ 
                        position: 'absolute', left: -7, top: 0, width: 12, height: 12, 
                        borderRadius: '50%', background: '#fff', border: '2px solid #3b82f6' 
                      }}></div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                        {new Date(state.updatedAt).toLocaleString('tr-TR')}
                      </div>
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, fontSize: 12, color: '#475569' }}>
                         {state.name && <div style={{ marginBottom: 4 }}>• İsim: <span style={{ fontWeight: 600 }}>{state.name}</span></div>}
                         {state.email && <div style={{ marginBottom: 4 }}>• E-posta: <span style={{ fontWeight: 600 }}>{state.email}</span></div>}
                         {state.phone && <div style={{ marginBottom: 4 }}>• Telefon: <span style={{ fontWeight: 600 }}>{state.phone}</span></div>}
                         {state.gender && <div>• Cinsiyet: <span style={{ fontWeight: 600 }}>{state.gender}</span></div>}
                      </div>
                    </div>
                  ))}
                  {/* Current State Indicator */}
                  <div style={{ position: 'relative', paddingLeft: 20 }}>
                    <div style={{ 
                      position: 'absolute', left: -7, top: 0, width: 12, height: 12, 
                      borderRadius: '50%', background: '#10b981', border: '2px solid #fff' 
                    }}></div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Güncel Bilgiler</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <div className="page-header">
        <div>
          <div className="page-title">Kullanıcı Yönetimi</div>
          <div className="page-sub">
            {users.length} kayıtlı kullanıcı • {adminCount} admin • {userCount} müşteri
          </div>
        </div>
        <Link to="/users/add" className="btn btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kullanıcı
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="form-input"
            style={{ paddingLeft: 38 }}
            placeholder="İsim, e-posta veya telefon ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="form-select" 
          style={{ width: 180 }}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="all">Tüm Roller</option>
          <option value="admin">Admin</option>
          <option value="editor">Editör</option>
          <option value="user">Kullanıcı</option>
        </select>
        <button onClick={load} className="btn btn-ghost">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Yenile
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-wrap"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p>Kullanıcı bulunamadı.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Rol</th>
                  <th>Kayıt Tarihi</th>
                  <th style={{ textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const initials = (u.name?.[0] || u.email?.[0] || '?').toUpperCase();
                  const role = u.role || 'user';
                  const roleColors = {
                    admin: { bg: '#eef2ff', color: '#4f46e5', label: 'Admin' },
                    editor: { bg: '#fff7ed', color: '#ea580c', label: 'Editör' },
                    user: { bg: '#f3f4f6', color: '#374151', label: 'Kullanıcı' },
                  };
                  const rc = roleColors[role] || roleColors.user;

                  return (
                    <tr key={u._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedUser(u)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: role === 'admin' ? '#4f46e5' : '#e5e7eb',
                            color: role === 'admin' ? '#fff' : '#374151',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 13, flexShrink: 0,
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name || '—'}</div>
                            {u.gender && <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{u.gender === 'male' ? 'Erkek' : u.gender === 'female' ? 'Kadın' : 'Diğer'}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-muted)', fontSize: 13 }}>{u.email}</td>
                      <td style={{ color: 'var(--color-muted)', fontSize: 13 }}>{u.phone || '—'}</td>
                      <td>
                        <select
                          value={role}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          style={{
                            background: rc.bg, color: rc.color,
                            border: 'none', padding: '4px 8px', borderRadius: 20,
                            fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            outline: 'none', textTransform: 'uppercase'
                          }}
                        >
                          <option value="user">Kullanıcı</option>
                          <option value="editor">Editör</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ color: 'var(--color-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button 
                             className="btn btn-ghost btn-sm"
                             onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                          >
                             Detay
                          </button>
                          <Link 
                            to={`/users/edit/${u._id}`} className="btn btn-ghost btn-sm"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </Link>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={(e) => { e.stopPropagation(); setConfirmId(u._id); }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', fontSize: 12, color: '#9ca3af' }}>
            {filtered.length} / {users.length} kullanıcı gösteriliyor
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
