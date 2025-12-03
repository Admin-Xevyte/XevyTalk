# Chat Bot Desktop (Electron + React + Express + MongoDB)

Scalable real-time chat with:
- Direct 1:1 and Group chats (Socket.IO rooms)
- Typing indicator
- Message timestamps
- Delivery and Seen status
- Electron desktop shell

## Tech
- Frontend: React + Vite + TailwindCSS
- Desktop: Electron
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB + Mongoose

## Dev Setup
1) Requirements: Node 18+, npm, MongoDB running locally or Atlas URI.
2) Install deps at project root:
   npm install
3) Optionally create server/.env from server/.env.example to override Mongo URI.
4) Start all (API, Vite, Electron):
   npm run dev

API: http://localhost:4000
Vite: http://127.0.0.1:5173

## Build (desktop)
- Build client & server:
  npm run build
- Start packaged electron (loads built client):
  npm start

## Notes
- New users are auto-added to a default "Lobby" group.
- Calls/Video buttons are placeholders marked "Coming soon".
