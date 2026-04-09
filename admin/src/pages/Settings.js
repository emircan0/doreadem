import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { 
  BuildingOfficeIcon, 
  MegaphoneIcon, 
  PhotoIcon, 
  PhoneIcon, 
  ShareIcon,
  CheckIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import config from '../config';

const API = config.API_BASE;

const DEFAULT = {
  siteName: 'Dore Adem',
  siteTagline: 'Doğanın En Zarif Dokunuşu',
  siteDescription: '',
  announcement: 'Yeni Sezon Tasarım Buketlerde %20 İndirim | Ücretsiz Kargo',
  announcementEnabled: true,
  freeShippingThreshold: 1000,
  heroSlides: [],
  contactEmail: '',
  contactPhone: '',
  address: '',
  socialMedia: { instagram: '', facebook: '', pinterest: '', tiktok: '', twitter: '' },
  footerText: '',
  aboutTitle: 'Hikayemiz',
  aboutSubtitle: 'Her çiçekte doğanın bir gülümsemesi, her bukette bir sevgi saklı.',
  stats: [
    { label: 'Mutlu An', value: '10K+' },
    { label: 'Yıllık Tecrübe', value: '15' },
    { label: 'Çiçek Türü', value: '50+' }
  ],
  shippingMethods: [],
  paymentMethods: {
    bankTransfer: { enabled: true, details: '' },
    creditCard: { enabled: false, provider: 'iyzico', apiKey: '', secretKey: '', baseUrl: 'https://sandbox-api.iyzipay.com' }
  }
};

const EMPTY_SLIDE = {
  title: '',
  subtitle: '',
  imageUrl: '',
  ctaText: 'Keşfet',
  ctaLink: '/kategori/tumu',
  overlay: 40,
};

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card mb-8 animate-fadeIn">
      <div className="card-header flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
        <span className="font-bold text-gray-800">{title}</span>
      </div>
      <div className="card-body p-6">{children}</div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    axios.get(`${API}/api/settings`)
      .then(r => setSettings({ ...DEFAULT, ...r.data, socialMedia: { ...DEFAULT.socialMedia, ...r.data.socialMedia } }))
      .catch(() => toast({ type: 'warning', message: 'Mevcut ayarlar bulunamadı, varsayılanlar yükleniyor.' }))
      .finally(() => setLoading(false));
  }, [toast]);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));
  const setSocial = (key, val) => setSettings(s => ({ ...s, socialMedia: { ...s.socialMedia, [key]: val } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/api/settings`, settings);
      toast({ type: 'success', title: 'Başarılı', message: 'Sistem ayarları güncellendi.' });
    } catch {
      toast({ type: 'error', message: 'Ayarlar kaydedilirken hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => set('heroSlides', [...(settings.heroSlides || []), { ...EMPTY_SLIDE, _id: Date.now().toString() }]);
  const removeSlide = (i) => set('heroSlides', settings.heroSlides.filter((_, idx) => idx !== i));
  const updateSlide = (i, key, val) => {
    const slides = [...settings.heroSlides];
    slides[i] = { ...slides[i], [key]: val };
    set('heroSlides', slides);
  };
  const moveSlide = (i, dir) => {
    const slides = [...settings.heroSlides];
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    [slides[i], slides[j]] = [slides[j], slides[i]];
    set('heroSlides', slides);
  };

  const addStat = () => set('stats', [...(settings.stats || []), { label: '', value: '' }]);
  const removeStat = (i) => set('stats', settings.stats.filter((_, idx) => idx !== i));
  const updateStat = (i, key, val) => {
    const stats = [...settings.stats];
    stats[i] = { ...stats[i], [key]: val };
    set('stats', stats);
  };

  if (loading) return (
    <div className="loading-wrap"><div className="spinner"></div></div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="page-header flex justify-between items-center bg-white/50 backdrop-blur-lg sticky top-0 z-10 border-b border-gray-100/50 pt-4 pb-4">
        <div>
          <h1 className="page-title text-2xl">Site Ayarları</h1>
          <p className="page-sub">E-ticaret sitenizin genel görünümünü ve işleyişini yapılandırın.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary shadow-lg shadow-indigo-200">
          {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CheckIcon className="w-5 h-5" />}
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Genel Ayarlar */}
        <Section title="Genel Site Ayarları" icon={BuildingOfficeIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Site Adı (Logo Metni)</label>
              <input className="form-input" value={settings.siteName} onChange={e => set('siteName', e.target.value)} placeholder="Dore Adem" />
            </div>
            <div className="form-group">
              <label className="form-label">Site Sloganı</label>
              <input className="form-input" value={settings.siteTagline} onChange={e => set('siteTagline', e.target.value)} placeholder="Elegance in Every Detail" />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Site Açıklaması (Meta SEO)</label>
              <textarea className="form-textarea" value={settings.siteDescription} onChange={e => set('siteDescription', e.target.value)} rows={2} placeholder="SEO meta açıklaması..." />
            </div>
            <div className="form-group">
              <label className="form-label">Ücretsiz Kargo Limiti (₺)</label>
              <div className="relative">
                <input type="number" className="form-input pl-10" value={settings.freeShippingThreshold} onChange={e => set('freeShippingThreshold', +e.target.value)} />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₺</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Duyuru Bandı */}
        <Section title="Üst Duyuru Bandı" icon={MegaphoneIcon}>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-max">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.announcementEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.announcementEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={settings.announcementEnabled} onChange={e => set('announcementEnabled', e.target.checked)} />
              <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900">Duyuru Bandını Göster</span>
            </label>
            
            <div className={`transition-opacity duration-300 ${settings.announcementEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="form-group">
                <label className="form-label">Duyuru Metni</label>
                <input className="form-input" value={settings.announcement} onChange={e => set('announcement', e.target.value)} placeholder="Özel Koleksiyonlarda %20 İndirim | Ücretsiz Kargo" />
              </div>
            </div>
          </div>
        </Section>

        {/* Hero Slider */}
        <Section title="Ana Sayfa Slaytları (Hero Slider)" icon={PhotoIcon}>
          <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
            Müşterileri karşılayan tam ekran görsel kaydırıcıyı yapılandırın. İdeal görsel boyutu yatay formattır.
          </p>
          
          <div className="space-y-6">
            {(settings.heroSlides || []).map((slide, i) => (
              <div key={slide._id || i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="inline-flex items-center gap-2 font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200">
                    Slayt <span className="text-indigo-600">{i + 1}</span>
                  </span>
                  <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button type="button" className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors" onClick={() => moveSlide(i, -1)} disabled={i === 0}><ArrowUpIcon className="w-4 h-4" /></button>
                    <div className="w-px bg-gray-200" />
                    <button type="button" className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors" onClick={() => moveSlide(i, 1)} disabled={i === settings.heroSlides.length - 1}><ArrowDownIcon className="w-4 h-4" /></button>
                    <div className="w-px bg-gray-200" />
                    <button type="button" className="p-2 hover:bg-red-50 text-red-500 transition-colors" onClick={() => removeSlide(i)}><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="form-group">
                    <label className="form-label">Büyük Başlık</label>
                    <input className="form-input" value={slide.title} onChange={e => updateSlide(i, 'title', e.target.value)} placeholder="Yeni Sezon Koleksiyonu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alt Başlık Açıklaması</label>
                    <input className="form-input" value={slide.subtitle} onChange={e => updateSlide(i, 'subtitle', e.target.value)} placeholder="Zamansız şıklığın yeni yorumu..." />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label flex justify-between">
                      Görsel URL
                      {slide.imageUrl && <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Görsel Yüklendi</span>}
                    </label>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input className="form-input mb-2" value={slide.imageUrl} onChange={e => updateSlide(i, 'imageUrl', e.target.value)} placeholder="https://..." />
                        <p className="text-[11px] text-gray-400 font-medium">* Görsel linkini yapıştırın veya doğrudan /uploads/... şeklinde relatif yol girin.</p>
                      </div>
                      <div className="w-24 h-16 rounded-lg bg-gray-200 border border-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {slide.imageUrl ? (
                          <img 
                            src={slide.imageUrl.startsWith('http') ? slide.imageUrl : `${API}${slide.imageUrl.startsWith('/') ? '' : '/'}${slide.imageUrl}`} 
                            alt="" className="w-full h-full object-cover" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : <PhotoIcon className="w-6 h-6 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Buton Metni</label>
                    <input className="form-input" value={slide.ctaText} onChange={e => updateSlide(i, 'ctaText', e.target.value)} placeholder="Keşfet" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Buton Hedef Linki</label>
                    <input className="form-input" value={slide.ctaLink} onChange={e => updateSlide(i, 'ctaLink', e.target.value)} placeholder="/kategori/tumu" />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label mb-3">Karartma Efekti (Yazı okunabilirliği için)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min={0} max={85} step={5} value={slide.overlay || 40} onChange={e => updateSlide(i, 'overlay', +e.target.value)}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <span className="w-12 text-center py-1 bg-white border border-gray-200 rounded text-sm font-bold text-gray-700">
                        %{slide.overlay || 40}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2" onClick={addSlide}>
              <PlusIcon className="w-5 h-5" />
              Yeni Slayt Ekle
            </button>
          </div>
        </Section>

        {/* Hakkımızda & İstatistikler */}
        <Section title="Ana Sayfa Hakkımızda & İstatistikler" icon={BuildingOfficeIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="form-group">
              <label className="form-label">Bölüm Başlığı</label>
              <input className="form-input" value={settings.aboutTitle} onChange={e => set('aboutTitle', e.target.value)} placeholder="Hikayemiz" />
            </div>
            <div className="form-group">
              <label className="form-label">Bölüm Alt Başlığı / Açıklama</label>
              <textarea className="form-textarea" value={settings.aboutSubtitle} onChange={e => set('aboutSubtitle', e.target.value)} rows={2} placeholder="Her çantada bir sanatçının emeği..." />
            </div>
          </div>

          <div className="space-y-4">
            <label className="form-label">İstatistikler (Etiketler ve Değerler)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(settings.stats || []).map((stat, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 relative group">
                  <button type="button" onClick={() => removeStat(i)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-200 z-10">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-3">
                    <input className="form-input text-xl font-bold text-center text-indigo-600 bg-white" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="500+" />
                    <input className="form-input text-xs text-center uppercase tracking-widest" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="El Yapımı Ürün" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addStat} className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                <PlusIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold font-sans uppercase tracking-widest">Yeni İstatistik</span>
              </button>
            </div>
          </div>
        </Section>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <Section title="İletişim & Footer" icon={PhoneIcon}>
            <div className="space-y-5">
              <div className="form-group">
                <label className="form-label">Müşteri Destek E-postası</label>
                <input type="email" className="form-input" value={settings.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="info@ornek.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Destek Telefonu</label>
                <input className="form-input" value={settings.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+90 555 000 00 00" />
              </div>
              <div className="form-group">
                <label className="form-label">Şirket Açık Adresi</label>
                <textarea className="form-textarea" value={settings.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Sipariş iadeleri ve iletişim için fiziksel adres..." />
              </div>
              <div className="form-group pt-4 border-t border-gray-100">
                <label className="form-label">Footer Marka Hakkında Yazısı</label>
                <textarea className="form-textarea" value={settings.footerText} onChange={e => set('footerText', e.target.value)} rows={3}
                  placeholder="En alt kısımda yer alan kısa hakkımızda yazısı..." />
              </div>
            </div>
          </Section>

          {/* Sosyal Medya */}
          <Section title="Sosyal Medya Bağlantıları" icon={ShareIcon}>
            <div className="space-y-4">
              {[
                { key: 'instagram', label: 'Instagram', color: 'text-pink-600', ph: 'https://instagram.com/...' },
                { key: 'facebook', label: 'Facebook', color: 'text-blue-600', ph: 'https://facebook.com/...' },
                { key: 'twitter', label: 'Twitter / X', color: 'text-gray-900', ph: 'https://twitter.com/...' },
                { key: 'pinterest', label: 'Pinterest', color: 'text-red-600', ph: 'https://pinterest.com/...' },
                { key: 'tiktok', label: 'TikTok', color: 'text-gray-900', ph: 'https://tiktok.com/@...' },
              ].map(({ key, label, color, ph }) => (
                <div key={key} className="form-group">
                  <label className={`form-label flex items-center gap-1.5 ${color}`}>
                    {label}
                  </label>
                  <input className="form-input" value={settings.socialMedia?.[key] || ''} onChange={e => setSocial(key, e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </form>
    </div>
  );
}

export default Settings;