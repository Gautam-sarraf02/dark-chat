import React from 'react';
import { Wifi, WifiOff, Loader2, Sparkles } from 'lucide-react';

export default function ConnectionBadge({ status = 'connected' }) {
  const configs = {
    connected: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-400',
      text: 'Connected',
      icon: <Wifi className="w-3.5 h-3.5" />,
    },
    searching: {
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      dot: 'bg-amber-400 animate-ping',
      text: 'Searching',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    matched: {
      color: 'bg-neon-purple/15 text-purple-300 border-neon-purple/30 shadow-neon-purple/20 shadow-sm',
      dot: 'bg-neon-cyan animate-pulse',
      text: 'Matched',
      icon: <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />,
    },
    disconnected: {
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
      text: 'Disconnected',
      icon: <WifiOff className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || configs.connected;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium backdrop-blur-md transition-all duration-300 ${current.color}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span className="flex items-center gap-1.5">
        {current.icon}
        <span>{current.text}</span>
      </span>
    </div>
  );
}
