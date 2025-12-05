# ✅ Latest Changes (Not Pushed to Git)

## 1. Group Admin Features 👑
- **Remove Members**: Admins can remove members from groups.
- **UI**: "Remove" button in Group Members list.
- **Server**: `POST /api/conversations/:id/remove-member`.

## 2. Improved Member Addition ➕
- **Smart Search**: Excludes existing members from search results.

## 3. Bug Fixes 🐛

### **Unread Counts (Fixed)**
- **Issue**: Unread counts were missing on load and stopped working later.
- **Fix**: 
  - **Server**: `GET /api/conversations` now returns `unreadCount`.
  - **Client**: Initializes unread badges from server data.
  - **Real-time**: Made `incrementUnread` logic robust to ensure badges update instantly.

### **Message Delivery & "Sent" Status (Fixed)**
- **Issue**: Messages remained "Sent" even if recipient was online.
- **Fix**: 
  - Ensured recipients join conversation rooms properly, even if the chat was previously hidden.
  - Added robust handling for message delivery events.

### **Online Status (Fixed)**
- **Issue**: Users appeared offline.
- **Fix**: Added server heartbeat to update status every minute.

### **Deleted Conversations (Fixed)**
- **Issue**: Hidden chats caused issues with new messages.
- **Fix**: Client now auto-restores hidden chats when new messages arrive.

---

## ⚠️ Important Note
These changes are currently **local only**. They have **not** been pushed to GitHub as requested.
