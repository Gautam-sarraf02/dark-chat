import React, { useState, useRef, useEffect } from 'react';
import { STICKER_CATEGORIES, STICKERS } from '../utils/stickers';
import { X, Smile } from 'lucide-react';

export default function StickerPicker({ onSelectSticker, onClose }) {
  const [activeCategory, setActiveCategory] = useState('reactions');
  const pickerRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const filteredStickers = STICKERS.filter((s) => s.category === activeCategory);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-20 left-4 sm:left-6 z-50 w-[300px] sm:w-[340px] bg-dark-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-3 animate-fade-in flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 px-1">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-neon-purple" />
          <span className="text-xs font-semibold text-white tracking-wide">
            Stickers & Reactions
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
          title="Close picker"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all focus:outline-none ${
              activeCategory === cat.id
                ? 'bg-neon-purple text-white shadow-neon-purple/40 shadow-sm'
                : 'bg-dark-800 text-slate-400 hover:text-slate-200 hover:bg-dark-750'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => {
              onSelectSticker(sticker.id);
              onClose();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-dark-800/60 hover:bg-dark-700/80 border border-white/5 hover:border-neon-purple/40 hover:scale-105 transition-all focus:outline-none group"
            title={sticker.label}
          >
            <span className="text-2xl select-none group-hover:scale-110 transition-transform">
              {sticker.emoji}
            </span>
            <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[55px]">
              {sticker.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
