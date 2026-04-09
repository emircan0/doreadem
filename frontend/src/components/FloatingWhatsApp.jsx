import React from 'react';

const FloatingWhatsApp = () => {
  const whatsappNumber = "+905551234567"; 
  const defaultMessage = "Merhaba, siparişimle ilgili bilgi almak istiyorum.";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[200] group flex items-center justify-center animate-fade-in-up"
      aria-label="WhatsApp Destek"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      
      {/* Tooltip for desktop */}
      <span className="absolute right-full mr-4 w-max bg-white text-lux-dark text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block border border-gray-100">
        Canlı Destek
      </span>

      <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-white">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.994 9.994 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.926-7.066A9.94 9.94 0 0012.012 2zm0 16.792h-.003a8.315 8.315 0 01-4.24-1.155l-.304-.18-3.155.805.84-3.076-.197-.313a8.334 8.334 0 01-1.272-4.48c0-4.582 3.73-8.312 8.316-8.313 2.22 0 4.307.865 5.877 2.435 1.57 1.57 2.434 3.657 2.434 5.877 0 4.583-3.73 8.312-8.315 8.312zm4.568-6.236c-.25-.125-1.482-.731-1.713-.814-.23-.084-.398-.125-.565.125-.168.25-.648.814-.794.981-.146.167-.293.188-.543.063-.25-.125-1.057-.39-2.014-1.248-.744-.667-1.246-1.492-1.392-1.742-.146-.25-.015-.385.11-.509.113-.112.25-.292.375-.438.125-.146.167-.25.25-.416.083-.167.042-.313-.021-.438-.063-.125-.565-1.363-.774-1.867-.203-.491-.41-.424-.565-.432-.146-.008-.313-.008-.48-.008-.167 0-.438.063-.667.313-.23.25-.875.855-.875 2.083 0 1.229.896 2.417 1.021 2.583.125.167 1.761 2.688 4.267 3.77.596.257 1.061.411 1.425.526.598.19 1.141.163 1.571.1.482-.07 1.482-.605 1.691-1.189.208-.584.208-1.084.146-1.189-.062-.105-.229-.167-.479-.292z"/>
        </svg>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
