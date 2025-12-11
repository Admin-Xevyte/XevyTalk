# 🔐 Environment Variables - Complete List

## 📊 Overview

This document lists ALL environment variables needed for deployment.

---

## 🖥️ BACKEND SERVICE (Render Web Service)

### Required Variables (7)

| # | Variable Name | Value | Description |
|---|---------------|-------|-------------|
| 1 | `NODE_ENV` | `production` | Sets Node.js to production mode |
| 2 | `PORT` | `10000` | Port for the server (Render default) |
| 3 | `MONGODB_URI` | `mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot` | MongoDB connection string |
| 4 | `JWT_SECRET` | `b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7` | Secret for JWT token signing |
| 5 | `MESSAGE_ENC_SECRET` | `f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0` | Secret for message encryption |
| 6 | `EMAIL_USER` | `admin@xevyte.com` | Gmail address for sending emails |
| 7 | `EMAIL_PASS` | `figjfdnpaaygcfrj` | Gmail app-specific password |

### Add After Frontend Deployment (1)

| # | Variable Name | Value | Description |
|---|---------------|-------|-------------|
| 8 | `FRONTEND_URL` | `https://your-frontend.onrender.com` | Frontend URL (add after Step 2) |

### Optional - Custom TURN Server (3)

| # | Variable Name | Example Value | Description |
|---|---------------|---------------|-------------|
| 9 | `TURN_SERVER_URL` | `turn:your-server.com:3478` | Custom TURN server URL |
| 10 | `TURN_USERNAME` | `your-username` | TURN server username |
| 11 | `TURN_PASSWORD` | `your-password` | TURN server password |

---

## 🌐 FRONTEND SERVICE (Render Static Site)

### Required Variables (1)

| # | Variable Name | Value | Description |
|---|---------------|-------|-------------|
| 1 | `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API URL (from Step 1) |

### Optional - Custom TURN Server (3)

| # | Variable Name | Example Value | Description |
|---|---------------|---------------|-------------|
| 2 | `VITE_TURN_SERVER_URL` | `turn:your-server.com:3478` | Custom TURN server URL |
| 3 | `VITE_TURN_USERNAME` | `your-username` | TURN server username |
| 4 | `VITE_TURN_PASSWORD` | `your-password` | TURN server password |

---

## 📋 Copy-Paste Format for Render

### Backend Environment Variables

**Step 1: Add these immediately when creating backend service:**

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot
JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7
MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0
EMAIL_USER=admin@xevyte.com
EMAIL_PASS=figjfdnpaaygcfrj
```

**Step 2: Add this AFTER frontend is deployed:**

```env
FRONTEND_URL=https://your-actual-frontend-url.onrender.com
```

### Frontend Environment Variables

**Add when creating frontend service:**

```env
VITE_API_URL=https://your-actual-backend-url.onrender.com
```

---

## 🎯 How to Add Environment Variables on Render

### For Web Service (Backend)

1. Go to your service on Render dashboard
2. Click **Environment** tab (left sidebar)
3. Click **Add Environment Variable**
4. Enter **Key** (e.g., `NODE_ENV`)
5. Enter **Value** (e.g., `production`)
6. Click **Save Changes**
7. Repeat for all variables

**OR** during service creation:

1. Click **Advanced** button
2. Click **Add Environment Variable**
3. Add all variables before creating service

### For Static Site (Frontend)

1. During creation, scroll to **Environment Variables**
2. Click **Add Environment Variable**
3. Enter **Key**: `VITE_API_URL`
4. Enter **Value**: Your backend URL
5. Continue with deployment

---

## ⚠️ Important Notes

### Security
- ✅ Never commit these values to Git
- ✅ Use Render's environment variables feature
- ✅ `.env` files are in `.gitignore`
- ✅ Only `.env.example` files are in Git (without real values)

### Email Configuration
- Gmail requires **App Password**, not regular password
- Get it from: Google Account → Security → 2-Step Verification → App passwords
- Current password `figjfdnpaaygcfrj` is already an app password

### MongoDB
- Connection string includes username and password
- Database name: `chatbot`
- Already configured to allow connections from anywhere (0.0.0.0/0)

### TURN Server
- **Optional** for now
- App uses free public TURN servers by default
- Add custom TURN server if calls don't work reliably
- See `TURN_SERVER_SETUP.md` for setup instructions

---

## 🔍 Verification

### Check Backend Variables
```bash
# After deployment, check logs for:
✓ MongoDB connected
✓ Email transporter configured
✓ Server listening on port 10000
```

### Check Frontend Variables
```bash
# In browser console:
console.log(import.meta.env.VITE_API_URL)
# Should show: https://your-backend.onrender.com
```

---

## 📊 Summary Table

| Service | Required Vars | Optional Vars | Total |
|---------|--------------|---------------|-------|
| Backend | 7 + 1 (later) | 3 | 8-11 |
| Frontend | 1 | 3 | 1-4 |
| **Total** | **9** | **6** | **9-15** |

---

## 🎯 Deployment Order

1. **Backend First** - Add 7 variables, deploy
2. **Frontend Second** - Add 1 variable (backend URL), deploy
3. **Update Backend** - Add 1 variable (frontend URL)
4. **Optional** - Add TURN server variables if needed

---

## ✅ Checklist

### Backend Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `JWT_SECRET=b2f8e61c4c1a...`
- [ ] `MESSAGE_ENC_SECRET=f1a9c7e3b4d8...`
- [ ] `EMAIL_USER=admin@xevyte.com`
- [ ] `EMAIL_PASS=figjfdnpaaygcfrj`
- [ ] `FRONTEND_URL=https://...` (add after frontend deploy)

### Frontend Variables
- [ ] `VITE_API_URL=https://...` (add backend URL)

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas allows connections from 0.0.0.0/0

### "CORS error"
- Verify `FRONTEND_URL` is set in backend
- Check frontend URL is correct

### "Email not sending"
- Verify `EMAIL_USER` and `EMAIL_PASS`
- Check Gmail app password is valid
- Note: Email is non-blocking, user creation still works

### "API connection failed"
- Verify `VITE_API_URL` in frontend
- Check backend service is running
- Ensure URL uses `https://`

---

*Keep this document handy during deployment!*

*Last Updated: December 11, 2025*
