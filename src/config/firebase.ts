import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Read Firebase config from Vite environment variables (VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Initialize analytics only in supported browsers
(async () => {
  try {
    if (await isSupported() && firebaseConfig.measurementId) {
      getAnalytics();
    }
  } catch (e) {
    // ignore analytics init errors during SSR or unsupported environments
  }
})();

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore();
