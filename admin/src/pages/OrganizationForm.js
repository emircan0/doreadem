import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  DocumentTextIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  CheckIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

function OrganizationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [org, setOrg] = useState({
    title: '',
    description: '',
    mainImage: '',
    gallery: [],
    location: '',
    date: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (id) {
      setFetching(true);
      axios.get(`${API}/api/organizations?admin=true`)
        .then(res => {
          const found = res.data.find(o => o._id === id);
          if (found) {
            setOrg({
              ...found,
              date: found.date ? found.date.split('T')[0] : ''
            });
          } else {
            toast({ type: 'error', message: 'Organizasyon bulunamadı.' });
            navigate('/organizations');
          }
        })
        .catch(() => toast({ type: 'error', message: 'Veriler yüklenemedi.' }))
        .finally(() => setFetching(false));
    }
  }, [id, toast, navigate]);

  const handleImageUpload = async (e, isGallery = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setImageUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await axios.post(`${API}/api/products/upload`, formData);
      const urls = response.data.urls || [];
      const fullUrls = urls.map(u => u.startsWith('http') ? u : u);

      if (isGallery) {
        setOrg(prev => ({ ...prev, gallery: [...prev.gallery, ...fullUrls] }));
      } else {
        setOrg(prev => ({ ...prev, mainImage: fullUrls[0] }));
      }
      toast({ type: 'success', message: 'Görsel başarıyla yüklendi.' });
    } catch (error) {
      console.error('Upload error details:', error);
      const msg = error.response?.data?.message || 'Görsel yüklenirken hata oluştu.';
      toast({ type: 'error', message: msg });
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!org.title.trim()) { toast({ type: 'warning', message: 'Başlık zorunludur.' }); return; }
    if (!org.description.trim()) { toast({ type: 'warning', message: 'Açıklama zorunludur.' }); return; }
    if (!org.mainImage) { toast({ type: 'warning', message: 'Ana görsel zorunludur.' }); return; }

    setLoading(true);
    try {
      const data = {
        ...org,
        order: parseInt(org.order) || 0
      };

      if (id) {
        await axios.put(`${API}/api/organizations/${id}`, data);
      } else {
        await axios.post(`${API}/api/organizations`, data);
      }
      
      toast({ 
        type: 'success', 
        message: `Organizasyon başarıyla ${id ? 'güncellendi' : 'eklendi'}.` 
      });
      navigate('/organizations');
    } catch (error) {
      toast({ type: 'error', message: 'Kaydedilirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index) => {
    setOrg(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const imageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API}${path}`;
  };

  if (fetching) return <div className="flex justify-center p-20 animate-spin"><ArrowPathIcon className="w-10 h-10 text-lux-accent" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/organizations" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{id ? 'Organizasyonu Düzenle' : 'Yeni Organizasyon Ekle'}</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Sektörel Portfolyo Kaydı</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <input 
                    type="checkbox" 
                    checked={org.isActive} 
                    onChange={e => setOrg(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-lux-accent border-gray-300 rounded focus:ring-lux-accent"
                />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">Yayında</span>
            </label>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 px-8 py-2.5"
            >
                {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CheckIcon className="w-5 h-5" />}
                {id ? 'Güncelle' : 'Kaydet'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card shadow-sm border-0">
             <div className="card-header border-b border-gray-50 flex items-center gap-2 py-4">
                <DocumentTextIcon className="w-5 h-5 text-lux-accent" />
                <span className="font-bold text-gray-800">Genel Bilgiler</span>
             </div>
             <div className="card-body p-6 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Etkinlik Başlığı</label>
                  <input
                    type="text"
                    value={org.title}
                    onChange={e => setOrg(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input w-full text-lg font-bold"
                    placeholder="Örn: Lüks Bahçe Düğünü"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Açıklama (Hikayesi)</label>
                  <textarea
                    rows={10}
                    value={org.description}
                    onChange={e => setOrg(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input w-full resize-none leading-relaxed"
                    placeholder="Etkinlik hakkında detaylı bilgi, konsept ve kullanılan ürünler..."
                  />
                </div>
             </div>
          </div>

          {/* Location & Date */}
          <div className="card shadow-sm border-0">
             <div className="card-header border-b border-gray-50 flex items-center gap-2 py-4">
                <MapPinIcon className="w-5 h-5 text-lux-accent" />
                <span className="font-bold text-gray-800">Yer & Tarih</span>
             </div>
             <div className="card-body p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-gray-400">Konum / Mekan</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={org.location}
                        onChange={e => setOrg(prev => ({ ...prev, location: e.target.value }))}
                        className="form-input w-full pl-10"
                        placeholder="Örn: Çırağan Sarayı"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-gray-400">Etkinlik Tarihi</label>
                  <div className="relative">
                    <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="date"
                        value={org.date}
                        onChange={e => setOrg(prev => ({ ...prev, date: e.target.value }))}
                        className="form-input w-full pl-10"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Images & Meta */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="card shadow-sm border-0 overflow-hidden">
            <div className="card-header border-b border-gray-50 flex items-center justify-between p-4 bg-gray-50/50">
              <span className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                 <PhotoIcon className="w-5 h-5 text-lux-accent" /> Ana Görsel
              </span>
              <label className="cursor-pointer text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
                Değiştir
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
            <div className="p-0 bg-white min-h-[250px] relative flex items-center justify-center">
              {org.mainImage ? (
                <img src={imageUrl(org.mainImage)} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-8">
                  <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-bold text-indigo-500">Görsel Seç</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              )}
              {imageUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                      <ArrowPathIcon className="w-8 h-8 animate-spin text-lux-accent" />
                  </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="card shadow-sm border-0">
             <div className="card-header border-b border-gray-50 flex items-center justify-between p-4">
                <span className="font-bold text-gray-800 text-sm">Galeri ({org.gallery.length})</span>
                <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                   Ekle
                   <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, true)} accept="image/*" />
                </label>
             </div>
             <div className="p-4 grid grid-cols-3 gap-2">
                {org.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <img src={imageUrl(img)} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        <button 
                            onClick={() => removeGalleryImage(i)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                {org.gallery.length === 0 && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-300 uppercase underline">Henüz fotoğraf yok</p>
                    </div>
                )}
             </div>
          </div>

          {/* Order */}
          <div className="card shadow-sm border-0 p-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Görüntüleme Sırası</label>
            <input
                type="number"
                value={org.order}
                onChange={e => setOrg(prev => ({ ...prev, order: e.target.value }))}
                className="form-input w-full"
                placeholder="0"
            />
            <p className="text-[9px] text-gray-400 mt-2 italic">* Küçük numaralı organizasyonlar listenin en başında görünür.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationForm;
