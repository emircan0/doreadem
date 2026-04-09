import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';
import config from '../config';

const API = config.API_BASE;

const STATUS_MAP = {
  pending:    { label: 'Beklemede',      cls: 'badge-pending',    icon: '🕐' },
  processing: { label: 'İşleniyor',     cls: 'badge-processing', icon: '⚙️' },
  shipped:    { label: 'Kargoda',       cls: 'badge-shipped',    icon: '🚚' },
  delivered:  { label: 'Teslim Edildi', cls: 'badge-delivered',  icon: '✅' },
  cancelled:  { label: 'İptal',         cls: 'badge-cancelled',  icon: '❌' },
};

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const currentStatus = order?.status?.current || order?.status;
  const [newStatus, setNewStatus] = useState(currentStatus || 'pending');
  const [activeTab, setActiveTab] = useState('genel');
  const [invoice, setInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    customerType: 'individual',
    taxDetails: { tcNo: '', taxId: '', taxOffice: '', companyName: '' },
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (currentStatus) setNewStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    if (order && activeTab === 'fatura') {
      fetchInvoice();
    }
  }, [order, activeTab]);

  const fetchInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const r = await axios.get(`${API}/api/admin/invoices/order/${order._id}`);
      setInvoice(r.data);
    } catch (e) {
      setInvoice(null);
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleCreateInvoice = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/admin/invoices`, {
        orderId: order._id,
        ...invoiceForm,
        billingAddress: {
          fullName: order.customer?.name || order.customerName,
          address: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          district: order.shippingAddress?.district || '',
          phone: order.customer?.phone || ''
        }
      });
      toast({ type: 'success', message: 'Fatura başarıyla oluşturuldu.' });
      fetchInvoice();
    } catch (e) {
      toast({ type: 'error', message: 'Fatura oluşturulamadı: ' + (e.response?.data?.message || e.message) });
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  const handleStatusSave = async () => {
    if (newStatus === currentStatus) { onClose(); return; }
    setSaving(true);
    try {
      await onStatusChange(order._id, newStatus);
      toast({ type: 'success', message: 'Sipariş durumu güncellendi.' });
      onClose();
    } catch (e) {
      toast({ type: 'error', message: 'Durum güncellenemedi.' });
    } finally {
      setSaving(false);
    }
  };

  const shipping = order.totalAmount?.shipping || 0;
  const total = order.totalAmount?.total || order.totalAmount || 0;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)',
      padding: 16,
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', position: 'relative', borderRadius: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              Sipariş #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString('tr-TR') : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`badge ${STATUS_MAP[currentStatus]?.cls || 'badge-gray'}`}>
              {STATUS_MAP[currentStatus]?.icon} {STATUS_MAP[currentStatus]?.label || currentStatus}
            </span>
            <button onClick={onClose} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#6b7280' }}>×</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0 24px' }}>
          {[['genel', 'Sipariş Bilgisi'], ['fatura', 'Fatura Bilgisi']].map(([k, v]) => (
            <button
              key={k}
              onClick={() => setActiveTab(k)}
              style={{
                padding: '16px 20px', fontSize: 13, fontWeight: 700,
                border: 'none', background: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === k ? 'var(--color-primary)' : 'transparent'}`,
                color: activeTab === k ? 'var(--color-primary)' : 'var(--color-muted)',
                transition: '0.2s'
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'genel' ? (
            <>
              {/* Customer & Address & Florist Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 28 }}>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 10 }}>👤 Müşteri</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{order.customer?.name || order.customerName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>{order.customer?.email || order.customerEmail}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                    {order.shippingAddress?.phone || order.customer?.phone || '—'}
                  </div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 10 }}>📍 Teslimat Adresi</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                    {order.shippingAddress?.address && <div>{order.shippingAddress.address}</div>}
                    <div>{[order.shippingAddress?.district, order.shippingAddress?.city].filter(Boolean).join(', ')}</div>
                    {order.shippingAddress?.postalCode && <div>{order.shippingAddress.postalCode}</div>}
                    {!order.shippingAddress?.address && <div style={{ color: 'var(--color-muted)' }}>Adres bilgisi yok</div>}
                  </div>
                </div>
                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#be185d', marginBottom: 10 }}>🌹 Çiçekçi Detayları</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#831843' }}>
                    <div style={{ marginBottom: 4 }}><strong>Teslimat Zamanı:</strong> {order.deliveryDate || 'Belirtilmedi'}</div>
                    {order.giftOptions?.isGift && (
                      <>
                        <div style={{ marginBottom: 4 }}><strong>Kimden:</strong> {order.giftOptions.senderName || 'Gizli'}</div>
                        <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', fontSize: 12, fontStyle: 'italic', border: '1px dashed #f9a8d4', marginTop: 8 }}>
                          "{order.giftOptions.giftNote || 'Not yok'}"
                        </div>
                      </>
                    )}
                    {order.notes && (
                      <div style={{ marginTop: 8, fontSize: 12 }}><strong>Müşteri Notu:</strong> {order.notes}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 12 }}>📦 Ürünler</div>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ürün</th>
                        <th style={{ textAlign: 'center' }}>Adet</th>
                        <th style={{ textAlign: 'right' }}>Fiyat</th>
                        <th style={{ textAlign: 'right' }}>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {item.product?.images?.[0] && (
                                <img src={`${API}${item.product.images[0]}`} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                              )}
                              <span style={{ fontWeight: 500, fontSize: 13 }}>{item.name || item.product?.name || 'Ürün'}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', fontSize: 13 }}>₺{(+item.price || 0).toLocaleString('tr-TR')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>₺{((+item.price || 0) * (item.quantity || 1)).toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {shipping > 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'right', padding: '10px 16px', fontSize: 12, color: 'var(--color-muted)' }}>Kargo:</td>
                          <td style={{ textAlign: 'right', padding: '10px 16px', fontSize: 13 }}>₺{shipping.toLocaleString('tr-TR')}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 700, fontSize: 14, borderTop: '2px solid #f3f4f6' }}>Genel Toplam:</td>
                        <td style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 800, fontSize: 16, color: 'var(--color-primary)', borderTop: '2px solid #f3f4f6' }}>
                          ₺{(+total || 0).toLocaleString('tr-TR')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Change */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Durumu Güncelle:</span>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="form-select"
                    style={{ width: 200 }}
                  >
                    {Object.entries(STATUS_MAP).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost" onClick={onClose}>Kapat</button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleStatusSave}
                    disabled={saving}
                    style={{ minWidth: 120 }}
                  >
                    {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                  </button>
                </div>
              </div>

              {/* Status History Timeline */}
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: 20 }}>🕒 Sipariş Geçmişi</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 12, borderLeft: '2px solid #f1f5f9' }}>
                  {(order.status?.history?.length > 0 ? order.status.history : [{ status: order.status?.current || order.status, timestamp: order.createdAt, note: 'Sipariş oluşturuldu' }]).map((h, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingBottom: 20, paddingLeft: 20 }}>
                      <div style={{ 
                        position: 'absolute', left: -7, top: 0, width: 12, height: 12, 
                        borderRadius: '50%', background: '#fff', border: `2px solid ${STATUS_MAP[h.status]?.cls === 'badge-delivered' ? '#10b981' : '#3b82f6'}` 
                      }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase' }}>
                          {STATUS_MAP[h.status]?.label || h.status}
                        </span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(h.timestamp).toLocaleString('tr-TR')}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{h.note || 'Durum güncellendi'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Invoice Tab Content */
            <div>
              {loadingInvoice ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}><div className="spinner"></div></div>
              ) : invoice ? (
                <div style={{ padding: '24px', background: '#f0fdf4', border: '1px solid #bcf0da', borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.1em' }}>✅ FATURA OLUŞTURULDU</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#14532d', marginTop: 4 }}>{invoice.invoiceNumber}</div>
                      <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>{new Date(invoice.invoiceDate).toLocaleString('tr-TR')}</div>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => generateInvoicePDF(invoice)}
                    >
                      Faturayı Görüntüle (PDF)
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 8 }}>Fatura Tipi</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{invoice.customerType === 'individual' ? 'Bireysel' : 'Kurumsal'}</div>
                    </div>
                    {invoice.customerType === 'corporate' && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 8 }}>Şirket Unvanı</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{invoice.taxDetails?.companyName}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: 450, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 32 }}>📄</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>Fatura Oluştur</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Sipariş için henüz fatura oluşturulmamış.</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 10, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
                      <button 
                         onClick={() => setInvoiceForm({...invoiceForm, customerType: 'individual'})}
                         style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: invoiceForm.customerType === 'individual' ? '#fff' : 'transparent', boxShadow: invoiceForm.customerType === 'individual' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                        Bireysel
                      </button>
                      <button 
                         onClick={() => setInvoiceForm({...invoiceForm, customerType: 'corporate'})}
                         style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: invoiceForm.customerType === 'corporate' ? '#fff' : 'transparent', boxShadow: invoiceForm.customerType === 'corporate' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                        Kurumsal
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {invoiceForm.customerType === 'individual' ? (
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }}>TC Kimlik No</label>
                          <input 
                            className="form-input" 
                            placeholder="11111111111" 
                            value={invoiceForm.taxDetails.tcNo}
                            onChange={e => setInvoiceForm({...invoiceForm, taxDetails: {...invoiceForm.taxDetails, tcNo: e.target.value}})}
                          />
                        </div>
                      ) : (
                        <>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }}>Şirket Unvanı</label>
                            <input 
                              className="form-input" 
                              placeholder="Firma Adı Ltd. Şti." 
                              value={invoiceForm.taxDetails.companyName}
                              onChange={e => setInvoiceForm({...invoiceForm, taxDetails: {...invoiceForm.taxDetails, companyName: e.target.value}})}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }}>Vergi No</label>
                            <input 
                              className="form-input" 
                              placeholder="1234567890" 
                              value={invoiceForm.taxDetails.taxId}
                              onChange={e => setInvoiceForm({...invoiceForm, taxDetails: {...invoiceForm.taxDetails, taxId: e.target.value}})}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }}>Vergi Dairesi</label>
                            <input 
                              className="form-input" 
                              placeholder="Daire Adı" 
                              value={invoiceForm.taxDetails.taxOffice}
                              onChange={e => setInvoiceForm({...invoiceForm, taxDetails: {...invoiceForm.taxDetails, taxOffice: e.target.value}})}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <button 
                       className="btn btn-primary" 
                       style={{ width: '100%', padding: '12px', marginTop: 8 }}
                       onClick={handleCreateInvoice}
                       disabled={saving}
                    >
                      {saving ? 'Oluşturuluyor...' : 'Faturayı Kes ve Onayla'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/api/admin/orders`);
      setOrders(r.data);
    } catch (e) { 
      toast({ type: 'error', message: 'Siparişler yüklenirken hata oluştu.' });
    } finally { 
      setLoading(false); 
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  // Handle auto-opening via URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o._id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [orders]);

  const handleStatus = async (id, val) => {
    await axios.put(`${API}/api/admin/orders/${id}/status`, { status: val });
    setOrders(prev => prev.map(o => {
      if (o._id === id) {
        const updated = { ...o };
        if (updated.status && typeof updated.status === 'object') {
          updated.status = { ...updated.status, current: val };
        } else {
          updated.status = val;
        }
        return updated;
      }
      return o;
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast({ type: 'success', message: 'Sipariş silindi.' });
    } catch (e) {
      toast({ type: 'error', message: 'Sipariş silinirken hata oluştu.' });
    }
    setDeleteId(null);
  };

  const filtered = orders.filter(o => {
    const status = o.status?.current || o.status;
    const matchesFilter = filter === 'all' || status === filter;
    const customerName = o.customer?.name || o.customerName || '';
    const customerEmail = o.customer?.email || o.customerEmail || '';
    const matchesSearch = !searchTerm || 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o._id?.includes(searchTerm) || 
      (o.orderNumber || '').includes(searchTerm) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {};
  orders.forEach(o => {
    const s = o.status?.current || o.status || 'pending';
    counts[s] = (counts[s] || 0) + 1;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ConfirmModal
        isOpen={!!deleteId}
        title="Siparişi Sil"
        message="Bu sipariş kalıcı olarak silinecek. Bu işlem geri alınamaz."
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmText="Evet, Sil"
      />

      <div className="page-header">
        <div>
          <h2 className="page-title">Sipariş Yönetimi</h2>
          <p className="page-sub">Toplam {orders.length} sipariş</p>
        </div>
        <button onClick={load} className="btn btn-ghost">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Yenile
        </button>
      </div>

      {/* Status Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        {[['all', 'Tümü', orders.length, '#6366f1', '#eef2ff'], ...Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label, counts[k] || 0, undefined, undefined])].map(([k, lbl, cnt, color, bg]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: '14px 16px', borderRadius: 12, border: `2px solid ${filter === k ? (color || '#6366f1') : '#e5e7eb'}`,
              background: filter === k ? (bg || '#eef2ff') : '#fff', cursor: 'pointer',
              textAlign: 'left', transition: '0.15s',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: filter === k ? (color || '#6366f1') : '#111827' }}>{cnt}</div>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginTop: 2 }}>{lbl}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="form-input"
          placeholder="Müşteri adı, e-posta veya sipariş no..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-wrap"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>Eşleşen sipariş bulunamadı.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Ürün</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const currentStatus = o.status?.current || o.status;
                  const s = STATUS_MAP[currentStatus] || { label: currentStatus, cls: 'badge-gray', icon: '' };
                  const total = o.totalAmount?.total || o.totalAmount || 0;
                  return (
                    <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)', fontSize: 13 }}>
                          #{o.orderNumber || o._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer?.name || o.customerName || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{o.customer?.email || o.customerEmail || ''}</div>
                      </td>
                      <td style={{ color: 'var(--color-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('tr-TR') : '—'}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                        {(o.items?.length || 0)} ürün
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                        ₺{(+total || 0).toLocaleString('tr-TR')}
                      </td>
                      <td>
                        <span className={`badge ${s.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 11 }}>{s.icon}</span>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            onClick={e => { e.stopPropagation(); setSelectedOrder(o); }}
                            title="Detay"
                          >
                            Detay
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#fef2f2', color: '#ef4444', border: 'none' }}
                            onClick={e => { e.stopPropagation(); setDeleteId(o._id); }}
                            title="Sil"
                          >
                            ×
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
        {!loading && filtered.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', fontSize: 12, color: '#9ca3af' }}>
            {filtered.length} / {orders.length} sipariş gösteriliyor
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatus}
        />
      )}
    </div>
  );
}

export default Orders;