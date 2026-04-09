import React, { useEffect } from 'react';

const Drawer = ({ isOpen, onClose, title, children, width = 450 }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)', zIndex: 999,
          animation: 'fadeIn 0.2s ease-out'
        }} 
      />
      
      {/* Drawer Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: width, background: '#fff',
        zIndex: 1000, boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{title}</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: 8, background: '#f8fafc', border: 'none', borderRadius: 8,
              cursor: 'pointer', color: '#64748b', transition: '0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
          >
            <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
};

export default Drawer;
