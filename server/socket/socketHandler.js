import { matchmaker } from './matchmaker.js';
import { checkContentSafety } from '../utils/moderation.js';
import { validateMessagePayload, sanitizeMessageContent } from '../utils/sanitizer.js';
import { Message } from '../models/Message.js';
import { Room } from '../models/Room.js';
import { Session } from '../models/Session.js';
import { getDBStatus } from '../config/db.js';

// Simple per-socket rate limiting (max 15 messages per 10 seconds)
const messageRateLimits = new Map();

function isRateLimited(socketId) {
  const now = Date.now();
  const windowMs = 10000;
  const maxMessages = 15;

  let record = messageRateLimits.get(socketId);
  if (!record) {
    record = { count: 1, resetAt: now + windowMs };
    messageRateLimits.set(socketId, record);
    return false;
  }

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return false;
  }

  record.count += 1;
  return record.count > maxMessages;
}

export function initializeSocket(io) {
  io.on('connection', (socket) => {
    // Send immediate online stats
    socket.emit('stats_update', matchmaker.getStats());

    // 1. REGISTER / INIT USER SESSION
    socket.on('init_user', async ({ userId, username }) => {
      socket.userId = userId;
      socket.username = username;

      // Update session in DB if available
      if (getDBStatus().connected && userId) {
        try {
          await Session.findOneAndUpdate(
            { userId },
            { username, socketId: socket.id, lastSeen: new Date() },
            { upsert: true }
          );
        } catch (err) {
          console.error('[Session Error]', err.message);
        }
      }
    });

    // 2. FIND MATCH
    socket.on('find_match', async ({ userId, username }) => {
      socket.userId = userId || socket.userId;
      socket.username = username || socket.username;

      if (!socket.userId) {
        socket.userId = `anon_${socket.id.slice(0, 8)}`;
      }
      if (!socket.username) {
        socket.username = `DarkUser${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Check if user is already in a room and leave it cleanly
      const currentRoom = matchmaker.getRoomBySocket(socket.id);
      if (currentRoom) {
        const partner = matchmaker.getPartner(currentRoom.roomId, socket.id);
        if (partner) {
          io.to(partner.socketId).emit('partner_left', {
            reason: 'Stranger is looking for a new conversation.',
          });
        }
        matchmaker.closeRoom(currentRoom.roomId);
        socket.leave(currentRoom.roomId);
      }

      const result = matchmaker.enqueueUser(socket.id, socket.userId, socket.username);

      if (result.matched) {
        const { room } = result;
        const sock1 = io.sockets.sockets.get(room.user1.socketId);
        const sock2 = io.sockets.sockets.get(room.user2.socketId);

        if (sock1) sock1.join(room.roomId);
        if (sock2) sock2.join(room.roomId);

        // Notify user 1
        io.to(room.user1.socketId).emit('match_found', {
          roomId: room.roomId,
          partner: {
            userId: room.user2.userId,
            username: room.user2.username,
          },
          matchedAt: room.createdAt,
        });

        // Notify user 2
        io.to(room.user2.socketId).emit('match_found', {
          roomId: room.roomId,
          partner: {
            userId: room.user1.userId,
            username: room.user1.username,
          },
          matchedAt: room.createdAt,
        });

        // Persist room record in MongoDB asynchronously
        if (getDBStatus().connected) {
          Room.create({
            roomId: room.roomId,
            user1: room.user1,
            user2: room.user2,
            status: 'active',
            createdAt: room.createdAt,
          }).catch((err) => console.error('[Room Save Error]', err.message));
        }

        io.emit('stats_update', matchmaker.getStats());
      } else {
        socket.emit('searching', {
          queuePosition: result.queueLength,
          message: 'Looking for someone to chat with...',
        });
        io.emit('stats_update', matchmaker.getStats());
      }
    });

    // 3. CANCEL SEARCH
    socket.on('cancel_search', () => {
      matchmaker.removeFromQueue(socket.id);
      socket.emit('search_cancelled');
      io.emit('stats_update', matchmaker.getStats());
    });

    // 4. SEND MESSAGE (Text or Sticker)
    socket.on('send_message', async (payload) => {
      const validation = validateMessagePayload(payload);
      if (!validation.valid) {
        socket.emit('message_error', { error: validation.error });
        return;
      }

      const { roomId, type, content } = payload;

      // Ensure socket is in this active room
      const activeRoom = matchmaker.getRoomBySocket(socket.id);
      if (!activeRoom || activeRoom.roomId !== roomId) {
        socket.emit('message_error', { error: 'You are no longer in this chat room.' });
        return;
      }

      // Check anti-flood rate limit
      if (isRateLimited(socket.id)) {
        socket.emit('message_error', {
          error: 'You are sending messages too fast. Please slow down.',
        });
        return;
      }

      let sanitizedContent = content;

      // Server-side text moderation
      if (type === 'text') {
        sanitizedContent = sanitizeMessageContent(content);
        const safetyCheck = checkContentSafety(sanitizedContent);

        if (!safetyCheck.isAllowed) {
          socket.emit('message_blocked', {
            warning: safetyCheck.reason,
            originalContent: content,
          });
          return;
        }
      }

      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        roomId,
        senderId: socket.userId || socket.id,
        senderUsername: socket.username || 'Anonymous',
        type,
        content: sanitizedContent,
        createdAt: new Date().toISOString(),
      };

      // Broadcast message to everyone in the room (both users)
      io.to(roomId).emit('receive_message', messageData);

      // Save to MongoDB asynchronously with 24h TTL
      if (getDBStatus().connected) {
        Message.create({
          roomId,
          senderId: messageData.senderId,
          senderUsername: messageData.senderUsername,
          type,
          content: sanitizedContent,
          createdAt: new Date(),
        }).catch((err) => console.error('[Message Save Error]', err.message));
      }
    });

    // 5. TYPING INDICATORS
    socket.on('typing', ({ roomId }) => {
      if (roomId) {
        socket.to(roomId).emit('partner_typing');
      }
    });

    socket.on('stop_typing', ({ roomId }) => {
      if (roomId) {
        socket.to(roomId).emit('partner_stop_typing');
      }
    });

    // 6. NEXT STRANGER
    socket.on('next_partner', ({ roomId }) => {
      const room = matchmaker.getRoomBySocket(socket.id);
      if (room && (!roomId || room.roomId === roomId)) {
        const partner = matchmaker.getPartner(room.roomId, socket.id);
        if (partner) {
          io.to(partner.socketId).emit('partner_left', {
            reason: 'Stranger skipped to the next chat.',
          });
        }

        if (getDBStatus().connected) {
          Room.updateOne(
            { roomId: room.roomId },
            { status: 'ended', endedAt: new Date() }
          ).catch((err) => console.error('[Room End Error]', err.message));
        }

        matchmaker.closeRoom(room.roomId);
        socket.leave(room.roomId);
      }

      // Automatically restart matchmaking for the user
      socket.emit('searching', {
        queuePosition: 1,
        message: 'Searching for your next match...',
      });

      const result = matchmaker.enqueueUser(socket.id, socket.userId, socket.username);
      if (result.matched) {
        const { room: newRoom } = result;
        const sock1 = io.sockets.sockets.get(newRoom.user1.socketId);
        const sock2 = io.sockets.sockets.get(newRoom.user2.socketId);

        if (sock1) sock1.join(newRoom.roomId);
        if (sock2) sock2.join(newRoom.roomId);

        io.to(newRoom.user1.socketId).emit('match_found', {
          roomId: newRoom.roomId,
          partner: {
            userId: newRoom.user2.userId,
            username: newRoom.user2.username,
          },
          matchedAt: newRoom.createdAt,
        });

        io.to(newRoom.user2.socketId).emit('match_found', {
          roomId: newRoom.roomId,
          partner: {
            userId: newRoom.user1.userId,
            username: newRoom.user1.username,
          },
          matchedAt: newRoom.createdAt,
        });

        if (getDBStatus().connected) {
          Room.create({
            roomId: newRoom.roomId,
            user1: newRoom.user1,
            user2: newRoom.user2,
            status: 'active',
            createdAt: newRoom.createdAt,
          }).catch((err) => console.error('[Room Save Error]', err.message));
        }
      }

      io.emit('stats_update', matchmaker.getStats());
    });

    // 7. END CHAT
    socket.on('end_chat', ({ roomId }) => {
      const room = matchmaker.getRoomBySocket(socket.id);
      if (room && (!roomId || room.roomId === roomId)) {
        const partner = matchmaker.getPartner(room.roomId, socket.id);
        if (partner) {
          io.to(partner.socketId).emit('partner_left', {
            reason: 'Stranger has ended the chat.',
          });
        }

        if (getDBStatus().connected) {
          Room.updateOne(
            { roomId: room.roomId },
            { status: 'ended', endedAt: new Date() }
          ).catch((err) => console.error('[Room End Error]', err.message));
        }

        matchmaker.closeRoom(room.roomId);
        socket.leave(room.roomId);
      }

      socket.emit('chat_ended_ack');
      io.emit('stats_update', matchmaker.getStats());
    });

    // 8. BLOCK USER
    socket.on('block_user', ({ targetUserId, roomId }) => {
      if (socket.userId && targetUserId) {
        matchmaker.blockUser(socket.userId, targetUserId);
      }

      const room = matchmaker.getRoomBySocket(socket.id);
      if (room && (!roomId || room.roomId === roomId)) {
        const partner = matchmaker.getPartner(room.roomId, socket.id);
        if (partner) {
          io.to(partner.socketId).emit('partner_left', {
            reason: 'Stranger has left the conversation.',
          });
        }

        if (getDBStatus().connected) {
          Room.updateOne(
            { roomId: room.roomId },
            { status: 'ended', endedAt: new Date() }
          ).catch((err) => console.error('[Room End Error]', err.message));
        }

        matchmaker.closeRoom(room.roomId);
        socket.leave(room.roomId);
      }

      socket.emit('user_blocked_ack', {
        message: 'User blocked. You will not be matched with them again.',
      });
      io.emit('stats_update', matchmaker.getStats());
    });

    // 9. DISCONNECT
    socket.on('disconnect', () => {
      messageRateLimits.delete(socket.id);
      matchmaker.removeFromQueue(socket.id);

      const room = matchmaker.getRoomBySocket(socket.id);
      if (room) {
        const partner = matchmaker.getPartner(room.roomId, socket.id);
        if (partner) {
          io.to(partner.socketId).emit('partner_left', {
            reason: 'Stranger has disconnected.',
          });
        }

        if (getDBStatus().connected) {
          Room.updateOne(
            { roomId: room.roomId },
            { status: 'ended', endedAt: new Date() }
          ).catch((err) => console.error('[Room End Error]', err.message));
        }

        matchmaker.closeRoom(room.roomId);
      }

      io.emit('stats_update', matchmaker.getStats());
    });
  });
}
