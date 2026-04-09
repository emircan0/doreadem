import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ArchiveBoxIcon,
  PhotoIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import config from '../config';

const API = config.API_BASE;

const STATUS_LABELS = {
  active: { label: 'Aktif', cls: 'badge-delivered' },
  inactive: { label: 'Pasif', cls: 'badge-cancelled' },
  draft: { label: 'Taslak', cls: 'badge-pending' },
  archived: { label: 'Arşiv', cls: 'badge-gray' },
};

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const toast = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API}/api/products`),
        axios.get(`${API}/api/categories`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (e) {
      toast({ type: 'error', message: 'Ürünler yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast({ type: 'success', message: 'Ürün başarıyla silindi.' });
    } catch (e) {
      toast({ type: 'error', message: 'Ürün silinirken hata oluştu.' });
    }
    setConfirmId(null);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all([...selected].map(id => axios.delete(`${API}/api/products/${id}`)));
      setProducts(prev => prev.filter(p => !selected.has(p._id)));
      setSelected(new Set());
      toast({ type: 'success', message: `${selected.size} ürün başarıyla silindi.` });
    } catch (e) {
      toast({ type: 'error', message: 'Toplu silme sırasında hata oluştu.' });
    }
    setBulkConfirm(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p._id)));
    }
  };

  const filtered = products.filter(p => {
    const catName = p.category?.name || p.category || '';
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      catName.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand?.name || p.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchCat = categoryFilter === 'all' || (p.category?._id || p.category) === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const stockCritical = products.filter(p => p.stock <= 5 && p.stock >= 0).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <ConfirmModal
        isOpen={!!confirmId}
        title="Ürünü Sil"
        message="Bu ürün kalıcı olarak silinecek. Bu işlem geri alınamaz."
        onConfirm={() => handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
        confirmText="Evet, Sil"
      />
      <ConfirmModal
        isOpen={bulkConfirm}
        title={`${selected.size} Ürünü Sil`}
        message="Seçili tüm ürünler kalıcı olarak silinecek. Bu işlem geri alınamaz."
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkConfirm(false)}
        confirmText="Evet, Hepsini Sil"
      />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-2xl">Ürün Yönetimi</h1>
          <p className="page-sub">{products.length} ürün • {stockCritical > 0 && <span className="text-red-500 font-medium">{stockCritical} kritik stok</span>}</p>
        </div>
        <Link to="/products/add" className="btn btn-primary shadow-lg shadow-indigo-200">
          <PlusIcon className="w-5 h-5" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="form-input pl-10"
            placeholder="Ürün, SKU, marka veya kategori ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select className="form-select py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="draft">Taslak</option>
            <option value="archived">Arşiv</option>
          </select>
          <select className="form-select py-2 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">Tüm Kategoriler</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <button onClick={load} className="btn btn-ghost py-2" title="Yenile">
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 px-4 py-3 rounded-xl text-sm">
          <span className="font-semibold text-indigo-700">{selected.size} ürün seçildi</span>
          <button onClick={() => setBulkConfirm(true)} className="btn btn-danger btn-sm">
            <TrashIcon className="w-4 h-4" /> Seçilenleri Sil
          </button>
          <button onClick={() => setSelected(new Set())} className="btn btn-ghost btn-sm">İptal</button>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="loading-wrap">
            <div className="flex flex-col items-center gap-2">
              <div className="spinner"></div>
              <span className="text-xs font-medium text-gray-400">Ürünler Yükleniyor...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state py-20">
            <ArchiveBoxIcon className="w-16 h-16 mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-400">Ürün bulunamadı.</p>
            <p className="text-sm text-gray-300">Filtrelerinizi veya arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input 
                      type="checkbox" 
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="w-[380px]">Ürün Bilgisi</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th className="text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const img = p.images?.[0]
                    ? (p.images[0].startsWith('http') ? p.images[0] : `${API}${p.images[0]}`)
                    : null;
                  const catName = p.category?.name || p.category || 'Belirtilmemiş';
                  const brandName = p.brand?.name || p.brand || '';
                  const statusInfo = STATUS_LABELS[p.status] || { label: p.status, cls: 'badge-gray' };
                  const discountedPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : null;
                  
                  return (
                    <tr key={p._id} className={`group transition-colors ${selected.has(p._id) ? 'bg-indigo-50/50' : ''}`}>
                      <td>
                        <input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} className="w-4 h-4 cursor-pointer" />
                      </td>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                            {img ? (
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <PhotoIcon className="w-6 h-6 text-gray-200" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-gray-800 truncate flex items-center gap-1.5">
                              {p.name}
                              {p.featured && <StarSolid className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                            </div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-indigo-500 uppercase tracking-wide">{p.sku || 'SKU YOK'}</span>
                              {brandName && <span>• {brandName}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs">
                          {catName}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">₺{(+p.price||0).toLocaleString('tr-TR')}</span>
                          {discountedPrice && (
                            <span className="text-[11px] text-emerald-600 font-medium">
                              -%{p.discount} = ₺{discountedPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm ${p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-orange-500' : 'text-emerald-600'}`}>
                            {p.stock} Adet
                          </span>
                          {p.stock <= 0 && <span className="text-[10px] text-red-500 font-medium">Tükendi</span>}
                          {p.stock > 0 && p.stock <= 5 && <span className="text-[10px] text-orange-500 font-medium">Kritik Stok</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex gap-1">
                          <Link 
                            to={`/products/edit/${p._id}`} 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Düzenle"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() => setConfirmId(p._id)}
                            title="Sil"
                          >
                            <TrashIcon className="w-5 h-5" />
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
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6b7280' }}>
            <span>{filtered.length} / {products.length} ürün gösteriliyor</span>
            {statusFilter !== 'all' || categoryFilter !== 'all' || search ? (
              <button onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }} className="text-indigo-500 hover:text-indigo-700 font-medium">
                Filtreleri Temizle
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
