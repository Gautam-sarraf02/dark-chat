import React from 'react';
import { LogOut, RotateCcw, Home, Sparkles, MessageSquare } from 'lucide-react';

export default function ChatEndedPage({ onFindNewStranger, onNavigateHome, reason }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-neon-purple/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto text-center space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Disconnect Icon */}
        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center mx-auto text-rose-400 shadow-md">
          <LogOut className="w-8 h-8" />
        </div>

        {/* Title & Reason */}
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-white tracking-tight">
            Chat Ended
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {reason || 'The conversation has ended. Ready to talk to someone new?'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Find Someone New Button */}
          <button
            onClick={onFindNewStranger}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-violet hover:from-purple-500 hover:to-neon-purple text-white text-sm font-bold shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none"
          >
            <RotateCcw className="w-4 h-4 text-neon-cyan" />
            <span>Find Someone New</span>
          </button>

          {/* Return Home Button */}
          <button
            onClick={onNavigateHome}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-all focus:outline-none"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
