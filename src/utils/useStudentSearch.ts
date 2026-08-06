import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface StudentRecord {
  usn: string;
  name: string;
  venue: string;
  department?: string;
  reportingTime?: string;
  block?: string;
  slot1Time?: string;
  slot1Venue?: string;
  slot2Time?: string;
  slot2Venue?: string;
  slot3Time?: string;
  slot3Venue?: string;
  slot4Time?: string;
  slot4Venue?: string;
  slot5Time?: string;
  slot5Venue?: string;
  slot6Time?: string;
  slot6Venue?: string;
}

export function useStudentSearch() {
  const [result, setResult] = useState<StudentRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async (usn: string) => {
    if (!usn.trim()) {
      setResult(null);
      setNotFound(false);
      return;
    }
    setSearching(true);
    setNotFound(false);
    setResult(null);
    try {
      const ref = doc(db, "students", usn.trim().toUpperCase());
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setResult(snap.data() as StudentRecord);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const clear = () => {
    setResult(null);
    setNotFound(false);
  };

  return { result, searching, notFound, search, clear };
}