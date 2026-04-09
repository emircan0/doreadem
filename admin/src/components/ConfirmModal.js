import React from 'react';

/**
 * Reusable Confirm Modal
 * Props: isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, danger
 */
function ConfirmModal({ isOpen, title = 'Emin misiniz?', message, onConfirm, onCancel, confirmText = 'Evet, Devam Et', cancelText = 'İptal', danger = true }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9000, backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: '32px 28px', width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        animation: 'scaleIn 0.2s ease',
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {danger ? (
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg style={{ width: 22, height: 22, color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg style={{ width: 22, height: 22, color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
          </div>
          {message && (
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{message}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: '0.15s',
            }}
            onMouseOver={e => e.target.style.background = '#f9fafb'}
            onMouseOut={e => e.target.style.background = '#fff'}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: danger ? '#ef4444' : '#6366f1',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: '0.15s',
            }}
            onMouseOver={e => e.target.style.opacity = '0.85'}
            onMouseOut={e => e.target.style.opacity = '1'}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
