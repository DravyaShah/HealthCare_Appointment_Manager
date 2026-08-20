import { AlertCircle, X } from 'lucide-react';

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 backdrop-blur-xl p-4 mb-6 shadow-xl flex items-start">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-rose-400" aria-hidden="true" />
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">System Alert</h3>
        <div className="mt-0.5 text-xs text-rose-200/90 leading-relaxed">
          <p>{message}</p>
        </div>
      </div>
      {onDismiss && (
        <div className="ml-auto pl-3">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex rounded-xl p-1.5 text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorBanner;
