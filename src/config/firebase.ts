import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Read Firebase config from Vite environment variables (VITE_ prefix)
// Provide fallback dummy values if env variables are missing to prevent top-level runtime crashes
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: apiKey && apiKey.trim() !== "" ? apiKey : "AIzaSyDummyKeyForDevelopmentOnly12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rvce-sip.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rvce-sip",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rvce-sip.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Safe Analytics initialization
(async () => {
  try {
    if (firebaseConfig.measurementId && (await isSupported())) {
      getAnalytics(app);
    }
  } catch (e) {
    // ignore analytics init errors
  }
})();

let authInstance: Auth;
try {
  authInstance = getAuth(app);
} catch (e) {
  console.warn("Firebase Auth initialization warning:", e);
  authInstance = {} as Auth;
}

let dbInstance: Firestore;
try {
  dbInstance = getFirestore(app);
} catch (e) {
  console.warn("Firestore initialization warning:", e);
  dbInstance = {} as Firestore;
}

let storageInstance: FirebaseStorage;
try {
  storageInstance = getStorage(app);
} catch (e) {
  console.warn("Firebase Storage initialization warning:", e);
  storageInstance = {} as FirebaseStorage;
}

export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
export const db = dbInstance;
export const storage = storageInstance;

