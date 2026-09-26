import React from 'react';
import { MessageSquare, ShieldCheck, Sparkles, Zap, Lock, Smile, ArrowRight, EyeOff, Trash2 } from 'lucide-react';

export default function LandingPage({ onStartChat, currentUser, onlineStats }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl w-full mx-auto text-center space-y-8">
        
        {/* Top Tag & Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800/80 border border-neon-purple/30 text-xs text-purple-200 backdrop-blur-md shadow-neon-purple/10 shadow-sm animate-float">
          <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-medium">Instant 1-on-1 Anonymous Matchmaking</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span className="text-emerald-400 font-semibold">{onlineStats?.onlineUsers || 1} online</span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="space-y-4">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1]">
            Dark Chat
          </h1>
          <p className="font-display text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-purple-300 to-neon-cyan font-medium">
            No Names. Just Conversations.
          </p>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed pt-2">
            Talk to someone new. Stay anonymous. Keep the conversation simple. No accounts, no video, no audio — pure text and stickers.
          </p>
        </div>

        {/* Main CTA: Start Chatting Button */}
        <div className="pt-2 pb-4">
          <button
            onClick={onStartChat}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-neon-purple via-purple-600 to-neon-violet hover:from-purple-500 hover:to-neon-purple text-white font-display font-bold text-base sm:text-lg shadow-neon-glow hover:shadow-neon-purple/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>Start Chatting</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            
            {/* Subtle glow border */}
            <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-cyan opacity-40 blur group-hover:opacity-80 transition duration-300 -z-10"></span>
          </button>
          
          {currentUser && (
            <p className="text-xs text-slate-500 mt-3 font-mono">
              Assigned Handle: <span className="text-neon-cyan">{currentUser.username}</span>
            </p>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-6">
          
          {/* Card 1: 100% Anonymous */}
          <div className="p-5 rounded-2xl glass-panel hover:glass-panel-elevated transition-all duration-300 border border-white/5 hover:border-neon-purple/30 group">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple mb-3.5 group-hover:scale-110 transition-transform">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Zero Registration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No email, phone number, or password required. You are given a random temporary alias.
            </p>
          </div>

          {/* Card 2: Text & Stickers Only */}
          <div className="p-5 rounded-2xl glass-panel hover:glass-panel-elevated transition-all duration-300 border border-white/5 hover:border-neon-cyan/30 group">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-3.5 group-hover:scale-110 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Text & Stickers Only</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No invasive camera or microphone permissions. Express yourself with built-in stickers.
            </p>
          </div>

          {/* Card 3: 24h Auto Expiration */}
          <div className="p-5 rounded-2xl glass-panel hover:glass-panel-elevated transition-all duration-300 border border-white/5 hover:border-purple-400/30 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3.5 group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">24h Self-Destruct</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All messages automatically expire and vanish from our database after 24 hours.
            </p>
          </div>

          {/* Card 4: Safety & Controls */}
          <div className="p-5 rounded-2xl glass-panel hover:glass-panel-elevated transition-all duration-300 border border-white/5 hover:border-emerald-400/30 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Safety & Moderation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time threat filtering, instant one-click skipping, user blocking, and reporting.
            </p>
          </div>

        </div>

        {/* Small Safety Banner Footer */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Privacy-First Architecture
          </span>
          <span>•</span>
          <span>No Tracking Cookies</span>
          <span>•</span>
          <span>End-to-End Session Isolation</span>
        </div>

      </div>
    </div>
  );
}
