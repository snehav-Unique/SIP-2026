# Firestore Real-Time Announcements - Quick Start

## What Changed?
Your announcements system now uses **Firestore** with **real-time updates**. When a dean posts, edits, or deletes an announcement, all student browsers see the change instantly without refreshing.

## Quick Setup (3 Steps)

### Step 1: Create Firestore Database
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Build** → **Firestore Database**
4. Click **Create Database**
5. Choose "Start in test mode"
6. Select location and create

### Step 2: Update Security Rules
1. In Firebase Console, go to **Firestore** → **Rules** tab
2. Copy all content from [FIRESTORE_RULES.md](./FIRESTORE_RULES.md)
3. Replace the existing rules
4. Click **Publish**

### Step 3: Verify Environment Variables
Check that `.env` or `.env.local` has these:
```
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
```

## How to Use

### For Deans (Creating/Editing/Deleting)
1. Open the **Dean Management Panel**
2. Click **New Announcement**
3. Fill in details using the **calendar picker** for date/time
4. Click **Create Announcement**
5. ✅ All students see it instantly!

To edit: Click the pencil icon  
To delete: Click the trash icon

### For Students (Viewing)
1. Open the **Announcements** page
2. Announcements load automatically
3. Filter by category if needed
4. Updates appear in real-time as deans post/edit/delete

## Real-Time Flow

```
Dean Action                    → Firestore              → All Browsers
─────────────────────────────────────────────────────────────────────
Creates announcement            → Document added         → Instant display
Edits announcement              → Document updated       → Instant update
Deletes announcement            → Document deleted       → Instant removal
```

## Testing Real-Time Updates

Open **two browser tabs**:
- Tab 1: http://localhost:5173/dean (Dean dashboard)
- Tab 2: http://localhost:5173/announcements (Student view)

Try:
1. Create announcement in Tab 1 → see it appear in Tab 2 instantly
2. Edit announcement in Tab 1 → see changes in Tab 2 instantly
3. Delete announcement in Tab 1 → see it disappear from Tab 2 instantly

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App doesn't load | Check env variables in `.env` |
| Can't create announcements | Verify Firestore rules are published |
| No real-time updates | Restart the dev server |
| "Permission denied" error | Check Firestore rules allow your user |

## Files Changed

- ✅ `src/config/firebase.ts` - Added Firestore initialization
- ✅ `src/hooks/useAnnouncements.ts` - Real-time listener setup
- ✅ `src/pages/DeanPage.tsx` - Firestore CRUD operations
- ✅ `src/data/announcements.ts` - Updated Announcement type
- ✅ `src/app/components/CalendarWithTime.tsx` - New calendar component

## What's Happening Behind the Scenes?

1. **useAnnouncements Hook**: 
   - Sets up an `onSnapshot` listener when component mounts
   - Automatically triggers whenever Firestore data changes
   - Returns live announcements array

2. **DeanPage Component**:
   - When creating: `addDoc()` → data sent to Firestore
   - When updating: `updateDoc()` → changes saved
   - When deleting: `deleteDoc()` → announcement removed
   - Uses `serverTimestamp()` for consistency across clients

3. **AnnouncementsPage Component**:
   - Receives announcements from `useAnnouncements`
   - Automatically re-renders when data changes
   - No special code needed - all changes happen automatically

## Next Steps

1. Deploy Firestore database
2. Set up Dean authentication (see [FIRESTORE_INTEGRATION.md](./FIRESTORE_INTEGRATION.md))
3. Test with real deans and students
4. Monitor Firestore usage in Firebase Console

## Questions?

Refer to:
- [FIRESTORE_INTEGRATION.md](./FIRESTORE_INTEGRATION.md) - Detailed setup guide
- [FIRESTORE_RULES.md](./FIRESTORE_RULES.md) - Security rules
- [Firebase Docs](https://firebase.google.com/docs/firestore) - Official documentation
