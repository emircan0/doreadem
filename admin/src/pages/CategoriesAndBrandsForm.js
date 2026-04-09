import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { 
  PlusIcon, 
  TrashIcon, 
  TagIcon, 
  BookmarkIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;
 
const PRESET_ICONS = [
  '🌹', '🌸', '🌷', '🌼', '🌻', '🌺', '🌿', '🪴', '🎂', '❤️', 
  '🎁', '🎈', '🥂', '💍', '🎀', '✨', '🧸', '🕊️', '🎉', '🍰',
  '🏠', '⭐', '🛍️', '📦', '🚚', '🏷️', '📢', '🔥', '💎', '🎨'
];

function IconPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-gray-100 rounded-xl max-h-[160px] overflow-y-auto">
      {PRESET_ICONS.map(icon => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all text-lg
            ${value === icon ? 'bg-indigo-50 border-indigo-500 scale-110 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function EditableItem({ item, onSave, onDelete, color }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [order, setOrder] = useState(item.order || 0);
  const [icon, setIcon] = useState(item.icon || '🏷️');
  const [location, setLocation] = useState(item.location || 'navbar');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(item._id, { 
        name: name.trim(), 
        order: parseInt(order) || 0,
        icon,
        location
      });
      setEditing(false);
      toast({ type: 'success', message: 'Başarıyla güncellendi.' });
    } catch (e) {
      toast({ type: 'error', message: 'Güncelleme sırasında hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        title="Kaydı Sil"
        message={`"${item.name}" silinecek. Bu işlem geri alınamaz.`}
        onConfirm={() => { setConfirmOpen(false); onDelete(item._id); }}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Evet, Sil"
      />
      <div
        className={`flex justify-between items-center group p-3 rounded-lg border border-transparent transition-all duration-200 ${editing ? `bg-${color}-50 border-${color}-200` : `hover:border-${color}-100 hover:bg-${color}-50`}`}
        style={{ 
          background: editing ? `var(--${color}-bg-light, #f5f3ff)` : undefined,
          border: editing ? `1px solid var(--${color}-light, #a5b4fc)` : undefined,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {editing ? (
            <div className="flex flex-col gap-4 w-full py-4 border-l-4 border-indigo-400 pl-4 bg-indigo-50/20 rounded-r-xl">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Kategori Adı</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="form-input py-2 text-sm w-full"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Sıralama (Küçük Önce)</label>
                    <input
                      type="number"
                      value={order}
                      onChange={e => setOrder(e.target.value)}
                      className="form-input py-2 text-sm w-full"
                    />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">İkon Seçin</label>
                   <IconPicker value={icon} onChange={setIcon} />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Görünüm Yeri</label>
                    <select
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="form-select py-2 text-sm w-full font-bold"
                    >
                      <option value="navbar">Siyah Navbar (Üst Menü)</option>
                      <option value="sidebar">Sidebar (Slider Yanı)</option>
                      <option value="both">Her İki Tarafta Görünsün</option>
                    </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-2">
                 <span className="text-xl bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border border-gray-100">{item.icon || '🏷️'}</span>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 truncate">{item.name}</span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase">SIRA: {item.order || 0}</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border shadow-sm ${
                    item.location === 'navbar' ? 'bg-black text-white border-black' : 
                    item.location === 'sidebar' ? 'bg-lux-accent text-white border-lux-accent' : 
                    'bg-indigo-600 text-white border-indigo-600'
                  }`}>
                    {item.location === 'navbar' ? 'NAVBAR' : item.location === 'sidebar' ? 'SIDEBAR' : 'NAV + SIDE'}
                  </span>
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                title="Kaydet"
              >
                {saving ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setEditing(false); setName(item.name); }}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                title="İptal"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Düzenle"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Sil"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CategoriesAndBrandsForm() {
  const [categoryName, setCategoryName] = useState('');
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [categoryIcon, setCategoryIcon] = useState('🌹');
  const [categoryLocation, setCategoryLocation] = useState('navbar');
  const [brandName, setBrandName] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const toast = useToast();

  const fetchAll = React.useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axios.get(`${API}/api/categories`),
        axios.get(`${API}/api/brands`)
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      toast({ type: 'error', message: 'Veriler yüklenirken hata oluştu.' });
    }
  }, [toast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setCatLoading(true);
    try {
      const res = await axios.post(`${API}/api/categories`, { 
        name: categoryName.trim(),
        order: parseInt(categoryOrder) || 0,
        icon: categoryIcon,
        location: categoryLocation,
        parentCategory: null
      });
      // Refresh list to keep correct order from server
      const catRes = await axios.get(`${API}/api/categories`);
      setCategories(catRes.data);
      setCategoryName('');
      setCategoryOrder(0);
      toast({ type: 'success', title: 'Kategori Eklendi', message: `"${res.data.name}" başarıyla oluşturuldu.` });
    } catch (err) {
      toast({ type: 'error', message: err.response?.data?.message || 'Kategori eklenirken hata oluştu.' });
    } finally {
      setCatLoading(false);
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setBrandLoading(true);
    try {
      const res = await axios.post(`${API}/api/brands`, { name: brandName.trim() });
      setBrands(prev => [res.data, ...prev]);
      setBrandName('');
      toast({ type: 'success', title: 'Marka Eklendi', message: `"${res.data.name}" başarıyla oluşturuldu.` });
    } catch (err) {
      toast({ type: 'error', message: err.response?.data?.message || 'Marka eklenirken hata oluştu.' });
    } finally {
      setBrandLoading(false);
    }
  };

  const handleUpdateCategory = async (id, data) => {
    const res = await axios.put(`${API}/api/categories/${id}`, data);
    // Refresh list to keep correct order
    const catRes = await axios.get(`${API}/api/categories`);
    setCategories(catRes.data);
  };

  const handleUpdateBrand = async (id, data) => {
    const res = await axios.put(`${API}/api/brands/${id}`, typeof data === 'string' ? { name: data } : data);
    setBrands(prev => prev.map(b => b._id === id ? res.data : b));
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/api/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast({ type: 'success', message: 'Kategori silindi.' });
    } catch (err) {
      toast({ type: 'error', message: 'Kategori silinirken hata oluştu.' });
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`${API}/api/brands/${id}`);
      setBrands(prev => prev.filter(b => b._id !== id));
      toast({ type: 'success', message: 'Marka silindi.' });
    } catch (err) {
      toast({ type: 'error', message: 'Marka silinirken hata oluştu.' });
    }
  };

  const filteredCats = categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()));
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title text-2xl">Kategori ve Marka Yönetimi</h1>
          <p className="page-sub">Ürün gruplarını ve markaları buradan ekleyip düzenleyebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium">{categories.length} Kategori</span>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium">{brands.length} Marka</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kategori Kartı */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-indigo-500" />
              <span>Kategoriler</span>
              <span className="ml-1 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{filteredCats.length}</span>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleCategorySubmit} className="space-y-6 mb-8 p-6 bg-indigo-50/20 rounded-2xl border border-indigo-100 shadow-sm animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1 block mb-2">Kategori Adı</label>
                   <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="form-input w-full text-base py-3"
                    placeholder="Örn: Tasarım Buketler"
                   />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1 block mb-2">Sıralama (Örn: 1 en başa)</label>
                    <input
                      type="number"
                      value={categoryOrder}
                      onChange={(e) => setCategoryOrder(e.target.value)}
                      className="form-input w-full text-base py-3"
                      placeholder="0"
                    />
                 </div>
               </div>

               <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1 block mb-3">İkon Seçin</label>
                  <IconPicker value={categoryIcon} onChange={setCategoryIcon} />
               </div>

               <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1 block mb-2">Görünüm Yeri</label>
                  <select
                    value={categoryLocation}
                    onChange={(e) => setCategoryLocation(e.target.value)}
                    className="form-select w-full font-bold py-3"
                  >
                    <option value="navbar">Siyah Navbar (Üst Ana Menü)</option>
                    <option value="sidebar">Sidebar (Giriş Sayfası Slider Yanı)</option>
                    <option value="both">Her İki Tarafta da Görünsün</option>
                  </select>
               </div>

               <button type="submit" disabled={catLoading || !categoryName.trim()} className="btn btn-primary w-full shadow-lux-dark py-4 text-xs tracking-widest font-black uppercase">
                {catLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-5 h-5" />}
                KATEGORİYİ SİSTEME EKLE
              </button>
            </form>

            <div className="relative mb-4">
              <input
                type="text"
                value={catSearch}
                onChange={e => setCatSearch(e.target.value)}
                placeholder="Kategori ara..."
                className="form-input text-sm py-2"
                style={{ paddingLeft: catSearch ? '12px' : '12px' }}
              />
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCats.length > 0 ? (
                filteredCats.map(category => (
                  <EditableItem
                    key={category._id}
                    item={category}
                    onSave={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                    color="indigo"
                  />
                ))
              ) : (
                <div className="empty-state py-12">
                  <TagIcon className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">{catSearch ? 'Arama sonucu bulunamadı.' : 'Henüz kategori eklenmemiş.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Marka Kartı */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-emerald-500" />
              <span>Markalar</span>
              <span className="ml-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{filteredBrands.length}</span>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleBrandSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="form-input focus:border-emerald-500"
                placeholder="Yeni marka adı..."
              />
              <button type="submit" disabled={brandLoading || !brandName.trim()} className="btn flex-shrink-0" style={{ background: '#059669', color: '#fff' }}>
                {brandLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                Ekle
              </button>
            </form>

            <div className="relative mb-4">
              <input
                type="text"
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
                placeholder="Marka ara..."
                className="form-input text-sm py-2"
              />
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredBrands.length > 0 ? (
                filteredBrands.map(brand => (
                  <EditableItem
                    key={brand._id}
                    item={brand}
                    onSave={handleUpdateBrand}
                    onDelete={handleDeleteBrand}
                    color="emerald"
                  />
                ))
              ) : (
                <div className="empty-state py-12">
                  <BookmarkIcon className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">{brandSearch ? 'Arama sonucu bulunamadı.' : 'Henüz marka eklenmemiş.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesAndBrandsForm;
