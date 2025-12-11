# 🚀 Complete Deployment Guide - GitHub & Render

## 📋 Table of Contents
1. [Environment Variables](#environment-variables)
2. [Required Changes Before Deployment](#required-changes)
3. [GitHub Setup](#github-setup)
4. [Render Deployment](#render-deployment)
5. [Post-Deployment Configuration](#post-deployment)
6. [Verification](#verification)

---

## 🔐 Environment Variables

### **SERVER Environment Variables (Backend)**

Add these to your Render backend service:

```env
# === REQUIRED ===
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot

# Security Keys
JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7
MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0

# Email Configuration (for user creation emails)
EMAIL_USER=admin@xevyte.com
EMAIL_PASS=figjfdnpaaygcfrj

# === IMPORTANT: Add after frontend deployment ===
FRONTEND_URL=https://your-frontend-app.onrender.com

# === OPTIONAL: TURN Server Configuration ===
# If you have a custom TURN server, add these:
# TURN_SERVER_URL=turn:your-turn-server.com:3478
# TURN_USERNAME=your-turn-username
# TURN_PASSWORD=your-turn-password
```

### **CLIENT Environment Variables (Frontend)**

Add these to your Render static site:

```env
# === REQUIRED ===
# Replace with your actual backend URL after backend deployment
VITE_API_URL=https://your-backend-app.onrender.com

# === OPTIONAL: Custom TURN Server ===
# If you have a custom TURN server, add these:
# VITE_TURN_SERVER_URL=turn:your-turn-server.com:3478
# VITE_TURN_USERNAME=your-turn-username
# VITE_TURN_PASSWORD=your-turn-password
```

---

## ⚙️ Required Changes Before Deployment

### 1. **Update Email Template URLs** (IMPORTANT!)

In `server/src/index.js`, update the email template to use your production frontend URL:

**Lines 253 and 256** - Change from:
```javascript
<a href="http://localhost:5173/login" class="button">Login to Account</a>
```

To:
```javascript
<a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login to Account</a>
```

**Full changes needed:**

```javascript
// Line 253 - Update button link
<a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login to Account</a>

// Line 256 - Update fallback link
<a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="color: #0891b2;">${process.env.FRONTEND_URL || 'http://localhost:5173'}/login</a>
```

### 2. **Create .env.example Files** (For documentation)

Create `server/.env.example`:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
MESSAGE_ENC_SECRET=your_message_encryption_secret_here
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-frontend-url.com
```

Create `client/.env.example`:
```env
VITE_API_URL=https://your-backend-url.com
```

### 3. **Verify .gitignore** (Already correct ✓)

Your `.gitignore` already includes:
```
.env
.env.local
.env.development
.env.production
```

---

## 📦 GitHub Setup

### Step 1: Commit All Changes

```bash
# Navigate to your project
cd "/Users/pallavi/Documents/chat bot"

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment - Add environment configs"

# Push to GitHub
git push origin main
```

### Step 2: Verify Repository

Make sure your repository is public or Render has access to it:
- Repository: `Admin-Xevyte/XevyTalk`
- Branch: `main` (or `master`)

---

## 🌐 Render Deployment

### **Option A: Separate Services (Recommended)**

Deploy backend and frontend as separate services for better performance and scalability.

#### **STEP 1: Deploy Backend Service**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository: `Admin-Xevyte/XevyTalk`
4. Configure:
   - **Name:** `xevytalk-backend` (or your choice)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add ALL server variables listed above:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot
   JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7
   MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0
   EMAIL_USER=admin@xevyte.com
   EMAIL_PASS=figjfdnpaaygcfrj
   ```

6. Click **Create Web Service**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://xevytalk-backend.onrender.com`)

#### **STEP 2: Deploy Frontend Service**

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect your GitHub repository: `Admin-Xevyte/XevyTalk`
3. Configure:
   - **Name:** `xevytalk-frontend` (or your choice)
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** `cd client && npm install --include=dev && npm run build`
   - **Publish Directory:** `client/dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://xevytalk-backend.onrender.com
   ```
   (Use your actual backend URL from Step 1)

5. Click **Create Static Site**
6. **Wait for deployment** (5-10 minutes)
7. **Copy your frontend URL** (e.g., `https://xevytalk-frontend.onrender.com`)

#### **STEP 3: Update Backend with Frontend URL**

1. Go back to your **backend service** on Render
2. Go to **Environment** tab
3. Add new environment variable:
   ```
   FRONTEND_URL=https://xevytalk-frontend.onrender.com
   ```
   (Use your actual frontend URL from Step 2)
4. Click **Save Changes**
5. Service will automatically redeploy

---

### **Option B: Single Service (Monolith)**

If you prefer a single service (not recommended for production):

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect repository: `Admin-Xevyte/XevyTalk`
3. Configure:
   - **Build Command:** `bash ./render-build.sh`
   - **Start Command:** `node server/src/index.js`
4. Add all environment variables from both server and client
5. The server will serve the built client from `client/dist`

---

## 🔧 Post-Deployment Configuration

### 1. **Update CORS Origins** (If needed)

Your server already has dynamic CORS, but verify in `server/src/index.js`:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://xevytalk-frontend.onrender.com', // Add your actual URL
  'http://localhost:5173',
  // ... other origins
].filter(Boolean);
```

### 2. **Test Email Functionality**

- Create a test user from admin panel
- Verify welcome email is sent with correct login URL

### 3. **Configure TURN Server** (For WebRTC Calls)

If calls don't work across different networks, you need a TURN server:

**Option 1: Use Free TURN Servers** (Already configured in client)
- Your app already uses public TURN servers
- Check `client/src/components/CallModal.jsx` for configuration

**Option 2: Use Custom TURN Server**
1. Set up your own TURN server (see `TURN_SERVER_SETUP.md`)
2. Add environment variables to both services:
   ```
   TURN_SERVER_URL=turn:your-server.com:3478
   TURN_USERNAME=your-username
   TURN_PASSWORD=your-password
   ```

---

## ✅ Verification Checklist

### Backend Health Check
- [ ] Visit: `https://your-backend.onrender.com/api/users`
- [ ] Should return JSON array (may be empty initially)
- [ ] No CORS errors in browser console

### Frontend Check
- [ ] Visit: `https://your-frontend.onrender.com`
- [ ] App loads without errors
- [ ] Can register/login as admin@xevyte.com
- [ ] Check browser console for errors

### WebSocket Connection
- [ ] Open browser DevTools → Network → WS tab
- [ ] Should see active WebSocket connection to backend
- [ ] Status should be "101 Switching Protocols"

### Full Feature Test
- [ ] Login as admin
- [ ] Create a new user (check email delivery)
- [ ] Send messages between users
- [ ] Upload files (images, documents)
- [ ] Make voice/video calls
- [ ] Test on different networks (WiFi, mobile data)

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** 
- Verify `FRONTEND_URL` is set in backend environment variables
- Check browser console for exact origin being blocked
- Add that origin to `allowedOrigins` array

### Issue: API Connection Failed
**Solution:**
- Verify `VITE_API_URL` is correct in frontend environment
- Check backend service is running (green status on Render)
- Test backend directly: `curl https://your-backend.onrender.com/api/users`

### Issue: WebSocket Not Connecting
**Solution:**
- Ensure backend URL uses `https://` (not `http://`)
- Check Socket.IO configuration in `server/src/index.js`
- Verify no firewall blocking WebSocket connections

### Issue: Calls Not Connecting
**Solution:**
- Check TURN server configuration
- Test with both users on same network first
- Review `TURN_INTEGRATION_COMPLETE.md` for detailed setup
- Use `test-turn-server.html` to verify TURN server

### Issue: Email Not Sending
**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Check Gmail app password is valid
- Review server logs for email errors
- Email sending is non-blocking, so user creation will succeed even if email fails

### Issue: MongoDB Connection Failed
**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows connections from Render IPs (0.0.0.0/0)
- Test connection string locally first

---

## 📊 Environment Variables Summary

### Backend (10 variables)
1. `NODE_ENV` - production
2. `PORT` - 10000
3. `MONGODB_URI` - Your MongoDB connection string
4. `JWT_SECRET` - Your JWT secret key
5. `MESSAGE_ENC_SECRET` - Message encryption key
6. `EMAIL_USER` - admin@xevyte.com
7. `EMAIL_PASS` - Your Gmail app password
8. `FRONTEND_URL` - Your frontend URL (add after frontend deployment)
9. `TURN_SERVER_URL` - (Optional) Custom TURN server
10. `TURN_USERNAME` - (Optional) TURN username
11. `TURN_PASSWORD` - (Optional) TURN password

### Frontend (1-4 variables)
1. `VITE_API_URL` - Your backend URL (REQUIRED)
2. `VITE_TURN_SERVER_URL` - (Optional) Custom TURN server
3. `VITE_TURN_USERNAME` - (Optional) TURN username
4. `VITE_TURN_PASSWORD` - (Optional) TURN password

---

## 🎯 Quick Deploy Commands

```bash
# 1. Update code with production URLs
# (Make the changes listed in "Required Changes" section)

# 2. Commit and push
git add .
git commit -m "Configure for production deployment"
git push origin main

# 3. Deploy on Render (follow steps above)
# 4. Add environment variables on Render dashboard
# 5. Test the deployment
```

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Dashboard → Service → Logs)
2. Review browser console for client-side errors
3. Test backend endpoints directly with curl/Postman
4. Refer to `TURN_INTEGRATION_COMPLETE.md` for call issues

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend:** `https://your-frontend.onrender.com`
- **Backend API:** `https://your-backend.onrender.com`

**Default Admin Login:**
- Email: `admin@xevyte.com`
- Password: (the one you set during registration)

---

*Last Updated: December 2025*
