import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PhotoIcon,
  MapPinIcon,
  CalendarDaysIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const toast = useToast();

  const fetchOrgs = async () => {
    try {
      const res = await axios.get(`${API}/api/organizations?admin=true`);
      setOrgs(res.data);
    } catch (err) {
      toast({ type: 'error', message: 'Organizasyonlar yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleDelete = async () => {
    if (!orgToDelete) return;
    try {
      await axios.delete(`${API}/api/organizations/${orgToDelete._id}`);
      setOrgs(orgs.filter(o => o._id !== orgToDelete._id));
      toast({ type: 'success', message: 'Organizasyon başarıyla silindi.' });
      setConfirmOpen(false);
    } catch (err) {
      toast({ type: 'error', message: 'Silme işlemi sırasında hata oluştu.' });
    }
  };

  const imageUrl = (path) => path.startsWith('http') ? path : `${API}${path}`;

  if (loading) {
    return <div className="flex justify-center p-20 animate-spin"><PhotoIcon className="w-10 h-10 text-lux-accent" /></div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Organizasyon Yönetimi</h2>
          <p className="text-sm text-gray-500">Portfolyonuzu buradan yönetebilir ve yeni etkinlikler ekleyebilirsiniz.</p>
        </div>
        <Link to="/organizations/add" className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Yeni Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgs.length > 0 ? orgs.map((org) => (
          <div key={org._id} className="card group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <div className="relative h-48">
              <img 
                src={imageUrl(org.mainImage)} 
                alt={org.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${org.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {org.isActive ? 'Yayında' : 'Taslak'}
                </span>
              </div>
            </div>
            
            <div className="card-body p-5">
              <h3 className="font-bold text-gray-800 mb-2 truncate">{org.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDaysIcon className="w-4 h-4" />
                  {org.date ? new Date(org.date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPinIcon className="w-4 h-4" />
                  {org.location || 'Belirtilmedi'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Link to={`/organizations/edit/${org._id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <PencilSquareIcon className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => { setOrgToDelete(org); setConfirmOpen(true); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <a 
                  href={`/organizasyon/${org.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-gray-400 hover:text-lux-accent hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz bir organizasyon eklenmemiş.</p>
            <Link to="/organizations/add" className="text-indigo-600 font-bold hover:underline mt-2 inline-block">İlk organizasyonunu ekle</Link>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={confirmOpen}
        title="Organizasyonu Sil"
        message={`"${orgToDelete?.title}" kalıcı olarak silinecek. Emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Evet, Sil"
      />
    </div>
  );
};

export default Organizations;
