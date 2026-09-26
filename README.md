# Dark Chat

> **"Dark Chat — No Names. Just Conversations."**

Dark Chat is a modern, anonymous, text-only random chat web application where users can instantly connect with strangers worldwide without registering or creating an account. Designed with a privacy-first philosophy, Dark Chat features zero video/audio permissions, rich expressive sticker packs, real-time typing indicators, server-side content safety moderation, and 24-hour message self-destruction via MongoDB TTL indexes.

---

## ✨ Features

- **🎭 100% Anonymous & Ephemeral**:
  - No email, phone number, password, or profile registration required.
  - Generates temporary anonymous handles (e.g., `ShadowUser4821`, `NightFox7392`).
- **💬 Text & Stickers Only**:
  - Zero camera or microphone permission prompts.
  - Built-in sticker picker categorized into Reactions, Vibes, Dark Mode, Gestures, and Cyber.
- **⚡ Real-Time Socket.IO Matchmaking Engine**:
  - Instant pairing queue with live radar/sonar searching animations.
  - One-click **Next** button to seamlessly cycle to another stranger.
  - **End Chat** screen with immediate 1-click rematching.
- **🛡️ Server-Side Safety & Moderation**:
  - Normalizes obfuscated text (strips zero-width unicode, expands leetspeak, collapses repeated characters).
  - Blocks severe threats, illegal acts, and exploitation before transmission.
  - Unrestricted casual profanity and slang for natural conversation.
- **🚨 User Safety Controls**:
  - **Report System**: Categorized reporting (Harassment, Threats, Sexual content, Spam, Illegal activity) stored directly to MongoDB.
  - **Block System**: Instantly disconnects and permanently prevents rematching during the active session.
- **⏳ 24-Hour Message Self-Destruction**:
  - Powered by MongoDB TTL (Time-To-Live) index on `createdAt` (`expireAfterSeconds: 86400`).
- **📱 Responsive & Dark-Themed UI**:
  - Deep dark aesthetic (`#06070a`) with glowing neon violet and cyan accents.
  - Glassmorphic panels, smooth micro-interactions, and mobile touch-friendly layout.
  - Audio effects via Web Audio API with persistent mute toggle.

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** (Vite build toolchain)
- **Tailwind CSS** (Custom dark cyber palette & keyframe animations)
- **Lucide React** (Modern iconography)
- **Socket.IO Client** (Real-time bi-directional messaging)

### Backend
- **Node.js** (ES Modules)
- **Express.js** (REST API & static client serving)
- **Socket.IO** (WebSockets engine for queue, rooms, typing, and messaging)
- **Helmet & CORS** (Security headers & cross-origin policy)
- **Express Rate Limit** (Anti-spam protection)

### Database
- **MongoDB / MongoDB Atlas** (Mongoose ODM with 24h TTL expiration index)

---

## 📁 Project Structure

```text
darkchat/
├── client/                     # Frontend React (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BlockModal.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ConnectionBadge.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReportModal.jsx
│   │   │   ├── StickerPicker.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── pages/              # Flow screens
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MatchmakingPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── ChatEndedPage.jsx
│   │   ├── services/           # Socket & API service clients
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/              # Stickers catalog & sound FX
│   │   │   ├── soundEffects.js
│   │   │   └── stickers.js
│   │   ├── App.jsx             # Main state machine & flow controller
│   │   ├── index.css           # Global dark theme styles & glassmorphism
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend API & Socket Server
│   ├── config/
│   │   └── db.js               # MongoDB connection with resilient fallback
│   ├── middleware/
│   │   ├── errorHandler.js     # Safe error handler
│   │   └── rateLimiter.js      # REST rate limiter
│   ├── models/                 # Mongoose schemas
│   │   ├── Message.js          # 24h TTL Message model
│   │   ├── Report.js           # Abuse reports
│   │   ├── Room.js             # Chat rooms
│   │   └── Session.js          # Temporary anonymous sessions
│   ├── routes/
│   │   └── api.js              # REST endpoints (/health, /api/report, /api/block)
│   ├── socket/
│   │   ├── matchmaker.js       # Queue, pairing, exclusion & room lifecycle
│   │   └── socketHandler.js    # Socket.IO event router
│   ├── utils/
│   │   ├── moderation.js       # Text normalizer & safety filter
│   │   ├── sanitizer.js        # Input sanitizer & validator
│   │   └── usernameGenerator.js# Anonymous handle generator
│   ├── package.json
│   └── server.js               # Entry point
│
├── test/
│   └── integration.test.js     # Automated full-stack integration test suite
├── .env.example
├── .gitignore
├── package.json                # Root monorepo scripts
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string (local or MongoDB Atlas) | `mongodb://localhost:27017/darkchat` |
| `PORT` | Server listening port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS during development | `http://localhost:5173` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

---

## 🚀 Quick Start (Running Locally)

### 1. Install All Dependencies

```bash
npm run install-all
```

*(Or individually: `npm install`, `npm --prefix server install`, `npm --prefix client install`)*

### 2. Run in Development Mode

Run both the backend API and frontend Vite dev server concurrently with hot reloading:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API & Socket**: `http://localhost:5000`

### 3. Run Automated Integration Tests

To test Socket.IO matchmaking, real-time messaging, stickers, text moderation, typing events, and REST endpoints:

```bash
npm test
```

### 4. Build and Run Full-Stack Production Bundle

```bash
npm run build
npm start
```

Open `http://localhost:5000` in your browser.

---

## 🔌 Socket.IO Architecture & Flow

1. **Session Initializer**: User enters and receives a unique anonymous alias.
2. **`find_match`**: Enqueues user in the matchmaker. If another non-blocked user is waiting, a new `roomId` is minted and both users receive `match_found`.
3. **`send_message`**:
   - Sanitizes text and verifies payload length.
   - Runs server-side normalization filter (`checkContentSafety`).
   - If clean, emits `receive_message` to the room and writes to MongoDB with 24h TTL.
   - If flagged, emits `message_blocked` with warning back only to the sender.
4. **`typing` / `stop_typing`**: Broadcasts typing state to the partner.
5. **`next_partner`**: Gracefully terminates current room, informs stranger (`partner_left`), and re-enqueues the requester.
6. **`block_user`**: Appends target user to session blocklist and terminates the chat.

---

## ☁️ Deployment on Render

Dark Chat is fully pre-configured for Render deployment as a single **Web Service**.

### Option A: Unified Full-Stack Web Service (Recommended)

1. Push your repository to GitHub / GitLab.
2. Log in to [Render](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Configure the service settings:
   - **Name**: `dark-chat`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
5. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `PORT`: `10000` (Render will provide this automatically)
6. Click **Create Web Service**. Render will install dependencies, build the React SPA, and serve everything under a single secure HTTPS domain with WebSocket support enabled.

---

## 🔒 Safety, Privacy & Terms

- **Zero Logging of IP identities to clients**.
- **All messages automatically expire and are purged after 24 hours**.
- **No media streams, camera, or audio are ever accessed**.
- Dark Chat strictly forbids threats of violence, hate speech, minor exploitation, and illegal acts.
