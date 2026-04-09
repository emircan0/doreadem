import React from 'react';

const Contact = () => {
  const contactInfo = {
    address: 'Nişantaşı, Abdi İpekçi Cd. No:45, 34367 Şişli/İstanbul',
    phone: '+90 (212) 555 00 00',
    email: 'info@doreadem.com',
    hours: 'Pazartesi - Cumartesi: 09:00 - 19:00',
    mapUrl: 'https://images.unsplash.com/photo-1596432103440-42173c3a9681?q=80&w=2000&auto=format&fit=crop'
  };

  return (
    <div className="bg-lux-bg min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <span className="text-lux-accent text-[10px] font-bold tracking-mega-wide uppercase mb-6 block">BİZE ULAŞIN</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-lux-dark mb-8 leading-tight tracking-tight uppercase">
            Sizinle Tanışmak <br /> İçin Sabırsızlanıyoruz.
          </h1>
          <div className="w-24 h-px bg-lux-accent/30 mb-8"></div>
          <p className="text-lux-muted text-lg font-light leading-relaxed">
            Sorularınız, iş birliği teklifleriniz veya sadece merhaba demek için bizimle iletişime geçebilirsiniz. Nişantaşı'ndaki çiçek butiğimize bir kahveye bekleriz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Contact Details */}
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lux-accent text-[9px] font-bold tracking-mega-wide uppercase mb-6">ADRESİMİZ</h3>
                <p className="text-lux-dark text-lg font-light leading-relaxed">
                  {contactInfo.address}
                </p>
              </div>
              <div>
                <h3 className="text-lux-accent text-[9px] font-bold tracking-mega-wide uppercase mb-6">TELEFON</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-lux-dark text-lg font-light hover:text-lux-accent transition-colors duration-500">
                  {contactInfo.phone}
                </a>
              </div>
              <div>
                <h3 className="text-lux-accent text-[9px] font-bold tracking-mega-wide uppercase mb-6">E-POSTA</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-lux-dark text-lg font-light hover:text-lux-accent transition-colors duration-500">
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <h3 className="text-lux-accent text-[9px] font-bold tracking-mega-wide uppercase mb-6">MESAİ SAATLERİ</h3>
                <p className="text-lux-dark text-lg font-light">
                  {contactInfo.hours}
                </p>
              </div>
            </div>

            {/* Contact Form Placeholder/Sleek Form */}
            <div className="bg-white p-12 shadow-2xl border border-lux-dark/5">
              <h3 className="font-display text-2xl text-lux-dark mb-10 uppercase tracking-wide">MESAJ GÖNDERİN</h3>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input 
                    type="text" 
                    placeholder="ADINIZ SOYADINIZ" 
                    className="w-full bg-transparent border-b border-lux-dark/10 py-4 text-[10px] font-bold tracking-widest focus:outline-none focus:border-lux-accent transition-all uppercase"
                  />
                  <input 
                    type="email" 
                    placeholder="E-POSTA ADRESİNİZ" 
                    className="w-full bg-transparent border-b border-lux-dark/10 py-4 text-[10px] font-bold tracking-widest focus:outline-none focus:border-lux-accent transition-all uppercase"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="KONU" 
                  className="w-full bg-transparent border-b border-lux-dark/10 py-4 text-[10px] font-bold tracking-widest focus:outline-none focus:border-lux-accent transition-all uppercase"
                />
                <textarea 
                  rows="4" 
                  placeholder="MESAJINIZ" 
                  className="w-full bg-transparent border-b border-lux-dark/10 py-4 text-[10px] font-bold tracking-widest focus:outline-none focus:border-lux-accent transition-all uppercase resize-none"
                ></textarea>
                <button className="bg-lux-dark text-white px-12 py-5 text-[10px] font-bold tracking-ultra-wide uppercase hover:bg-lux-accent transition-all duration-700 shadow-xl active:scale-95">
                  MESAJI GÖNDER
                </button>
              </form>
            </div>
          </div>

          {/* Map/Image Side */}
          <div className="relative group">
            <div className="aspect-[3/4] overflow-hidden shadow-2xl">
              <img 
                src={contactInfo.mapUrl} 
                alt="Mağaza Konumu" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
              />
            </div>
            <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
               <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto shadow-2xl">
                  <i className="fas fa-map-marker-alt text-2xl text-lux-accent"></i>
               </div>
               <p className="text-white text-[10px] font-bold tracking-mega-wide uppercase shadow-sm">HARİTAYI AÇ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
