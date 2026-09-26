import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'info', message } = toast;

  const icons = {
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <AlertCircle className="w-4 h-4 text-neon-cyan shrink-0" />,
  };

  const borders = {
    warning: 'border-amber-500/30 bg-dark-900/95 text-amber-200 shadow-amber-950/40',
    error: 'border-rose-500/30 bg-dark-900/95 text-rose-200 shadow-rose-950/40',
    success: 'border-emerald-500/30 bg-dark-900/95 text-emerald-200 shadow-emerald-950/40',
    info: 'border-neon-purple/30 bg-dark-900/95 text-slate-100 shadow-neon-purple/30',
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce">
      <div
        className={`flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl ${
          borders[type] || borders.info
        }`}
      >
        <div className="mt-0.5">{icons[type] || icons.info}</div>
        <div className="flex-1 text-xs leading-relaxed font-medium">{message}</div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
