import crypto from 'crypto';

class Matchmaker {
  constructor() {
    // Array of { socketId, userId, username, joinedAt }
    this.waitingQueue = [];
    
    // Map<roomId, { roomId, user1: { socketId, userId, username }, user2: { socketId, userId, username }, createdAt }>
    this.activeRooms = new Map();
    
    // Map<socketId, roomId>
    this.socketToRoom = new Map();
    
    // Map<userId, Set<blockedUserId>>
    this.userBlockList = new Map();
  }

  /**
   * Records a user block in-memory for the active session
   */
  blockUser(userId, targetUserId) {
    if (!userId || !targetUserId) return;
    if (!this.userBlockList.has(userId)) {
      this.userBlockList.set(userId, new Set());
    }
    this.userBlockList.get(userId).add(targetUserId);
  }

  /**
   * Checks if either user has blocked the other
   */
  hasBlocked(userIdA, userIdB) {
    if (!userIdA || !userIdB) return false;
    const blocksA = this.userBlockList.get(userIdA);
    const blocksB = this.userBlockList.get(userIdB);
    return Boolean(
      (blocksA && blocksA.has(userIdB)) ||
      (blocksB && blocksB.has(userIdA))
    );
  }

  /**
   * Adds a user to matchmaking queue and attempts to match
   */
  enqueueUser(socketId, userId, username) {
    // Remove if already in queue or old room
    this.removeFromQueue(socketId);
    
    const cleanUsername = username || `Anonymous_${socketId.slice(0, 4)}`;

    // Try to find an eligible partner from the queue
    for (let i = 0; i < this.waitingQueue.length; i++) {
      const candidate = this.waitingQueue[i];

      // Ensure not matching with oneself and neither has blocked the other
      if (
        candidate.socketId !== socketId &&
        candidate.userId !== userId &&
        !this.hasBlocked(userId, candidate.userId)
      ) {
        // Match found! Remove candidate from waiting queue
        this.waitingQueue.splice(i, 1);

        const roomId = `room_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        const roomData = {
          roomId,
          user1: {
            socketId: candidate.socketId,
            userId: candidate.userId,
            username: candidate.username,
          },
          user2: {
            socketId,
            userId,
            username: cleanUsername,
          },
          createdAt: new Date(),
        };

        this.activeRooms.set(roomId, roomData);
        this.socketToRoom.set(candidate.socketId, roomId);
        this.socketToRoom.set(socketId, roomId);

        return {
          matched: true,
          room: roomData,
        };
      }
    }

    // No match found yet: add to waiting queue
    this.waitingQueue.push({
      socketId,
      userId,
      username: cleanUsername,
      joinedAt: Date.now(),
    });

    return {
      matched: false,
      queueLength: this.waitingQueue.length,
    };
  }

  /**
   * Removes a socket from the waiting queue
   */
  removeFromQueue(socketId) {
    const index = this.waitingQueue.findIndex((item) => item.socketId === socketId);
    if (index !== -1) {
      this.waitingQueue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Gets the active room for a given socketId
   */
  getRoomBySocket(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;
    return this.activeRooms.get(roomId) || null;
  }

  /**
   * Gets the partner user for a given socket in a room
   */
  getPartner(roomId, socketId) {
    const room = this.activeRooms.get(roomId);
    if (!room) return null;
    if (room.user1.socketId === socketId) return room.user2;
    if (room.user2.socketId === socketId) return room.user1;
    return null;
  }

  /**
   * Closes an active room and cleans up socket mappings
   */
  closeRoom(roomId) {
    const room = this.activeRooms.get(roomId);
    if (!room) return null;

    this.socketToRoom.delete(room.user1.socketId);
    this.socketToRoom.delete(room.user2.socketId);
    this.activeRooms.delete(roomId);

    return room;
  }

  /**
   * Returns current statistics
   */
  getStats() {
    return {
      waiting: this.waitingQueue.length,
      activeRooms: this.activeRooms.size,
      onlineUsers: this.waitingQueue.length + this.activeRooms.size * 2,
    };
  }
}

export const matchmaker = new Matchmaker();
