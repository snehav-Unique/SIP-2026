import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase project config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDBpkms__YjzaulhdiKav3qWtwXUk2fi30",
  authDomain: "sip-2026-154e0.firebaseapp.com",
  projectId: "sip-2026-154e0",
  storageBucket: "sip-2026-154e0.firebasestorage.app",
  messagingSenderId: "424700102194",
  appId: "1:424700102194:web:d2abfa2283808b4a105e2b",
  measurementId: "G-VXC9688NFC",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Initialize analytics only in browsers that support it
(async () => {
  try {
    if (await isSupported()) {
      getAnalytics();
    }
  } catch (e) {
    // ignore analytics init errors during SSR or unsupported environments
  }
})();

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
