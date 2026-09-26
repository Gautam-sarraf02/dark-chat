import React from 'react';
import { getStickerById } from '../utils/stickers';
import { AlertTriangle, Info } from 'lucide-react';

export default function ChatMessage({ message, isOwn, strangerUsername }) {
  // 1. System Info or System Alert Message
  if (message.type === 'system' || message.type === 'warning') {
    const isWarning = message.type === 'warning';
    return (
      <div className="flex justify-center my-3 px-4">
        <div
          className={`flex items-center gap-2 max-w-md px-3.5 py-1.5 rounded-full text-xs font-medium text-center border backdrop-blur-md ${
            isWarning
              ? 'bg-rose-950/40 text-rose-300 border-rose-800/40 shadow-rose-950/30 shadow-sm'
              : 'bg-dark-800/60 text-slate-400 border-white/5'
          }`}
        >
          {isWarning ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-3.5 h-3.5 text-neon-purple shrink-0" />
          )}
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  // Format Time
  const timeFormatted = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // 2. Sticker Message
  if (message.type === 'sticker') {
    const stickerData = getStickerById(message.content);
    const displayEmoji = stickerData ? stickerData.emoji : message.content;
    const stickerLabel = stickerData ? stickerData.label : 'Sticker';

    return (
      <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-1.5 mb-1 px-1">
          <span className="text-[11px] font-medium text-slate-400">
            {isOwn ? 'You' : strangerUsername || message.senderUsername || 'Stranger'}
          </span>
          <span className="text-[10px] text-slate-600">•</span>
          <span className="text-[10px] text-slate-500">{timeFormatted}</span>
        </div>

        <div
          className={`relative p-3 rounded-2xl border backdrop-blur-md transition-all group ${
            isOwn
              ? 'bg-gradient-to-br from-neon-purple/20 to-neon-violet/30 border-neon-purple/30'
              : 'bg-dark-800/80 border-white/10'
          }`}
        >
          <div className="text-5xl group-hover:scale-110 transition-transform duration-200 select-none">
            {displayEmoji}
          </div>
          <div className="text-[10px] font-mono text-center text-slate-400 mt-1 opacity-80">
            {stickerLabel}
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Text Message
  return (
    <div className={`flex flex-col mb-3.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <span className="text-[11px] font-medium text-slate-400">
          {isOwn ? 'You' : strangerUsername || message.senderUsername || 'Stranger'}
        </span>
        <span className="text-[10px] text-slate-600">•</span>
        <span className="text-[10px] text-slate-500">{timeFormatted}</span>
      </div>

      <div
        className={`relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
          isOwn
            ? 'bg-gradient-to-r from-neon-violet to-neon-purple text-white rounded-tr-xs shadow-neon-purple/20 shadow-md font-normal'
            : 'bg-dark-800/90 text-slate-100 border border-white/[0.08] rounded-tl-xs backdrop-blur-md'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
