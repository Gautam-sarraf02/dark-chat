import React, { useEffect, useState } from 'react';
import { Radar, X, Sparkles, Shield, MessageSquare, Flame } from 'lucide-react';
import ConnectionBadge from '../components/ConnectionBadge';

const SEARCH_TIPS = [
  'Dark Chat has zero audio and video calls — enjoy stress-free text conversation.',
  'Click the sticker icon to send cool custom cyber and dark mode stickers!',
  'If a conversation becomes awkward or inactive, simply hit "Next" to find someone new.',
  'Your identity is 100% anonymous. No logs or identities are shared.',
  'All messages auto-expire and are removed within 24 hours.',
];

export default function MatchmakingPage({ onCancelSearch, status = 'searching', queuePosition = 1 }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % SEARCH_TIPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-md w-full mx-auto text-center space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
        
        {/* Connection status */}
        <div className="flex justify-center">
          <ConnectionBadge status={status} />
        </div>

        {/* Sonar Radar Animation */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Outer Ripple 1 */}
          <div className="absolute inset-0 rounded-full border border-neon-purple/30 animate-radar-ripple" />
          
          {/* Outer Ripple 2 */}
          <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-radar-ripple [animation-delay:1.2s]" />

          {/* Radar Ring 1 */}
          <div className="absolute w-36 h-36 rounded-full border border-white/10" />
          
          {/* Radar Ring 2 */}
          <div className="absolute w-24 h-24 rounded-full border border-neon-purple/20" />

          {/* Center Glowing Orb */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center shadow-neon-glow animate-pulse">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>

          {/* Rotating Radar Scanner line */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-sweep">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-neon-purple/40 to-transparent origin-bottom-right" />
          </div>
        </div>

        {/* Searching Status Text */}
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-white tracking-tight">
            Looking for someone...
          </h2>
          <p className="text-xs text-slate-400">
            Scanning the network for an available stranger to connect with.
          </p>
        </div>

        {/* Rotating Tip Card */}
        <div className="p-3.5 rounded-2xl bg-dark-850/80 border border-white/5 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed min-h-[36px] transition-opacity duration-300">
            {SEARCH_TIPS[tipIndex]}
          </p>
        </div>

        {/* Cancel Button */}
        <div>
          <button
            onClick={onCancelSearch}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-semibold transition-all focus:outline-none"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Cancel Search</span>
          </button>
        </div>

      </div>
    </div>
  );
}
