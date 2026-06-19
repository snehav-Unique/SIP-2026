import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { ALLOWED_EMAILS } from "../config/allowedDeans";

const EMERGENCY_PASSWORD =
  import.meta.env.VITE_EMERGENCY_PASSWORD || "rvce-sip-2026";

type Status = "idle" | "checking" | "loading" | "authorized" | "unauthorized";

export function useAuth() {
  const [status, setStatus] = useState<Status>("checking");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [method, setMethod] = useState<"google" | "emergency" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const isAdminLS = localStorage.getItem("isAdmin") === "true";
      if (u) {
        const email = u.email || "";
        if (ALLOWED_EMAILS.includes(email) || isAdminLS) {
          setStatus("authorized");
          setMethod("google");
          localStorage.setItem("isAdmin", "true");
        } else {
          setStatus("unauthorized");
          setMethod(null);
          localStorage.removeItem("isAdmin");
        }
      } else if (isAdminLS) {
        // emergency login persisted
        setStatus("authorized");
        setMethod("emergency");
      } else {
        setStatus("idle");
        setMethod(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setStatus("loading");
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      if (ALLOWED_EMAILS.includes(u.email || "")) {
        localStorage.setItem("isAdmin", "true");
        setStatus("authorized");
        setMethod("google");
        return { ok: true };
      } else {
        await signOut(auth);
        setStatus("unauthorized");
        return {
          ok: false,
          message:
            ALLOWED_EMAILS.length === 0
              ? "No allowed dean emails are configured in VITE_ALLOWED_DEANS."
              : "Email not authorized for dean access.",
        };
      }
    } catch (err: any) {
      setStatus("idle");
      return {
        ok: false,
        message:
          err?.code === "auth/popup-blocked"
            ? "Google sign-in popup was blocked by the browser."
            : err?.code === "auth/unauthorized-domain"
              ? "This host is not authorized in Firebase Authentication. Add your dev URL to Firebase authorized domains."
              : err?.message || String(err),
      };
    }
  };

  const loginWithEmergencyPassword = async (password: string) => {
    setStatus("loading");
    if (password === EMERGENCY_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setStatus("authorized");
      setMethod("emergency");
      return { ok: true };
    }

    setStatus("unauthorized");
    return { ok: false, message: "Emergency password is incorrect." };
  };

const logout = async () => {
  setStatus("checking");
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
  localStorage.removeItem("isAdmin");
  setStatus("idle");
  setMethod(null);
  setUser(null);
};

  const isAdmin = status === "authorized";
return {
  status,
  user,
  loginWithGoogle,
  loginWithEmergencyPassword,
  logout,
  isAdmin,
  method,
  allowedEmailsConfigured: ALLOWED_EMAILS.length > 0,
};
}
