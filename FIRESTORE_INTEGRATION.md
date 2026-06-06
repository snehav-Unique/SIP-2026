# Firestore Real-Time Announcements Integration

## Overview
This document outlines the complete Firestore integration for the announcements system with real-time updates across all client browsers.

## Architecture

### Data Flow
```
Dean Posts → Firestore → onSnapshot fires → all student browsers update in real time
Dean Deletes → Firestore → onSnapshot fires → announcement disappears instantly
```

## Changes Made

### 1. Firebase Config (`src/config/firebase.ts`)
- Added Firestore import and initialization
- Exported `db` for use throughout the application

### 2. useAnnouncements Hook (`src/hooks/useAnnouncements.ts`)
- Replaced localStorage with Firestore `onSnapshot` listener
- Real-time updates automatically sync across all clients
- Handles loading and error states
- Falls back to default announcements on error

### 3. DeanPage Component (`src/pages/DeanPage.tsx`)
- Integrated Firestore for creating announcements (`addDoc`)
- Integrated Firestore for updating announcements (`updateDoc`)
- Integrated Firestore for deleting announcements (`deleteDoc`)
- Added loading and error state management
- Operations now use `serverTimestamp()` for consistency

### 4. AnnouncementsPage Component
- Already optimized to work with real-time data
- No changes needed - it automatically displays live updates

## Firestore Collection Structure

### Collection: `announcements`
```json
{
  "id": "auto-generated",
  "title": "First Year Orientation Program",
  "description": "Welcome session for all first-year students",
  "date": "2025-05-28",
  "time": "10:00 AM - 12:00 PM",
  "location": "Main Auditorium",
  "category": "Dean",
  "author": "Dean",
  "hasDocument": true,
  "documentUrl": null,
  "createdAt": "2025-05-20T10:30:00Z",
  "updatedAt": "2025-05-20T11:00:00Z"
}
```

## Setup Instructions

### Step 1: Enable Firestore in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Build" → "Firestore Database"
4. Click "Create Database"
5. Choose "Start in test mode" (for development)
6. Select your preferred location

### Step 2: Apply Security Rules
1. Go to Firestore Database → Rules tab
2. Replace existing rules with the content from `FIRESTORE_RULES.md`
3. Click "Publish"

### Step 3: Environment Variables
Ensure these variables are set in `.env` or `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 4: Set Up Dean Authentication
You have two options:

#### Option A: Using Firebase Custom Claims (Recommended)
1. Set up a Cloud Function to assign Dean role to authenticated users
2. Example Cloud Function (deploy via Firebase CLI):

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const assignDeanRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
  
  try {
    await admin.auth().setCustomUserClaims(context.auth.uid, { role: "dean" });
    return { success: true, message: "Dean role assigned" };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Error assigning role");
  }
});
```

#### Option B: Manual Assignment
Use Firebase CLI:
```bash
firebase auth:import users.json --hash-algo=bcrypt
```

## How It Works

### Creating an Announcement (Dean)
1. Dean fills out the form on DeanPage
2. Clicks "Create Announcement"
3. Data is sent to Firestore via `addDoc()`
4. `serverTimestamp()` is used for `createdAt`
5. onSnapshot immediately fires for all clients
6. All browsers update in real-time without page refresh

### Deleting an Announcement (Dean)
1. Dean clicks the delete button next to an announcement
2. Confirmation dialog appears
3. If confirmed, `deleteDoc()` is called
4. Firestore document is deleted
5. onSnapshot fires for all clients
6. Announcement disappears from all screens instantly

### Updating an Announcement (Dean)
1. Dean clicks edit button
2. Makes changes
3. Clicks "Save Changes"
4. `updateDoc()` is called with new data
5. `updatedAt` timestamp is updated
6. onSnapshot fires for all clients
7. Changes appear across all screens in real-time

### Viewing Announcements (Students)
1. Page loads and creates onSnapshot listener in useAnnouncements
2. Initial data loads from Firestore
3. Listener stays active and watches for changes
4. Any server changes are immediately synced to UI
5. No manual refresh needed

## Real-Time Features

✅ **Instant Create**: When a dean posts, students see it immediately  
✅ **Instant Update**: When a dean edits, all browsers reflect the change  
✅ **Instant Delete**: When a dean deletes, it vanishes from all screens  
✅ **No Page Refresh**: Changes propagate without user action  
✅ **Offline Support**: onSnapshot handles network issues gracefully  

## Testing Real-Time Updates

1. Open the app on two browsers (or tabs):
   - Tab 1: DeanPage (logged in as Dean)
   - Tab 2: AnnouncementsPage (student view)

2. Create a new announcement on Tab 1
   - Watch Tab 2 automatically display the new announcement

3. Edit the announcement on Tab 1
   - Watch Tab 2 instantly reflect the changes

4. Delete the announcement on Tab 1
   - Watch Tab 2 instantly remove it

## Troubleshooting

### Issue: Announcements don't appear
**Solution**: Check Firestore security rules - ensure collection is readable

### Issue: Create/Update/Delete fails silently
**Solution**: Check browser console for errors, verify Dean authentication

### Issue: Real-time updates not working
**Solution**: 
- Verify Firestore is running
- Check network connectivity
- Ensure onSnapshot listener is active in useAnnouncements

### Issue: Permission denied errors
**Solution**:
- Verify Firebase rules are correctly configured
- Check that user has Dean role (via custom claims)
- Test with test data in a different collection

## Production Checklist

- [ ] Firestore rules updated from test mode to production
- [ ] Environment variables set securely
- [ ] Dean authentication configured with custom claims
- [ ] Error handling tested
- [ ] Network failures tested
- [ ] Real-time updates tested across multiple devices
- [ ] Permissions verified for all user types
- [ ] Backup strategy implemented

## Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Real-time Listeners](https://firebase.google.com/docs/firestore/query-data/listen)
- [Custom Claims](https://firebase.google.com/docs/auth/admin-sdk-docs#setting_additional_claims_on_an_existing_user)
