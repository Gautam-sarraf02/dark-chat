import React from 'react';

export default function TypingIndicator({ strangerUsername = 'Stranger' }) {
  return (
    <div className="flex items-center gap-2 py-2 px-4 rounded-2xl bg-dark-800/80 border border-white/5 backdrop-blur-md w-fit animate-fade-in shadow-sm">
      <div className="flex space-x-1.5 items-center">
        <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
      </div>
      <span className="text-xs text-slate-400 font-medium tracking-wide">
        <span className="text-slate-300 font-semibold">{strangerUsername}</span> is typing...
      </span>
    </div>
  );
}
