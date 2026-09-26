import React, { useState, useEffect, useCallback } from 'react';
import { socket } from './services/socket';
import { fetchAnonymousSession } from './services/api';
import { soundFx } from './utils/soundEffects';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import MatchmakingPage from './pages/MatchmakingPage';
import ChatPage from './pages/ChatPage';
import ChatEndedPage from './pages/ChatEndedPage';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'searching' | 'chat' | 'ended'
  const [currentUser, setCurrentUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [onlineStats, setOnlineStats] = useState({ onlineUsers: 1, waiting: 0, activeRooms: 0 });
  const [chatEndReason, setChatEndReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // 1. Initialize user session on mount
  useEffect(() => {
    async function initSession() {
      // Check sessionStorage for existing temporary session
      const cached = sessionStorage.getItem('darkchat_user_session');
      if (cached) {
        try {
          const user = JSON.parse(cached);
          setCurrentUser(user);
          return;
        } catch (e) { }
      }

      // Fetch or generate fresh anonymous user session
      const newUser = await fetchAnonymousSession();
      sessionStorage.setItem('darkchat_user_session', JSON.stringify(newUser));
      setCurrentUser(newUser);
    }

    initSession();
  }, []);

  // 2. Connect and register socket listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function onConnect() {
      setConnectionStatus((prev) => (prev === 'searching' ? 'searching' : 'connected'));
      if (currentUser) {
        socket.emit('init_user', currentUser);
      }
    }

    function onDisconnect() {
      setConnectionStatus('disconnected');
    }

    function onStatsUpdate(stats) {
      if (stats) setOnlineStats(stats);
    }

    function onSearching() {
      setConnectionStatus('searching');
    }

    function onSearchCancelled() {
      setConnectionStatus('connected');
      setView('landing');
    }

    function onMatchFound(data) {
      soundFx.playMatchFound();
      setPartner(data.partner);
      setRoomId(data.roomId);
      setMessages([]);
      setIsPartnerTyping(false);
      setConnectionStatus('matched');
      setView('chat');
      showToast(`Connected with ${data.partner.username}!`, 'success');
    }

    function onReceiveMessage(message) {
      console.log("RECEIVED MESSAGE:", message.id, message.content);

      setMessages((prev) => [...prev, message]);

      if (message.senderId === currentUser?.userId) {
        soundFx.playMessageSent();
      } else {
        soundFx.playMessageReceived();
        setIsPartnerTyping(false);
      }
    }

    function onMessageBlocked(data) {
      soundFx.playChatEnded();
      showToast(data.warning || 'Message blocked by moderation filter.', 'warning');

      // Add local warning in message feed
      setMessages((prev) => [
        ...prev,
        {
          id: `warn_${Date.now()}`,
          type: 'warning',
          content: data.warning || 'Your message violated Dark Chat safety guidelines and was not sent.',
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    function onMessageError(data) {
      showToast(data.error || 'Failed to send message.', 'error');
    }

    function onPartnerTyping() {
      setIsPartnerTyping(true);
    }

    function onPartnerStopTyping() {
      setIsPartnerTyping(false);
    }

    function onPartnerLeft(data) {
      soundFx.playChatEnded();
      setIsPartnerTyping(false);
      setChatEndReason(data?.reason || 'Stranger has disconnected.');
      setView('ended');
      showToast(data?.reason || 'Stranger has left the chat.', 'info');
    }

    function onChatEndedAck() {
      soundFx.playChatEnded();
      setIsPartnerTyping(false);
      setChatEndReason('You ended the conversation.');
      setView('ended');
    }

    function onUserBlockedAck(data) {
      soundFx.playChatEnded();
      setIsPartnerTyping(false);
      setChatEndReason(data?.message || 'User blocked and chat ended.');
      setView('ended');
      showToast('Stranger blocked.', 'success');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('stats_update', onStatsUpdate);
    socket.on('searching', onSearching);
    socket.on('search_cancelled', onSearchCancelled);
    socket.on('match_found', onMatchFound);
    socket.on('receive_message', onReceiveMessage);
    socket.on('message_blocked', onMessageBlocked);
    socket.on('message_error', onMessageError);
    socket.on('partner_typing', onPartnerTyping);
    socket.on('partner_stop_typing', onPartnerStopTyping);
    socket.on('partner_left', onPartnerLeft);
    socket.on('chat_ended_ack', onChatEndedAck);
    socket.on('user_blocked_ack', onUserBlockedAck);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('stats_update', onStatsUpdate);
      socket.off('searching', onSearching);
      socket.off('search_cancelled', onSearchCancelled);
      socket.off('match_found', onMatchFound);
      socket.off('receive_message', onReceiveMessage);
      socket.off('message_blocked', onMessageBlocked);
      socket.off('message_error', onMessageError);
      socket.off('partner_typing', onPartnerTyping);
      socket.off('partner_stop_typing', onPartnerStopTyping);
      socket.off('partner_left', onPartnerLeft);
      socket.off('chat_ended_ack', onChatEndedAck);
      socket.off('user_blocked_ack', onUserBlockedAck);
    };
  }, [currentUser, showToast]);

  // Sync user identification when currentUser becomes available
  useEffect(() => {
    if (currentUser && socket.connected) {
      socket.emit('init_user', currentUser);
    }
  }, [currentUser]);

  // Handler: Start Chatting (Finding Match)
  const handleStartChat = () => {
    if (!currentUser) return;
    if (!socket.connected) socket.connect();

    setView('searching');
    setConnectionStatus('searching');
    socket.emit('find_match', currentUser);
  };

  // Handler: Cancel Matchmaking
  const handleCancelSearch = () => {
    socket.emit('cancel_search');
    setConnectionStatus('connected');
    setView('landing');
  };

  // Handler: Send Message
  const handleSendMessage = (text) => {
    if (!roomId || !text.trim()) return;
    socket.emit('send_message', {
      roomId,
      type: 'text',
      content: text,
    });
  };

  // Handler: Send Sticker
  const handleSendSticker = (stickerId) => {
    if (!roomId || !stickerId) return;
    socket.emit('send_message', {
      roomId,
      type: 'sticker',
      content: stickerId,
    });
  };

  // Handler: Next Partner
  const handleNextPartner = () => {
    if (!roomId) return;
    setMessages([]);
    setIsPartnerTyping(false);
    setView('searching');
    setConnectionStatus('searching');
    socket.emit('next_partner', { roomId });
  };

  // Handler: End Chat
  const handleEndChat = () => {
    if (roomId) {
      socket.emit('end_chat', { roomId });
    }
    setView('ended');
    setChatEndReason('You ended the conversation.');
  };

  // Handler: Block User
  const handleBlockUser = (targetUserId) => {
    if (!targetUserId) return;
    socket.emit('block_user', { targetUserId, roomId });
    setView('ended');
    setChatEndReason('Stranger blocked. You will not be matched again.');
  };

  // Handler: Typing Feedback
  const handleTyping = () => {
    if (roomId) socket.emit('typing', { roomId });
  };

  const handleStopTyping = () => {
    if (roomId) socket.emit('stop_typing', { roomId });
  };

  // Handler: Return Home
  const handleNavigateHome = () => {
    if (view === 'searching') {
      socket.emit('cancel_search');
    } else if (view === 'chat' && roomId) {
      socket.emit('end_chat', { roomId });
    }
    setView('landing');
    setConnectionStatus('connected');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-neon-purple selection:text-white font-sans">

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Persistent Navbar */}
      <Navbar
        currentUser={currentUser}
        onlineStats={onlineStats}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {view === 'landing' && (
          <LandingPage
            onStartChat={handleStartChat}
            currentUser={currentUser}
            onlineStats={onlineStats}
          />
        )}

        {view === 'searching' && (
          <MatchmakingPage
            onCancelSearch={handleCancelSearch}
            status={connectionStatus}
            queuePosition={onlineStats?.waiting || 1}
          />
        )}

        {view === 'chat' && (
          <ChatPage
            currentUser={currentUser}
            partner={partner}
            roomId={roomId}
            messages={messages}
            isPartnerTyping={isPartnerTyping}
            connectionStatus={connectionStatus}
            onSendMessage={handleSendMessage}
            onSendSticker={handleSendSticker}
            onNextPartner={handleNextPartner}
            onEndChat={handleEndChat}
            onBlockUser={handleBlockUser}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
          />
        )}

        {view === 'ended' && (
          <ChatEndedPage
            onFindNewStranger={handleStartChat}
            onNavigateHome={handleNavigateHome}
            reason={chatEndReason}
          />
        )}
      </main>

    </div>
  );
}
