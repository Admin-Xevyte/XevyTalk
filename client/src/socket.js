import { io } from 'socket.io-client'

export const createSocket = (token) => io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  auth: { token }
})
