# Render Deployment Guide - Separate Server & Client

## 🚀 Deployment Architecture

Deploy **Server** and **Client** as separate services on Render:

1. **Backend Service** (Node.js/Express) - Handles API and WebSocket
2. **Frontend Service** (Static Site) - Serves the React app

---

## 📦 1. BACKEND SERVICE (Server)

### Service Type
**Web Service**

### Build & Start Commands

**Build Command:**
```bash
cd server && npm install
```

**Start Command:**
```bash
cd server && npm start
```

### Environment Variables

```
NODE_ENV=production
PORT=1000
MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot
JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7
MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0
EMAIL_USER=admin@xevyte.com
EMAIL_PASS=figjfdnpaaygcfrj
```

### Settings
- **Instance Type:** Free tier is fine for testing
- **Health Check Path:** `/api/users` (optional)
- **Auto-Deploy:** Yes (on git push)

---

## 🌐 2. FRONTEND SERVICE (Client)

### Service Type
**Static Site**

### Build Command:
```bash
cd client && npm install --include=dev && npm run build
```

### Publish Directory:
```
client/dist
```

### Environment Variables (for build-time)

```
VITE_API_URL=https://your-backend-service.onrender.com
```

**Important:** Replace `your-backend-service.onrender.com` with your actual backend service URL from Render.

### Settings
- **Auto-Deploy:** Yes (on git push)

---

## 📝 Step-by-Step Deployment

### Step 1: Deploy Backend

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository: `Admin-Xevyte/XevyTalk`
3. Configure:
   - **Name:** `xevytalk-backend` (or any name)
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** (leave empty)
4. Add all environment variables listed above
5. Click **Create Web Service**
6. Wait for deployment and **copy the service URL** (e.g., `https://xevytalk-backend.onrender.com`)

### Step 2: Deploy Frontend

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect your GitHub repository: `Admin-Xevyte/XevyTalk`
3. Configure:
   - **Name:** `xevytalk-frontend` (or any name)
   - **Build Command:** `cd client && npm install --include=dev && npm run build`
   - **Publish Directory:** `client/dist`
   - **Root Directory:** (leave empty)
4. Add environment variable:
   - `VITE_API_URL=https://xevytalk-backend.onrender.com` (use your actual backend URL)
5. Click **Create Static Site**
6. Wait for deployment

### Step 3: Update Backend CORS

After frontend is deployed, update backend CORS to allow your frontend URL:

1. Go to your backend service on Render
2. Add environment variable:
   ```
   FRONTEND_URL=https://xevytalk-frontend.onrender.com
   ```

Then update `server/src/index.js` to use this in allowedOrigins:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://xevytalk-frontend.onrender.com', // Your frontend URL
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];
```

---

## 🔧 Alternative: Single Build Script (If needed)

If you prefer a single build script, create `render-build-server.sh`:

```bash
#!/bin/bash
set -e
echo "=== Building Server for Render ==="
cd server
npm install
echo "=== Server build complete! ==="
```

And use it in backend service:
- **Build Command:** `bash ./render-build-server.sh`

---

## ✅ Verification

1. **Backend Health Check:**
   - Visit: `https://your-backend.onrender.com/api/users`
   - Should return JSON array of users

2. **Frontend:**
   - Visit your static site URL
   - Should load the chat app
   - Check browser console for API connection

3. **WebSocket:**
   - Open browser DevTools → Network → WS
   - Should see WebSocket connection to backend

---

## 🐛 Troubleshooting

### Backend Issues:
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure PORT environment variable is set

### Frontend Issues:
- Verify `VITE_API_URL` points to correct backend URL
- Check build logs for errors
- Ensure `client/dist` directory exists after build

### CORS Errors:
- Add frontend URL to backend `allowedOrigins`
- Check environment variables are set correctly

---

## 📌 Quick Reference

**Backend Service:**
- Type: Web Service
- Build: `cd server && npm install`
- Start: `cd server && npm start`
- Port: 1000 (or from env)

**Frontend Service:**
- Type: Static Site
- Build: `cd client && npm install --include=dev && npm run build`
- Publish: `client/dist`
- Env: `VITE_API_URL=https://your-backend.onrender.com`

