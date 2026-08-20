import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const TOAST_STYLES = {
  success: 'bg-slate-900/95 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10 shadow-2xl backdrop-blur-xl',
  error: 'bg-slate-900/95 border-rose-500/30 text-rose-300 shadow-rose-500/10 shadow-2xl backdrop-blur-xl',
  info: 'bg-slate-900/95 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10 shadow-2xl backdrop-blur-xl',
  warning: 'bg-slate-900/95 border-amber-500/30 text-amber-300 shadow-amber-500/10 shadow-2xl backdrop-blur-xl',
};

const ICON_STYLES = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  info: 'text-cyan-400',
  warning: 'text-amber-400',
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback({
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  }, [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = TOAST_ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${TOAST_STYLES[t.type]}`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${ICON_STYLES[t.type]}`} />
                <p className="text-xs font-semibold flex-1 leading-relaxed text-slate-200">{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-white transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
