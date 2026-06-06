// Firestore Security Rules
// Copy and paste the following rules into your Firebase Console
// Go to: Firestore Database → Rules → Replace with these rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads for announcements (public read)
    // Allow writes only for authenticated Dean users
    match /announcements/{id} {
      allow read: if true;                          // Anyone can read announcements
      allow create: if request.auth != null         // Only logged-in users
        && request.auth.token.role == "dean";       // Must have Dean role
      allow update, delete: if request.auth != null
        && request.auth.token.role == "dean";       // Only Dean can modify
    }
  }
}

// Implementation Steps:
// 1. Go to Firebase Console → Select your project
// 2. Go to Firestore Database → Rules tab
// 3. Replace all existing rules with the code above
// 4. Click "Publish"

// How to assign Dean role via Firebase Custom Claims:
// Use Firebase Admin SDK or Firebase Cloud Functions
// Example (Node.js):
// 
// const admin = require('firebase-admin');
// admin.auth().setCustomUserClaims(deanUID, {role: 'dean'})
//   .then(() => {
//     console.log('Dean role assigned');
//   });
