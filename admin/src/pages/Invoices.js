import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';
import config from '../config';

const API = config.API_BASE;

const STATUS_COLORS = {
  draft:     { bg: '#f1f5f9', color: '#475569', label: 'Taslak' },
  issued:    { bg: '#f0fdf4', color: '#166534', label: 'Kesildi' },
  cancelled: { bg: '#fef2f2', color: '#991b1b', label: 'İptal' },
};

function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  const s = STATUS_COLORS[invoice.status] || STATUS_COLORS.draft;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Fatura Detayı</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{invoice.invoiceNumber}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, cursor: 'pointer', width: 32, height: 32, fontSize: 18 }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Status & Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 4 }}>DURUM</div>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: s.bg, color: s.color }}>
                {s.label}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 4 }}>TARİH</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{new Date(invoice.invoiceDate).toLocaleString('tr-TR')}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Fatura Bilgileri</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{invoice.customerType === 'corporate' ? invoice.taxDetails?.companyName : invoice.billingAddress?.fullName}</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
                {invoice.customerType === 'corporate' ? (
                  <>V.N.: {invoice.taxDetails?.taxId} / V.D.: {invoice.taxDetails?.taxOffice}</>
                ) : (
                  <>TC No: {invoice.taxDetails?.tcNo}</>
                )}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Adres</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                {invoice.billingAddress?.address}<br/>
                {invoice.billingAddress?.district}, {invoice.billingAddress?.city}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="data-table" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th style={{ textAlign: 'center' }}>Adet</th>
                <th style={{ textAlign: 'right' }}>Fiyat</th>
                <th style={{ textAlign: 'right' }}>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: 12 }}>{item.name}</td>
                  <td style={{ textAlign: 'center', fontSize: 12 }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', fontSize: 12 }}>₺{item.price.toLocaleString('tr-TR')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 12 }}>₺{item.total.toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', padding: '8px 16px', fontSize: 12 }}>Ara Toplam:</td>
                <td style={{ textAlign: 'right', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>₺{invoice.totals.subtotal.toLocaleString('tr-TR')}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', padding: '8px 16px', fontSize: 12 }}>KDV (%20):</td>
                <td style={{ textAlign: 'right', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>₺{invoice.totals.taxTotal.toLocaleString('tr-TR')}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                <td colSpan="3" style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 800 }}>Genel Toplam:</td>
                <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 800, color: 'var(--color-primary)', fontSize: 16 }}>₺{invoice.totals.grandTotal.toLocaleString('tr-TR')}</td>
              </tr>
            </tfoot>
          </table>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => generateInvoicePDF(invoice)}>
              📥 PDF Olarak İndir
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const toast = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/api/admin/invoices`);
      setInvoices(r.data);
    } catch (e) {
      toast({ type: 'error', message: 'Faturalar yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                        (inv.taxDetails?.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (inv.billingAddress?.fullName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Fatura Yönetimi</div>
          <div className="page-sub">{invoices.length} toplam fatura • {invoices.filter(i => i.status === 'issued').length} kesilen</div>
        </div>
        <button onClick={load} className="btn btn-ghost">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Yenile
        </button>
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
            placeholder="Fatura no, müşteri veya şirket ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="form-select" 
          style={{ width: 180 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="draft">Taslak</option>
          <option value="issued">Kesilenler</option>
          <option value="cancelled">İptal Edilenler</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-wrap"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p>Fatura bulunamadı.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fatura No</th>
                  <th>Müşteri / Şirket</th>
                  <th>Sipariş No</th>
                  <th>Tarih</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const s = STATUS_COLORS[inv.status] || STATUS_COLORS.draft;
                  return (
                    <tr key={inv._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedInvoice(inv)}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                          {inv.invoiceNumber}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>
                          {inv.customerType === 'corporate' ? inv.taxDetails?.companyName : inv.billingAddress?.fullName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                          {inv.customerType === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>
                          #{inv.orderId?.orderNumber || inv.orderId?._id?.slice(-6).toUpperCase()}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                        {new Date(inv.invoiceDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 14 }}>
                        ₺{inv.totals?.grandTotal?.toLocaleString('tr-TR')}
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, 
                          textTransform: 'uppercase', background: s.bg, color: s.color 
                        }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            title="Görüntüle"
                            onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}
                          >
                            👁️
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            title="İndir"
                            onClick={(e) => { e.stopPropagation(); generateInvoicePDF(inv); }}
                          >
                            📥
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
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
}

export default Invoices;
