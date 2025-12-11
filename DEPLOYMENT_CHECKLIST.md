# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Changes
- [x] Updated email template URLs to use `FRONTEND_URL` environment variable
- [x] Created `.env.example` files for documentation
- [x] Verified `.gitignore` includes `.env` files

### Files to Review
- [ ] `server/src/index.js` - Email template uses dynamic URLs
- [ ] `server/.env.example` - All variables documented
- [ ] `client/.env.example` - API URL documented
- [ ] `.gitignore` - Environment files excluded

---

## 📦 GitHub Push

```bash
cd "/Users/pallavi/Documents/chat bot"
git add .
git commit -m "Configure for production deployment on Render"
git push origin main
```

---

## 🌐 Render Deployment Steps

### Step 1: Deploy Backend (5-10 minutes)
- [ ] Create new **Web Service** on Render
- [ ] Connect GitHub repo: `Admin-Xevyte/XevyTalk`
- [ ] Build command: `cd server && npm install`
- [ ] Start command: `cd server && npm start`
- [ ] Add environment variables (10 total):
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot`
  - [ ] `JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7`
  - [ ] `MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0`
  - [ ] `EMAIL_USER=admin@xevyte.com`
  - [ ] `EMAIL_PASS=figjfdnpaaygcfrj`
  - [ ] `FRONTEND_URL=` (leave empty for now, add after frontend deployment)
- [ ] Click **Create Web Service**
- [ ] **Copy backend URL**: ___________________________

### Step 2: Deploy Frontend (5-10 minutes)
- [ ] Create new **Static Site** on Render
- [ ] Connect GitHub repo: `Admin-Xevyte/XevyTalk`
- [ ] Build command: `cd client && npm install --include=dev && npm run build`
- [ ] Publish directory: `client/dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=` (paste backend URL from Step 1)
- [ ] Click **Create Static Site**
- [ ] **Copy frontend URL**: ___________________________

### Step 3: Update Backend with Frontend URL
- [ ] Go back to backend service on Render
- [ ] Environment tab → Add variable:
  - [ ] `FRONTEND_URL=` (paste frontend URL from Step 2)
- [ ] Save changes (auto-redeploys)

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Visit: `https://your-backend.onrender.com/api/users`
- [ ] Returns JSON (empty array is OK)
- [ ] No errors in response

### Frontend Tests
- [ ] Visit: `https://your-frontend.onrender.com`
- [ ] App loads without errors
- [ ] No console errors in browser DevTools

### Authentication Tests
- [ ] Can access login page
- [ ] Can login as `admin@xevyte.com`
- [ ] Dashboard loads after login

### Feature Tests
- [ ] Create new user from admin panel
- [ ] Check email delivery (welcome email)
- [ ] Send messages between users
- [ ] Upload file (image or document)
- [ ] Make voice/video call

### WebSocket Test
- [ ] Open DevTools → Network → WS tab
- [ ] See active WebSocket connection
- [ ] Status: "101 Switching Protocols"

---

## 🎯 Environment Variables Quick Copy

### Backend (Copy to Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://pallavih1313_db_user:i1XXFV7DEvdcIAgF@cluster0.zvxsfla.mongodb.net/chatbot
JWT_SECRET=b2f8e61c4c1a7d92e4c543fa91a0c7f1b8d2f3e4a6c7d8e9f0a1b2c3d4e5f6a7
MESSAGE_ENC_SECRET=f1a9c7e3b4d8029f5c6a3e8d9b7f1c4a6d3e2b8f7a9c0d4e5b6f1a2c3d8e9f0
EMAIL_USER=admin@xevyte.com
EMAIL_PASS=figjfdnpaaygcfrj
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (Copy to Render)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Common Issues

### Issue: "CORS Error"
**Fix:** Add `FRONTEND_URL` to backend environment variables

### Issue: "API Connection Failed"
**Fix:** Verify `VITE_API_URL` in frontend environment variables

### Issue: "WebSocket Not Connecting"
**Fix:** Ensure backend URL uses `https://` (not `http://`)

### Issue: "Calls Not Working"
**Fix:** Check TURN server configuration in `TURN_INTEGRATION_COMPLETE.md`

### Issue: "Email Not Sending"
**Fix:** Verify `EMAIL_USER` and `EMAIL_PASS` are correct (non-blocking, user creation still works)

---

## 📊 Deployment Timeline

| Step | Duration | Status |
|------|----------|--------|
| Code changes | 5 min | ⏳ |
| Git push | 1 min | ⏳ |
| Backend deploy | 5-10 min | ⏳ |
| Frontend deploy | 5-10 min | ⏳ |
| Update backend | 2 min | ⏳ |
| Testing | 10 min | ⏳ |
| **Total** | **~30-40 min** | |

---

## 🎉 Success Criteria

- ✅ Backend service shows "Live" status on Render
- ✅ Frontend site shows "Live" status on Render
- ✅ Can login as admin
- ✅ Can create users and send emails
- ✅ Can send messages
- ✅ Can upload files
- ✅ WebSocket connected
- ✅ No console errors

---

## 📞 Your Deployment URLs

**Backend:** https://_________________________________.onrender.com

**Frontend:** https://_________________________________.onrender.com

**Admin Login:**
- Email: `admin@xevyte.com`
- Password: (your password)

---

## 📚 Additional Resources

- Full guide: `DEPLOYMENT_GUIDE.md`
- TURN server setup: `TURN_INTEGRATION_COMPLETE.md`
- Render docs: `RENDER_DEPLOYMENT.md`
- Quick start: `QUICK_START_TURN.md`

---

*Last Updated: December 2025*
