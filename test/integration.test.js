import { io } from 'socket.io-client';
import http from 'http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocket } from '../server/socket/socketHandler.js';
import apiRouter from '../server/routes/api.js';

async function runTestSuite() {
  console.log('🧪 Starting Dark Chat Integration Test Suite...\n');

  // 1. Setup ephemeral test server
  const app = express();
  app.use(express.json());
  app.use(apiRouter);

  const server = http.createServer(app);
  const serverIo = new SocketIOServer(server, { cors: { origin: '*' } });
  initializeSocket(serverIo);

  await new Promise((resolve) => server.listen(5099, resolve));
  console.log('✅ Test server listening on port 5099');

  const SERVER_URL = 'http://localhost:5099';

  // 2. Test REST Endpoints
  console.log('\n--- 1. Testing REST Endpoints ---');
  
  // Health
  const healthRes = await fetch(`${SERVER_URL}/health`);
  const healthData = await healthRes.json();
  if (healthData.status !== 'ok') throw new Error('Health check failed');
  console.log('✅ GET /health passed:', healthData.status);

  // Session generation
  const sessionRes = await fetch(`${SERVER_URL}/api/session/generate`);
  const sessionData = await sessionRes.json();
  if (!sessionData.data.userId || !sessionData.data.username) {
    throw new Error('Session generation failed');
  }
  console.log('✅ GET /api/session/generate passed:', sessionData.data.username);

  // Report
  const reportRes = await fetch(`${SERVER_URL}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reporterId: 'usr_test_1',
      reportedUserId: 'usr_test_2',
      roomId: 'room_test_123',
      reason: 'Harassment',
      details: 'Spamming repeatedly',
    }),
  });
  const reportData = await reportRes.json();
  if (!reportData.success) throw new Error('Report submission failed');
  console.log('✅ POST /api/report passed');

  // 3. Test Socket.IO Matchmaking & Messaging
  console.log('\n--- 2. Testing Socket.IO Matchmaking & Real-Time Flow ---');

  const clientA = io(SERVER_URL, { transports: ['websocket'] });
  const clientB = io(SERVER_URL, { transports: ['websocket'] });

  await Promise.all([
    new Promise((resolve) => clientA.on('connect', resolve)),
    new Promise((resolve) => clientB.on('connect', resolve)),
  ]);
  console.log('✅ Both test clients connected to Socket.IO');

  // Matchmaking test
  let clientAMatch = null;
  let clientBMatch = null;

  const matchPromise = new Promise((resolve) => {
    let matches = 0;
    clientA.on('match_found', (data) => {
      clientAMatch = data;
      matches++;
      if (matches === 2) resolve();
    });
    clientB.on('match_found', (data) => {
      clientBMatch = data;
      matches++;
      if (matches === 2) resolve();
    });
  });

  clientA.emit('find_match', { userId: 'user_a_123', username: 'ShadowWolf101' });
  clientB.emit('find_match', { userId: 'user_b_456', username: 'NeonPhantom202' });

  await matchPromise;
  console.log(`✅ Matchmaking succeeded! Room ID: ${clientAMatch.roomId}`);
  console.log(`   Client A matched with: ${clientAMatch.partner.username}`);
  console.log(`   Client B matched with: ${clientBMatch.partner.username}`);

  if (clientAMatch.roomId !== clientBMatch.roomId) {
    throw new Error('Room ID mismatch between matched users');
  }

  // Text message test
  console.log('\n--- 3. Testing Real-Time Text Messaging ---');
  const textPromise = new Promise((resolve) => {
    clientB.on('receive_message', (msg) => {
      if (msg.content === 'Hello from stranger A!' && msg.type === 'text') {
        resolve(msg);
      }
    });
  });

  clientA.emit('send_message', {
    roomId: clientAMatch.roomId,
    type: 'text',
    content: 'Hello from stranger A!',
  });

  const receivedText = await textPromise;
  console.log(`✅ Client B received text message: "${receivedText.content}"`);

  // Sticker message test
  console.log('\n--- 4. Testing Sticker Messaging ---');
  const stickerPromise = new Promise((resolve) => {
    clientA.on('receive_message', (msg) => {
      if (msg.content === 'stk_fire' && msg.type === 'sticker') {
        resolve(msg);
      }
    });
  });

  clientB.emit('send_message', {
    roomId: clientBMatch.roomId,
    type: 'sticker',
    content: 'stk_fire',
  });

  const receivedSticker = await stickerPromise;
  console.log(`✅ Client A received sticker: "${receivedSticker.content}" (${receivedSticker.type})`);

  // Typing indicator test
  console.log('\n--- 5. Testing Typing Indicator ---');
  const typingPromise = new Promise((resolve) => {
    clientB.on('partner_typing', () => {
      resolve();
    });
  });

  clientA.emit('typing', { roomId: clientAMatch.roomId });
  await typingPromise;
  console.log('✅ Client B received typing notification');

  // Moderation filter test (obfuscated severe harmful content)
  console.log('\n--- 6. Testing Server-Side Moderation Filter ---');
  const blockedPromise = new Promise((resolve) => {
    clientA.on('message_blocked', (data) => {
      resolve(data);
    });
  });

  // Try sending an obfuscated threat: "i w!ll k.i.l.l y0u"
  clientA.emit('send_message', {
    roomId: clientAMatch.roomId,
    type: 'text',
    content: 'i w!ll k.i.l.l y0u',
  });

  const blockedData = await blockedPromise;
  console.log('✅ Severe message successfully intercepted and blocked by server filter:');
  console.log(`   Warning: "${blockedData.warning}"`);

  // Casual profanity test (should NOT be blocked)
  console.log('\n--- 7. Testing Permissible Casual Profanity/Slang ---');
  const casualPromise = new Promise((resolve) => {
    clientB.on('receive_message', (msg) => {
      if (msg.content.includes('damn cool')) {
        resolve(msg);
      }
    });
  });

  clientA.emit('send_message', {
    roomId: clientAMatch.roomId,
    type: 'text',
    content: 'this app is damn cool bro',
  });

  const casualReceived = await casualPromise;
  console.log(`✅ Permissible casual conversation passed filter: "${casualReceived.content}"`);

  // Next partner flow test
  console.log('\n--- 8. Testing Next Partner & Disconnect Flow ---');
  const leftPromise = new Promise((resolve) => {
    clientB.on('partner_left', (data) => {
      resolve(data);
    });
  });

  clientA.emit('next_partner', { roomId: clientAMatch.roomId });
  const leftData = await leftPromise;
  console.log(`✅ Client B received partner_left notification: "${leftData.reason}"`);

  // Cleanup
  clientA.disconnect();
  clientB.disconnect();
  server.close();

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}

runTestSuite().catch((err) => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
