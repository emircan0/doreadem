import React from 'react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-lux-bg min-h-screen pt-20">
      {/* Brand Heritage Section - Moved from Home */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Zanaatkarlık"
                  className="w-full h-full object-cover animate-ken-burns"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 hidden md:block w-64 aspect-square bg-white p-4 shadow-2xl z-10 transition-transform duration-700 hover:-translate-x-4 hover:-translate-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=500&auto=format&fit=crop" 
                  alt="Detay"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-lux-accent text-[10px] font-bold tracking-mega-wide uppercase mb-6 block">DOĞANIN ZERAFETİ</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-lux-dark mb-8 leading-tight tracking-tight uppercase">
                {settings?.aboutSubtitle || 'Her Çiçekte Bir Hikaye,\nHer Bukette Bir Duygu.'}
              </h1>
              <div className="w-20 h-px bg-lux-dark/10 mb-10"></div>
              <div className="space-y-8 text-lux-muted text-base md:text-lg font-light leading-relaxed max-w-xl">
                <p>
                  Dore Adem olarak, doğanın en taze ve en canlı renklerini sizin için bir araya getiriyoruz. Mevsimin en seçkin çiçeklerini, usta tasarımcılarımızın estetik dokunuşlarıyla birleştirerek sadece bir buket değil, unutulmaz anlar sunuyoruz.
                </p>
                <p>
                  Felsefemiz, çiçeklerin sadece bir hediye değil, kalpten kalbe kurulan en zarif köprü olduğu gerçeğine dayanır. Her bir aranjmanımız, özenle seçilen çiçeklerin uyum içinde dans ettiği bir sanat eseridir.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mt-16">
                {(settings?.stats || [['10K+', 'MUTLU AN'], ['15', 'YILLIK TECRÜBE'], ['50+', 'ÇİÇEK TÜRÜ']]).map((stat, idx) => {
                  const num = Array.isArray(stat) ? stat[0] : stat.value;
                  const label = Array.isArray(stat) ? stat[1] : stat.label;
                  return (
                    <div key={idx}>
                      <p className="font-display text-3xl text-lux-dark mb-2">{num}</p>
                      <p className="text-lux-accent text-[8px] font-bold tracking-mega-wide uppercase">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <span className="text-lux-accent text-[10px] font-bold tracking-mega-wide uppercase mb-6 block">DEĞERLERİMİZ</span>
            <h2 className="font-display text-4xl lg:text-5xl text-lux-dark mb-8 tracking-tight uppercase">Doğaya ve Sevgiye Olan Bağlılığımız</h2>
            <div className="w-20 h-px bg-lux-accent/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: 'TAZE VE CANLI',
                desc: 'Tüm çiçeklerimiz her sabah taptaze seçilir. Uzun ömürlü ve canlı aranjmanlar için en kaliteli bitki besinlerini kullanıyoruz.',
                icon: 'fa-leaf'
              },
              {
                title: 'SÜRDÜRÜLEBİLİRLİK',
                desc: 'Doğaya saygılı paketleme çözümleri ve yerel üreticileri destekleyen tedarik zincirimizle yarını yeşertiyoruz.',
                icon: 'fa-globe'
              },
              {
                title: 'ESTETİK TASARIM',
                desc: 'Klasik buketlerin ötesinde, modern ve sanatsal bakış açısıyla hazırlanmış benzersiz koleksiyonlar sunuyoruz.',
                icon: 'fa-spa'
              }
            ].map((value, idx) => (
              <div key={idx} className="group text-center">
                <div className="w-16 h-16 rounded-full border border-lux-accent/20 flex items-center justify-center mx-auto mb-8 group-hover:bg-lux-accent group-hover:scale-110 transition-all duration-700">
                  <i className={`fas ${value.icon} text-xl text-lux-accent group-hover:text-white transition-colors`}></i>
                </div>
                <h3 className="font-display text-xl text-lux-dark mb-4 uppercase tracking-wide">{value.title}</h3>
                <p className="text-lux-muted text-sm font-light leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="font-display text-4xl lg:text-6xl text-lux-dark mb-12 tracking-tight uppercase leading-tight italic">
                "Çiçekler, doğanın en güzel gülümsemesidir."
              </h2>
              <p className="text-lux-muted text-lg font-light leading-relaxed mb-8">
                Dore Adem, sadece bir çiçekçi değil, duyguların tercümanıdır. Bizim için her buket, sevdiklerinize söyleyemediğiniz o özel cümlenin bir parçasıdır.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop" 
                alt="Philosophy" 
                className="w-full h-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
