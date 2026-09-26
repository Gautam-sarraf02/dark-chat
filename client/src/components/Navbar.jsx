import React, { useState } from 'react';
import { MessageSquare, Shield, Volume2, VolumeX, Users, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export default function Navbar({ currentUser, onlineStats, onNavigateHome }) {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isSoundEnabled());

  const handleToggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="w-full border-b border-white/[0.06] bg-dark-900/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 group focus:outline-none transition-transform active:scale-95 text-left"
          title="Dark Chat Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-violet flex items-center justify-center shadow-neon-purple/40 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight group-hover:text-neon-cyan transition-colors">
                Dark Chat
              </span>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              No Names. Just Conversations.
            </p>
          </div>
        </button>

        {/* Center / Right Metadata and Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Live Online Users Badge */}
          {onlineStats && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/80 border border-white/5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                <strong className="text-white font-semibold">{onlineStats.onlineUsers || 1}</strong> online
              </span>
            </div>
          )}

          {/* Current User Temporary Handle */}
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-xs text-slate-200">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              <span className="text-slate-400 hidden sm:inline">You:</span>
              <span className="font-medium text-slate-100 font-mono">
                {currentUser.username}
              </span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-dark-800/80 hover:bg-dark-750 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition-all focus:outline-none"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-neon-cyan" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Privacy Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800/50 border border-white/5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & Temporary</span>
          </div>

        </div>
      </div>
    </header>
  );
}
