import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  SkipForward,
  LogOut,
  Flag,
  UserX,
  Sparkles,
  Shield,
  MessageSquare,
} from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import StickerPicker from '../components/StickerPicker';
import ReportModal from '../components/ReportModal';
import BlockModal from '../components/BlockModal';
import ConnectionBadge from '../components/ConnectionBadge';

export default function ChatPage({
  currentUser,
  partner,
  roomId,
  messages,
  isPartnerTyping,
  connectionStatus,
  onSendMessage,
  onSendSticker,
  onNextPartner,
  onEndChat,
  onBlockUser,
  onTyping,
  onStopTyping,
}) {
  const [inputText, setInputText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [roomId]);

  // Handle typing debounce
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (onTyping && val.trim().length > 0) {
      onTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) onStopTyping();
      }, 1500);
    } else if (onStopTyping && val.trim().length === 0) {
      onStopTyping();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (onStopTyping) onStopTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    onSendMessage(trimmed);
    setInputText('');
  };

  const handleSelectSticker = (stickerId) => {
    onSendSticker(stickerId);
    setShowStickerPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl w-full mx-auto px-2 sm:px-6 py-2 sm:py-4">
      
      {/* 1. CHAT HEADER BAR */}
      <div className="w-full glass-panel-elevated rounded-2xl px-4 py-3 border border-white/10 flex items-center justify-between gap-2 shadow-lg mb-2">
        
        {/* Stranger Info & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-violet flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="font-mono font-bold text-sm">
              {partner?.username ? partner.username.slice(0, 2).toUpperCase() : 'ST'}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-sm sm:text-base text-white truncate">
                {partner?.username || 'Stranger'}
              </h2>
              <ConnectionBadge status={connectionStatus} />
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden xs:block">
              Anonymous stranger matched
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Next Button */}
          <button
            onClick={onNextPartner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-purple/20 hover:bg-neon-purple/30 text-purple-200 border border-neon-purple/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none"
            title="Skip to next stranger"
          >
            <SkipForward className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden sm:inline">Next</span>
          </button>

          {/* End Chat Button */}
          <button
            onClick={onEndChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-white/5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none"
            title="End conversation"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">End</span>
          </button>

          {/* Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-amber-400 border border-white/5 transition-all focus:outline-none"
            title="Report stranger"
            aria-label="Report"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>

          {/* Block Button */}
          <button
            onClick={() => setShowBlockModal(true)}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-rose-400 border border-white/5 transition-all focus:outline-none"
            title="Block stranger"
            aria-label="Block"
          >
            <UserX className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* 2. MESSAGE FEED AREA */}
      <div className="flex-1 glass-panel rounded-2xl border border-white/5 p-4 overflow-y-auto relative flex flex-col space-y-1">
        
        {/* Welcome Notice Card */}
        <div className="p-4 rounded-2xl bg-dark-850/60 border border-white/5 text-center my-4 max-w-md mx-auto space-y-2">
          <div className="w-8 h-8 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white font-display">
            You're chatting with a stranger
          </h3>
          <p className="text-[11px] text-slate-400">
            Be kind, stay anonymous, and enjoy the conversation. You can send messages or stickers anytime.
          </p>
        </div>

        {/* Message Bubble List */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id || `${msg.createdAt}_${Math.random()}`}
            message={msg}
            isOwn={msg.senderId === currentUser?.userId}
            strangerUsername={partner?.username}
          />
        ))}

        {/* Typing Indicator */}
        {isPartnerTyping && (
          <div className="my-2">
            <TypingIndicator strangerUsername={partner?.username || 'Stranger'} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT DOCK */}
      <div className="relative mt-2">
        
        {/* Sticker Picker Popup */}
        {showStickerPicker && (
          <StickerPicker
            onSelectSticker={handleSelectSticker}
            onClose={() => setShowStickerPicker(false)}
          />
        )}

        <div className="glass-panel-elevated rounded-2xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2 shadow-2xl">
          
          {/* Sticker Picker Trigger */}
          <button
            type="button"
            onClick={() => setShowStickerPicker((prev) => !prev)}
            className={`p-2.5 rounded-xl transition-all focus:outline-none ${
              showStickerPicker
                ? 'bg-neon-purple text-white shadow-neon-purple/40 shadow-sm'
                : 'bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-white/5'
            }`}
            title="Open Stickers"
          >
            <Smile className="w-5 h-5 text-neon-cyan" />
          </button>

          {/* Textarea / Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${partner?.username || 'Stranger'}...`}
            maxLength={2000}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-violet hover:from-purple-500 hover:to-neon-purple text-white shadow-neon-purple/30 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none"
            title="Send message (Enter)"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* 4. MODALS */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reporterId={currentUser?.userId}
        reportedUserId={partner?.userId}
        roomId={roomId}
        onReportSuccess={() => {
          onBlockUser(partner?.userId);
        }}
      />

      <BlockModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirmBlock={() => {
          onBlockUser(partner?.userId);
        }}
        strangerUsername={partner?.username}
      />

    </div>
  );
}
