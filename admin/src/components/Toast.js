import React, { useState, useCallback, useContext, createContext } from 'react';

// Toast Context
const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STYLES = {
  success: { bg: '#f0fdf4', border: '#10b981', color: '#065f46', icon: '#10b981' },
  error: { bg: '#fef2f2', border: '#ef4444', color: '#991b1b', icon: '#ef4444' },
  warning: { bg: '#fffbeb', border: '#f59e0b', color: '#92400e', icon: '#f59e0b' },
  info: { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af', icon: '#3b82f6' },
};

function ToastItem({ toast, onRemove }) {
  const s = STYLES[toast.type] || STYLES.info;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: s.bg, border: `1px solid ${s.border}`,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: 10, padding: '14px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        minWidth: 320, maxWidth: 420,
        animation: 'slideInRight 0.3s ease',
        position: 'relative',
      }}
    >
      <span style={{ color: s.icon, flexShrink: 0, marginTop: 1 }}>{ICONS[toast.type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: 14, color: s.color, marginBottom: 2 }}>{toast.title}</div>
        )}
        <div style={{ fontSize: 13, color: s.color, lineHeight: 1.4 }}>{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.color, opacity: 0.6, padding: 0, flexShrink: 0 }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, pointerEvents: 'none',
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
