import React from 'react';
import { UserX, AlertCircle, X } from 'lucide-react';

export default function BlockModal({ isOpen, onClose, onConfirmBlock, strangerUsername = 'Stranger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Block {strangerUsername}?
            </h3>
            <p className="text-xs text-slate-400">
              Instant separation and rematch exclusion.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 text-xs text-slate-300 space-y-2 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span>
                Blocking will <strong>immediately disconnect</strong> this conversation and prevent you from ever being matched with this stranger again during your session.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmBlock();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all focus:outline-none"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Block & End Chat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
