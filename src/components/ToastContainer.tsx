import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        let bgColor = 'bg-white border-slate-200 text-slate-800 shadow-lg';
        let Icon = Info;
        let iconColor = 'text-blue-600';

        if (toast.type === 'success') {
          bgColor = 'bg-white border-emerald-300 text-slate-800 shadow-lg shadow-emerald-500/10';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-600';
        } else if (toast.type === 'error') {
          bgColor = 'bg-white border-rose-300 text-slate-800 shadow-lg shadow-rose-500/10';
          Icon = AlertCircle;
          iconColor = 'text-rose-600';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-white border-amber-300 text-slate-800 shadow-lg shadow-amber-500/10';
          Icon = AlertTriangle;
          iconColor = 'text-amber-600';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-md transition-all duration-300 transform translate-y-0 ${bgColor}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="text-xs">
                <p className="font-bold text-slate-900 leading-snug">{toast.message}</p>
                {toast.khmerMessage && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{toast.khmerMessage}</p>
                )}
              </div>
            </div>
            <button
              id={`close-toast-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
