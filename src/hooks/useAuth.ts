import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { ALLOWED_EMAILS } from "../config/allowedDeans";
import { EMERGENCY_PASSWORD } from "../config/emergencyAccess";


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
        return { ok: false, message: "Email not authorized" };
      }
    } catch (err: any) {
      setStatus("idle");
      return { ok: false, message: err?.message || String(err) };
    }
  };

  const loginWithPassword = async (pwd: string) => {
    setStatus("loading");
    if (pwd === EMERGENCY_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setStatus("authorized");
      setMethod("emergency");
      return { ok: true };
    }
    setStatus("unauthorized");
    return { ok: false, message: "Invalid password" };
  };
const logout = async () => {
  setStatus("checking"); // prevent flicker while signing out
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

  return { status, user, loginWithGoogle, loginWithPassword, logout, isAdmin, method };
}
