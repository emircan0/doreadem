import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { 
  ArrowLeftIcon, 
  ChevronRightIcon, 
  PhotoIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  CheckIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import config from '../config';

const API = config.API_BASE;

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    categories: [],
    stock: '',
    images: [],
    discount: 0,
    sku: '',
    dimensions: { width: '', height: '', depth: '' },
    weight: '',
    status: 'active',
    brand: '',
    featured: false,
    upsellOptions: []
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get(`${API}/api/categories`),
          axios.get(`${API}/api/brands`)
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) {
        toast({ type: 'error', message: 'Kategori/marka verileri yüklenemedi.' });
      }
    };
    fetchData();

    if (id) {
      setFetching(true);
      axios.get(`${API}/api/products/${id}`)
        .then(res => {
          const p = res.data;
          setProduct({
            ...p,
            // Normalize categories and brand to ID strings/arrays for inputs
            categories: p.categories?.map(c => typeof c === 'object' ? c._id : c) || [],
            brand: p.brand?._id || p.brand || '',
            dimensions: {
              width: p.dimensions?.width || '',
              height: p.dimensions?.height || '',
              depth: p.dimensions?.depth || '',
            },
            weight: p.weight?.value || p.weight || '',
            upsellOptions: p.upsellOptions || []
          });
        })
        .catch(() => toast({ type: 'error', message: 'Ürün bilgileri yüklenemedi.' }))
        .finally(() => setFetching(false));
    }
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name?.trim()) { toast({ type: 'warning', message: 'Ürün adı zorunludur.' }); return; }
    if (!product.price || +product.price <= 0) { toast({ type: 'warning', message: 'Geçerli bir fiyat girin.' }); return; }
    if (!product.categories || product.categories.length === 0) { toast({ type: 'warning', message: 'En az bir kategori seçimi zorunludur.' }); return; }
    if (!product.brand) { toast({ type: 'warning', message: 'Marka seçimi zorunludur.' }); return; }
    if (product.stock === '' || +product.stock < 0) { toast({ type: 'warning', message: 'Stok adedi zorunludur.' }); return; }
    if (!product.images || product.images.length === 0) { toast({ type: 'error', title: 'Görsel Eksik', message: 'Lütfen ürünün en az bir ana görselini yükleyin.' }); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', product.name.trim());
      formData.append('price', product.price);
      formData.append('description', product.description || '');
      // Append categories as multiple entries or JSON
      product.categories.forEach(catId => formData.append('categories', catId));
      formData.append('brand', product.brand);
      formData.append('stock', product.stock);
      formData.append('discount', product.discount || 0);
      formData.append('sku', product.sku || '');
      formData.append('dimensions[width]', product.dimensions.width || 0);
      formData.append('dimensions[height]', product.dimensions.height || 0);
      formData.append('dimensions[depth]', product.dimensions.depth || 0);
      formData.append('weight', product.weight || 0);
      formData.append('status', product.status || 'active');
      formData.append('featured', product.featured ? 'true' : 'false');
      formData.append('upsellOptions', JSON.stringify(product.upsellOptions || []));

      // Only send existing URL images (server paths), not file objects
      const existingImages = (product.images || []).filter(img => typeof img === 'string');
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      await axios({
        method: id ? 'put' : 'post',
        url: id ? `${API}/api/products/${id}` : `${API}/api/products/`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast({ 
        type: 'success', 
        title: id ? 'Ürün Güncellendi' : 'Ürün Oluşturuldu',
        message: `"${product.name}" başarıyla ${id ? 'güncellendi' : 'eklendi'}.`
      });
      navigate('/products');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Bilinmeyen hata';
      toast({ type: 'error', title: 'Kayıt Hatası', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const addUpsellOption = () => {
    setProduct(prev => ({
      ...prev,
      upsellOptions: [...prev.upsellOptions, { name: '', price: '', imageUrl: '' }]
    }));
  };

  const removeUpsellOption = (index) => {
    setProduct(prev => ({
      ...prev,
      upsellOptions: prev.upsellOptions.filter((_, i) => i !== index)
    }));
  };

  const updateUpsellOption = (index, key, val) => {
    setProduct(prev => {
      const newOptions = [...prev.upsellOptions];
      newOptions[index] = { ...newOptions[index], [key]: val };
      return { ...prev, upsellOptions: newOptions };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setImageUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await axios.post(`${API}/api/products/upload`, formData);
      const urls = response.data.urls || [];
      // Prepend server URL if relative path
      const fullUrls = urls.map(u => u.startsWith('http') ? u : `${API}${u}`);
      setProduct(prev => ({ ...prev, images: [...prev.images, ...fullUrls] }));
      toast({ type: 'success', message: `${files.length} görsel yüklendi.` });
    } catch (error) {
      toast({ type: 'error', message: 'Görsel yüklenirken hata oluştu.' });
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const set = (key, val) => setProduct(prev => ({ ...prev, [key]: val }));
  const setDim = (key, val) => setProduct(prev => ({ ...prev, dimensions: { ...prev.dimensions, [key]: val } }));

  if (fetching) return <div className="loading-wrap"><div className="spinner"></div></div>;

  const discountedPrice = product.discount > 0 && product.price 
    ? (+product.price * (1 - product.discount / 100)).toFixed(2) 
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
            <button onClick={() => navigate('/products')} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              Ürünler
            </button>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-gray-600">{id ? 'Ürün Düzenle' : 'Yeni Ürün'}</span>
          </div>
          <h1 className="page-title text-2xl font-bold">{id ? 'Ürünü Düzenle' : 'Yeni Koleksiyon Parçası Ekle'}</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/products')} className="btn btn-ghost">
            İptal
          </button>
          {id && (
            <button 
              onClick={() => window.open(`/product/${id}`, '_blank')} 
              className="btn btn-ghost group border-lux-accent/20 text-lux-accent"
            >
              <PhotoIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Sitede Gör
            </button>
          )}
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary min-w-[140px] shadow-lg">
            {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
            {loading ? 'Kaydediliyor...' : (id ? 'Güncelle' : 'Yayınla')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Temel Bilgiler */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-500" />
              Temel Bilgiler
            </div>
            <div className="card-body space-y-6">
              <div className="form-group">
                <label className="form-label">Ürün Adı <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={product.name}
                  onChange={e => set('name', e.target.value)}
                  className="form-input text-lg font-medium"
                  placeholder="Örn: Siyah Deri El Çantası"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Ürün Kodu (SKU)</label>
                  <input
                    type="text"
                    value={product.sku || ''}
                    onChange={e => set('sku', e.target.value)}
                    className="form-input"
                    placeholder="SC-001"
                  />
                </div>
                <div className="form-group sm:col-span-2">
                  <label className="form-label flex justify-between items-center">
                    <span>Kategoriler <span className="text-red-500">*</span></span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{product.categories?.length} Seçili</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-[220px] overflow-y-auto">
                    {categories.map(c => (
                      <label 
                        key={c._id} 
                        className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer group ${
                          product.categories?.includes(c._id) 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={product.categories?.includes(c._id)}
                          onChange={(e) => {
                            const selected = product.categories || [];
                            if (e.target.checked) {
                              set('categories', [...selected, c._id]);
                            } else {
                              set('categories', selected.filter(id => id !== c._id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold uppercase tracking-wider">{c.name}</span>
                          {c.location && (
                            <span className="text-[8px] font-black opacity-40 uppercase">{c.location}</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Marka <span className="text-red-500">*</span></label>
                  <select
                    value={product.brand}
                    onChange={e => set('brand', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Marka Seçin</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Yayın Durumu</label>
                  <select
                    value={product.status}
                    onChange={e => set('status', e.target.value)}
                    className={`form-select font-semibold ${product.status === 'active' ? 'text-green-600' : product.status === 'draft' ? 'text-yellow-600' : 'text-red-600'}`}
                  >
                    <option value="active">✅ Aktif (Satışta)</option>
                    <option value="draft">📝 Taslak</option>
                    <option value="inactive">⛔ Pasif (Gizli)</option>
                    <option value="archived">📦 Arşivlendi</option>
                  </select>
                </div>
              </div>

              {/* Featured Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', background: product.featured ? '#fffbeb' : '#f9fafb', borderRadius: 10, border: `1px solid ${product.featured ? '#fcd34d' : '#e5e7eb'}`, transition: '0.2s' }}>
                <div
                  onClick={() => set('featured', !product.featured)}
                  style={{
                    width: 42, height: 24, borderRadius: 12, background: product.featured ? '#f59e0b' : '#d1d5db',
                    position: 'relative', transition: '0.2s', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, left: product.featured ? 21 : 3, transition: '0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {product.featured ? <StarSolid className="w-4 h-4 text-amber-400" /> : <StarIcon className="w-4 h-4 text-gray-400" />}
                    Öne Çıkan Ürün
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>Bu ürün ana sayfada öne çıkan bölümünde görünür</div>
                </div>
              </label>

              <div className="form-group">
                <label className="form-label">Ürün Açıklaması</label>
                <textarea
                  value={product.description || ''}
                  onChange={e => set('description', e.target.value)}
                  className="form-textarea"
                  rows={4}
                  placeholder="Ürün hakkında detaylı bilgi girin..."
                />
              </div>
            </div>
          </div>

          {/* Görseller */}
          <div className="card">
            <div className="card-header flex items-center gap-2 text-lux-dark">
              <PhotoIcon className="w-5 h-5 text-lux-accent" />
              <span>Ürün Görselleri <span className="text-red-500 text-[10px] ml-1 font-bold">(ZORUNLU)</span></span>
              {imageUploading && <ArrowPathIcon className="w-4 h-4 animate-spin ml-auto text-indigo-500" />}
            </div>
            <div className="card-body">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors group relative cursor-pointer ${imageUploading ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'}`}>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  disabled={imageUploading}
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-500 transition-colors">
                    {imageUploading ? <ArrowPathIcon className="w-6 h-6 animate-spin text-indigo-500" /> : <PlusIcon className="w-6 h-6" />}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {imageUploading ? 'Yükleniyor...' : 'Görsel Yüklemek İçin Tıklayın veya Sürükleyin'}
                  </div>
                  <div className="text-xs text-gray-400 italic">PNG, JPG veya WEBP (Max 5MB her biri)</div>
                </div>
              </div>

              {product.images?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.images.map((url, index) => {
                    const displayUrl = url.startsWith('http') ? url : `${API}${url}`;
                    return (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                        <img src={displayUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/90 text-white text-[10px] font-bold py-1 text-center tracking-wide">
                            ANA GÖRSEL
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Fiyat & Stok */}
          <div className="card border-l-4 border-l-indigo-500 shadow-lg">
            <div className="card-header flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-indigo-500" />
              Fiyatlandırma & Stok
            </div>
            <div className="card-body space-y-5">
              <div className="form-group">
                <label className="form-label">Satış Fiyatı (TL) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={product.price}
                    onChange={e => set('price', e.target.value)}
                    className="form-input pl-10 text-xl font-bold text-indigo-700"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₺</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">İndirim Oranı (%)</label>
                <input
                  type="number"
                  value={product.discount || 0}
                  onChange={e => set('discount', Math.min(100, Math.max(0, +e.target.value)))}
                  className="form-input"
                  min="0"
                  max="100"
                />
                {discountedPrice && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    İndirimli Fiyat: ₺{parseFloat(discountedPrice).toLocaleString('tr-TR')}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Stok Adedi <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={e => set('stock', e.target.value)}
                  className={`form-input font-bold ${+product.stock <= 0 ? 'text-red-500' : +product.stock < 10 ? 'text-orange-500' : 'text-gray-700'}`}
                  min="0"
                  placeholder="0"
                />
                {+product.stock > 0 && +product.stock < 10 && (
                  <p className="text-xs text-orange-500 font-medium mt-1">Düşük Stok Uyarısı!</p>
                )}
                {+product.stock <= 0 && product.stock !== '' && (
                  <p className="text-xs text-red-500 font-medium mt-1">Stok tükendi.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sürpriz Büyüt Seçenekleri (Upsells) */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
               <div className="flex items-center gap-2 text-indigo-500 font-bold">
                 <StarIcon className="w-5 h-5" />
                 Sürpriz Büyüt Seçenekleri
               </div>
               <button 
                type="button"
                onClick={addUpsellOption}
                className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
               >
                 <PlusIcon className="w-4 h-4" />
               </button>
            </div>
            <div className="card-body">
               {product.upsellOptions?.length === 0 ? (
                 <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400">Henüz bir seçenek eklenmemiş. 'Artı' butonuna tıklayarak vazo, çikolata vb. ekleyebilirsiniz.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {product.upsellOptions.map((opt, idx) => (
                      <div key={idx} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 relative group animate-fade-in-up">
                         <button 
                           onClick={() => removeUpsellOption(idx)}
                           className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                         >
                           <TrashIcon className="w-3.5 h-3.5" />
                         </button>
                         <div className="space-y-3">
                            <div>
                               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Seçenek Adı</label>
                               <input 
                                 type="text" 
                                 value={opt.name} 
                                 onChange={(e) => updateUpsellOption(idx, 'name', e.target.value)}
                                 className="form-input text-xs py-2"
                                 placeholder="Örn: Kristal Vazo"
                               />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                               <div>
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ek Fiyat (TL)</label>
                                  <input 
                                    type="number" 
                                    value={opt.price} 
                                    onChange={(e) => updateUpsellOption(idx, 'price', e.target.value)}
                                    className="form-input text-xs py-2"
                                    placeholder="0"
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Görsel URL</label>
                                  <input 
                                    type="text" 
                                    value={opt.imageUrl} 
                                    onChange={(e) => updateUpsellOption(idx, 'imageUrl', e.target.value)}
                                    className="form-input text-xs py-2"
                                    placeholder="https://..."
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Lojistik */}
          <div className="card bg-gray-50/50">
            <div className="card-header flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-gray-500" />
              Lojistik & Boyutlar
            </div>
            <div className="card-body space-y-5">
              <div>
                <label className="form-label mb-3">Boyutlar (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['width', 'En'], ['height', 'Boy'], ['depth', 'Der.']].map(([key, label]) => (
                    <div key={key} className="form-group">
                      <label className="form-label text-[11px] text-gray-400">{label}</label>
                      <input
                        type="number"
                        value={product.dimensions[key] || ''}
                        onChange={e => setDim(key, e.target.value)}
                        className="form-input py-1.5 px-2 text-center text-sm"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ağırlık (kg)</label>
                <input
                  type="number"
                  value={product.weight || ''}
                  onChange={e => set('weight', e.target.value)}
                  className="form-input"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end items-center gap-4 py-8 border-t border-gray-100 mt-12">
        <button onClick={() => navigate('/products')} className="btn btn-ghost px-8">
          İptal Et
        </button>
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary shadow-lux" style={{ minWidth: 200 }}>
          {loading ? (
            <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
          ) : (
            <><CheckIcon className="w-4 h-4" /> {id ? 'Değişiklikleri Güncelle' : 'Ürünü Koleksiyona Ekle'}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductForm;
