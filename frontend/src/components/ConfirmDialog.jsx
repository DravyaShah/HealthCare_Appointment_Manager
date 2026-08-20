import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, isDestructive = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'} mb-4`}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <button 
                    onClick={onCancel}
                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold font-display text-slate-100 mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {message}
                </p>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700/60"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                      isDestructive 
                        ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 shadow-cyan-500/20'
                    }`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
