import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { 
  CreditCardIcon, 
  BuildingLibraryIcon, 
  CheckIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

function PaymentManagement() {
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
        paymentMethods: {
          bankTransfer: { enabled: true, details: '', ...data.paymentMethods?.bankTransfer },
          creditCard: { enabled: false, provider: 'iyzico', apiKey: '', secretKey: '', baseUrl: 'https://sandbox-api.iyzipay.com', ...data.paymentMethods?.creditCard }
        }
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
      toast({ type: 'success', title: 'Başarılı', message: 'Ödeme ayarları güncellendi.' });
    } catch (error) {
      toast({ type: 'error', message: 'Kaydedilirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const updateBT = (key, val) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        bankTransfer: { ...settings.paymentMethods.bankTransfer, [key]: val }
      }
    });
  };

  const updateCC = (key, val) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        creditCard: { ...settings.paymentMethods.creditCard, [key]: val }
      }
    });
  };

  if (loading) return <div className="loading-wrap"><div className="spinner"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn">
      <div className="page-header flex justify-between items-center bg-white/50 backdrop-blur-lg sticky top-0 z-10 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ödeme Yönetimi</h1>
          <p className="text-gray-500 text-sm">Sanal POS ve banka transferi yöntemlerini yapılandırın.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                <ShieldCheckIcon className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Güvenli Ödeme</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                    Müşterilerinizin ödeme bilgilerini güvenli bir şekilde işlemek için Sanal POS sağlayıcınızdan aldığınız API anahtarlarını buraya girin.
                </p>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg">
                        <CheckIcon className="w-4 h-4 text-emerald-300" /> PCI-DSS Uyumlu Altyapı
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg">
                        <CheckIcon className="w-4 h-4 text-emerald-300" /> SSL Sertifikalı İşlemler
                    </div>
                </div>
            </div>

            <div className="card p-6 border-dashed bg-gray-50">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Entegre Sağlayıcılar</h4>
                <div className="flex flex-wrap gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                    <img src="https://logowik.com/content/uploads/images/iyzico-blue-text9392.jpg" alt="Iyzico" className="h-6" />
                    <img src="https://www.paytr.com/blog/wp-content/uploads/paytr-logo.png" alt="PayTR" className="h-6" />
                </div>
            </div>
        </div>

        {/* Main Config */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Bank Transfer */}
            <div className={`card overflow-hidden border-2 transition-all ${settings.paymentMethods?.bankTransfer?.enabled ? 'border-indigo-100' : 'border-transparent'}`}>
                <div className="card-header border-b border-gray-50 flex justify-between items-center p-6 bg-white">
                    <div className="flex items-center gap-3">
                        <BuildingLibraryIcon className="w-6 h-6 text-indigo-500" />
                        <div>
                            <h3 className="font-bold text-gray-800">Banka Havalesi / EFT</h3>
                            <p className="text-xs text-gray-400">Manuel ödeme teyidi gerektirir.</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.paymentMethods?.bankTransfer?.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.paymentMethods?.bankTransfer?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={settings.paymentMethods?.bankTransfer?.enabled} 
                          onChange={e => updateBT('enabled', e.target.checked)} 
                        />
                    </label>
                </div>
                {settings.paymentMethods?.bankTransfer?.enabled && (
                    <div className="card-body p-6 bg-indigo-50/10 animate-slideDown">
                        <label className="form-label text-[10px] text-indigo-600 font-bold uppercase">Banka Hesap Bilgileri & Talimatlar</label>
                        <textarea 
                            className="form-textarea bg-white" 
                            rows={6}
                            value={settings.paymentMethods.bankTransfer.details}
                            onChange={e => updateBT('details', e.target.value)}
                            placeholder="Ziraat Bankası - TR00 0000 0000 0000 0000 0000 - Alıcı: Ad Soyad"
                        />
                        <p className="text-[10px] text-gray-400 mt-2">* Ödeme sayfasında müşteriye gösterilecek olan IBAN ve talimatları girin.</p>
                    </div>
                )}
            </div>

            {/* Credit Card / Virtual POS */}
            <div className={`card overflow-hidden border-2 transition-all ${settings.paymentMethods?.creditCard?.enabled ? 'border-indigo-100' : 'border-transparent'}`}>
                <div className="card-header border-b border-gray-50 flex justify-between items-center p-6 bg-white">
                    <div className="flex items-center gap-3">
                        <CreditCardIcon className="w-6 h-6 text-indigo-500" />
                        <div>
                            <h3 className="font-bold text-gray-800">Kredi Kartı / Sanal POS</h3>
                            <p className="text-xs text-gray-400">Otomatik ve anında ödeme onayı.</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.paymentMethods?.creditCard?.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.paymentMethods?.creditCard?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={settings.paymentMethods?.creditCard?.enabled} 
                          onChange={e => updateCC('enabled', e.target.checked)} 
                        />
                    </label>
                </div>
                {settings.paymentMethods?.creditCard?.enabled && (
                    <div className="card-body p-6 bg-indigo-50/10 space-y-6 animate-slideDown">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label text-[10px] text-indigo-600 font-bold uppercase">POS Sağlayıcı</label>
                                <select 
                                    className="form-input bg-white"
                                    value={settings.paymentMethods.creditCard.provider}
                                    onChange={e => updateCC('provider', e.target.value)}
                                >
                                    <option value="iyzico">Iyzico</option>
                                    <option value="paytr">PayTR</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label text-[10px] text-indigo-600 font-bold uppercase">Çalışma Modu</label>
                                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                    <button 
                                        onClick={() => updateCC('baseUrl', 'https://sandbox-api.iyzipay.com')}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${settings.paymentMethods.creditCard.baseUrl.includes('sandbox') ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400'}`}
                                    >
                                        SANDBOX
                                    </button>
                                    <button 
                                        onClick={() => updateCC('baseUrl', 'https://api.iyzipay.com')}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${!settings.paymentMethods.creditCard.baseUrl.includes('sandbox') ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400'}`}
                                    >
                                        LIVE
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label text-[10px] text-indigo-600 font-bold uppercase">Base URL / Endpoint</label>
                            <div className="relative">
                                <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    className="form-input pl-10" 
                                    value={settings.paymentMethods.creditCard.baseUrl}
                                    onChange={e => updateCC('baseUrl', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="form-group">
                                <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-widest">API Key (Public)</label>
                                <input 
                                    type="password"
                                    className="form-input" 
                                    value={settings.paymentMethods.creditCard.apiKey}
                                    onChange={e => updateCC('apiKey', e.target.value)}
                                    placeholder="api_key_..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Secret Key (Private)</label>
                                <input 
                                    type="password"
                                    className="form-input" 
                                    value={settings.paymentMethods.creditCard.secretKey}
                                    onChange={e => updateCC('secretKey', e.target.value)}
                                    placeholder="secret_key_..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                * Değişikliklerin geçerli olması için kaydetmeyi unutmayın.
            </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;
