# Chat Bot Desktop (Electron + React + Express + MongoDB)

Scalable real-time chat with:
- Direct 1:1 and Group chats (Socket.IO rooms)
- Typing indicator
- Message timestamps
- Delivery and Seen status
- **Audio & Video Calls** (WebRTC with TURN server support)
- File sharing with encryption
- End-to-end message encryption
- Electron desktop shell

## Tech
- Frontend: React + Vite + TailwindCSS
- Desktop: Electron
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB + Mongoose
- WebRTC: Peer-to-peer calls with STUN/TURN servers

## Dev Setup
1) Requirements: Node 18+, npm, MongoDB running locally or Atlas URI.
2) Install deps at project root:
   npm install
3) Configure environment:
   - Server: Copy `server/.env.example` to `server/.env` and configure MongoDB URI
   - Client: Copy `client/.env.example` to `client/.env` (optional, for custom TURN servers)
4) Start all (API, Vite, Electron):
   npm run dev

API: http://localhost:4000
Vite: http://127.0.0.1:5173

## WebRTC Call Configuration

The app includes TURN server support for reliable call connections. By default, it uses free public TURN servers suitable for testing.

**For production use**, configure your own TURN server in `client/.env`:

```bash
VITE_TURN_URL=turn:your-turn-server.com:3478
VITE_TURN_USERNAME=your-username
VITE_TURN_CREDENTIAL=your-password
```

See **[TURN_SERVER_SETUP.md](./TURN_SERVER_SETUP.md)** for detailed configuration guide.

## Build (desktop)
- Build client & server:
  npm run build
- Start packaged electron (loads built client):
  npm start

## Documentation
- **[TURN Server Setup Guide](./TURN_SERVER_SETUP.md)** - Complete guide for configuring TURN servers
- **[WebRTC Fix Summary](./WEBRTC_TURN_FIX.md)** - Quick reference for call connection improvements
- **[Features Implemented](./FEATURES_IMPLEMENTED.md)** - Full feature list

## Notes
- Audio/Video calls use WebRTC with automatic TURN fallback for NAT traversal
- Messages and files are encrypted at rest
- Admin features available for user management

