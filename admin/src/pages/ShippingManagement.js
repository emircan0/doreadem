import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { 
  TruckIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

const DEFAULT_METHOD = {
  name: '',
  price: 0,
  description: '',
  freeAbove: 2000
};

function ShippingManagement() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/api/settings`);
      setSettings({
        ...data,
        shippingMethods: data.shippingMethods || [],
        freeShippingThreshold: data.freeShippingThreshold || 2000
      });
    } catch (error) {
      toast({ type: 'error', message: 'Ayarlar yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/settings`, settings);
      toast({ type: 'success', title: 'Başarılı', message: 'Kargo ayarları güncellendi.' });
    } catch (error) {
      toast({ type: 'error', message: 'Kaydedilirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const updateThreshold = (val) => setSettings({ ...settings, freeShippingThreshold: val });

  const addMethod = () => {
    const methods = [...(settings.shippingMethods || []), { ...DEFAULT_METHOD }];
    setSettings({ ...settings, shippingMethods: methods });
  };

  const removeMethod = (index) => {
    const methods = settings.shippingMethods.filter((_, i) => i !== index);
    setSettings({ ...settings, shippingMethods: methods });
  };

  const updateMethod = (index, key, val) => {
    const methods = [...settings.shippingMethods];
    methods[index] = { ...methods[index], [key]: val };
    setSettings({ ...settings, shippingMethods: methods });
  };

  if (loading) return <div className="loading-wrap"><div className="spinner"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      <div className="page-header flex justify-between items-center bg-white/50 backdrop-blur-lg sticky top-0 z-10 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kargo Yönetimi</h1>
          <p className="text-gray-500 text-sm">Teslimat yöntemlerini, ücretlerini ve ücretsiz kargo limitlerini düzenleyin.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-primary shadow-lg shadow-indigo-200"
        >
          {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CheckIcon className="w-5 h-5" />}
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div className="card mb-8">
        <div className="card-header flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-gray-800">Global Kargo Kuralları</span>
        </div>
        <div className="card-body p-6">
            <div className="max-w-xs">
                <label className="form-label">Varsayılan Ücretsiz Kargo Limiti (₺)</label>
                <div className="relative">
                    <input 
                      type="number" 
                      className="form-input pl-10" 
                      value={settings.freeShippingThreshold} 
                      onChange={e => updateThreshold(+e.target.value)} 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₺</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">* Bu limit kargo firması bazlı limit belirtilmediğinde geçerli olur.</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Kargo Firmaları</h3>
            <button 
                type="button" 
                onClick={addMethod}
                className="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none text-[11px] py-2"
            >
                <PlusIcon className="w-4 h-4" /> Yeni Firma Ekle
            </button>
        </div>

        {(settings.shippingMethods || []).map((method, i) => (
          <div key={i} className="card group overflow-visible">
            <div className="card-body p-6 relative">
              <button 
                onClick={() => removeMethod(i)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full border border-red-100 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Kargo Firması Adı</label>
                  <input 
                    className="form-input" 
                    value={method.name} 
                    onChange={e => updateMethod(i, 'name', e.target.value)} 
                    placeholder="Örn: Yurtiçi Kargo"
                  />
                </div>
                <div>
                  <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Sabit Ücret (₺)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={method.price} 
                    onChange={e => updateMethod(i, 'price', +e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Ücretsiz Limit (₺)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={method.freeAbove} 
                    onChange={e => updateMethod(i, 'freeAbove', +e.target.value)} 
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Tahmini Teslimat / Açıklama</label>
                  <input 
                    className="form-input" 
                    value={method.description} 
                    onChange={e => updateMethod(i, 'description', e.target.value)} 
                    placeholder="Örn: 1-3 iş günü içinde adrese teslim."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {settings.shippingMethods?.length === 0 && (
          <div className="card p-12 text-center border-dashed">
            <TruckIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Henüz bir kargo yöntemi tanımlanmadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShippingManagement;
