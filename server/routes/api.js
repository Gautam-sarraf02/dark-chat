import express from 'express';
import { Report } from '../models/Report.js';
import { getDBStatus } from '../config/db.js';
import { matchmaker } from '../socket/matchmaker.js';
import { generateAnonymousUsername } from '../utils/usernameGenerator.js';
import { reportLimiter } from '../middleware/rateLimiter.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const db = getDBStatus();
  const stats = matchmaker.getStats();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      connected: db.connected,
      state: db.readyState === 1 ? 'connected' : 'disconnected',
    },
    liveStats: stats,
    version: '1.0.0',
  });
});

/**
 * Anonymous session initialization
 */
router.get('/api/session/generate', (req, res) => {
  const userId = `usr_${crypto.randomBytes(6).toString('hex')}`;
  const username = generateAnonymousUsername();

  res.status(200).json({
    success: true,
    data: {
      userId,
      username,
    },
  });
});

/**
 * Report a user
 */
router.post('/api/report', reportLimiter, async (req, res) => {
  try {
    const { reporterId, reportedUserId, roomId, reason, details } = req.body;

    if (!reporterId || !reportedUserId || !roomId || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required report fields (reporterId, reportedUserId, roomId, reason).',
      });
    }

    const validReasons = [
      'Harassment',
      'Threats',
      'Sexual content',
      'Spam',
      'Illegal/harmful content',
      'Other',
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid report reason specified.',
      });
    }

    // Save report to database if connected
    if (getDBStatus().connected) {
      await Report.create({
        reporterId,
        reportedUserId,
        roomId,
        reason,
        details: typeof details === 'string' ? details.slice(0, 1000) : '',
        createdAt: new Date(),
      });
    } else {
      console.warn('[Report In-Memory Log]', { reporterId, reportedUserId, roomId, reason, details });
    }

    // Automatically add to in-memory blocklist so they don't get matched again
    matchmaker.blockUser(reporterId, reportedUserId);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Thank you for keeping Dark Chat safe.',
    });
  } catch (error) {
    console.error('[Report Submission Error]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record report. Please try again.',
    });
  }
});

/**
 * Block a user (REST fallback)
 */
router.post('/api/block', (req, res) => {
  const { userId, targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({
      success: false,
      error: 'Both userId and targetUserId are required to block.',
    });
  }

  matchmaker.blockUser(userId, targetUserId);

  res.status(200).json({
    success: true,
    message: 'User blocked successfully for this session.',
  });
});

export default router;
