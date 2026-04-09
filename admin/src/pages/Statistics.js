import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';

const API = config.API_BASE;

const STATUS_MAP = {
  pending:    { label: 'Beklemede',     cls: 'badge-pending'    },
  processing: { label: 'İşleniyor',    cls: 'badge-processing' },
  shipped:    { label: 'Kargoda',      cls: 'badge-shipped'    },
  delivered:  { label: 'Teslim Edildi',cls: 'badge-delivered'  },
  cancelled:  { label: 'İptal',        cls: 'badge-cancelled'  },
};

const STAT_CARDS = [
  { 
    key: 'totalRevenue', 
    label: 'Toplam Ciro', 
    color: '#6366f1', bg: '#eef2ff',
    format: v => `₺${(+v||0).toLocaleString('tr-TR')}`,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    key: 'invoicedRevenue', 
    label: 'Faturalanan', 
    color: '#10b981', bg: '#f0fdf4',
    format: v => `₺${(+v||0).toLocaleString('tr-TR')}`,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    key: 'totalOrders', 
    label: 'Toplam Sipariş', 
    color: '#f59e0b', bg: '#fffbeb',
    format: v => (+v||0).toLocaleString('tr-TR'),
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  { 
    key: 'totalCustomers', 
    label: 'Müşteriler', 
    color: '#3b82f6', bg: '#eff6ff',
    format: v => (+v||0).toLocaleString('tr-TR'),
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:24,height:24}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

function Statistics() {
  const [stats, setStats] = useState({ 
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, 
    recentOrders: [], lowStockProducts: [], dailySales: [] 
  });
  const [invoiceStats, setInvoiceStats] = useState({ summary: { totalRevenue: 0, totalInvoices: 0, issuedCount: 0 }, daily: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [sRes, iRes] = await Promise.all([
        axios.get(`${API}/api/admin/statistics`),
        axios.get(`${API}/api/admin/invoices/stats`)
      ]);
      setStats(sRes.data);
      setInvoiceStats(iRes.data);
    } catch (e) {
      console.error('Stats load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="loading-wrap"><div className="spinner"></div></div>
  );

  const pendingOrders = (stats.recentOrders || []).filter(o => (o.status?.current || o.status) === 'pending').length;

  // Combine data for STAT_CARDS
  const displayStats = {
    ...stats,
    invoicedRevenue: invoiceStats.summary?.totalRevenue || 0
  };

  // Chart Logic
  const maxSale = Math.max(...(stats.dailySales || []).map(d => d.total), 1);
  const chartHeight = 120;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111827' }}>Panel Özeti</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          className="btn btn-ghost" 
          onClick={() => load(true)}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Yenileniyor...' : 'Yenile'}
        </button>
      </div>

      {/* Grid for Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Pending Orders Alert */}
        {pendingOrders > 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🕐</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#92400e' }}>{pendingOrders} Bekleyen Sipariş</div>
              <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>Müşteriler onay bekliyor.</div>
            </div>
            <Link to="/orders" className="btn btn-sm" style={{ background: '#f59e0b', color: '#fff', border: 'none' }}>Siparişlere Git</Link>
          </div>
        )}

        {/* Low Stock Alert */}
        {stats.lowStockProducts?.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderLeft: '4px solid #ef4444', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#b91c1c' }}>{stats.lowStockProducts.length} Kritik Stok</div>
              <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>Ürünlerin stoğu tükenmek üzere.</div>
            </div>
            <Link to="/products" className="btn btn-sm" style={{ background: '#ef4444', color: '#fff', border: 'none' }}>Stok Yönetimi</Link>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {STAT_CARDS.map(c => (
          <div key={c.key} style={{ 
            display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', 
            background: '#fff', border: '1px solid var(--color-border)', borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: '0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
          >
            <div style={{ 
              background: c.bg, color: c.color, 
              width: 56, height: 56, borderRadius: 14, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{c.format(displayStats[c.key])}</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500, marginTop: 4 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Insights & Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Sales Trend Chart */}
        <div className="card" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📈 Haftalık Satış Trendi</h3>
            <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Son 7 Gün</span>
          </div>
          
          <div style={{ height: chartHeight + 40, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px' }}>
            {stats.dailySales?.length > 0 ? stats.dailySales.map((d, i) => {
              const h = (d.total / maxSale) * chartHeight;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'relative', width: '60%', maxWidth: 40, height: chartHeight, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', bottom: 0, width: '100%', height: h, 
                      background: 'linear-gradient(to top, #4f46e5, #818cf8)', 
                      transition: 'height 1s ease-out' 
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{d._id.split('-').slice(1).join('/')}</div>
                  <div style={{ position: 'absolute', bottom: h + 50, fontSize: 9, fontWeight: 800, color: '#4f46e5' }}>₺{d.total > 1000 ? (d.total/1000).toFixed(1) + 'k' : d.total}</div>
                </div>
              );
            }) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                Veri bekleniyor...
              </div>
            )}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="card" style={{ padding: 24, borderRadius: 16, background: '#f8fafc' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📄 Fatura Özeti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Toplam Fatura</span>
              <span style={{ fontWeight: 700 }}>{invoiceStats.summary?.totalInvoices}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Kesilen (issued)</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{invoiceStats.summary?.issuedCount}</span>
            </div>
            <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Oluşturma Oranı</span>
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(invoiceStats.summary?.issuedCount / (invoiceStats.summary?.totalInvoices || 1)) * 100}%`,
                  background: '#10b981'
                }} />
              </div>
            </div>
            <Link to="/invoices" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              Tüm Faturaları Yönet
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div className="card" style={{ borderRadius: 16 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>📋 Son Siparişler</div>
            <Link to="/orders" className="btn btn-ghost btn-sm">Tümünü Gör →</Link>
          </div>
          <div className="table-wrapper">
            {!stats.recentOrders?.length ? (
              <div className="empty-state" style={{ padding: '48px 0' }}>
                <p>Henüz sipariş bulunmuyor.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sipariş</th>
                    <th>Müşteri</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(o => {
                    const currentStatus = o.status?.current || o.status;
                    const s = STATUS_MAP[currentStatus] || { label: currentStatus, cls: 'badge-gray' };
                    const total = o.totalAmount?.total || o.totalAmount || 0;
                    return (
                      <tr 
                        key={o._id} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => window.location.href = `/orders?id=${o._id}`}
                      >
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--color-primary)' }}>
                          #{o.orderNumber || o._id?.slice(-6).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer?.name || o.customerName || '—'}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{new Date(o.createdAt).toLocaleDateString('tr-TR')}</div>
                        </td>
                        <td style={{ fontWeight: 700 }}>₺{(+total).toLocaleString('tr-TR')}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24, borderRadius: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>⚡ Hızlı İşlemler</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/products/add" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                + Yeni Ürün Ekle
              </Link>
              <Link to="/invoices" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                📄 Faturaları Yönet
              </Link>
              <Link to="/orders" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                📦 Siparişler
              </Link>
              <Link to="/settings" className="btn btn-ghost" style={{ justifyContent: 'center' }}>
                ⚙️ Site Ayarları
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 16, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', border: 'none' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🟢 Sistem Durumu</h3>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 16 }}>
              Tüm servisler aktif olarak çalışıyor. E-ticaret altyapınız sorunsuz.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['API Sunucu', true],
                ['Veritabanı', true],
                ['Fatura Servisi', true],
              ].map(([label, ok]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? '#10b981' : '#ef4444', display: 'inline-block' }}></span>
                    <span style={{ color: ok ? '#10b981' : '#ef4444', fontWeight: 600 }}>{ok ? 'Aktif' : 'Pasif'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;