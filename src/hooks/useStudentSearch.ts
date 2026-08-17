import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface StudentRecord {
  slNo: string;
  studentId: string;
  name: string;
  branch: string;
  group: string;
  slot1: string;
  slot2: string;
  slot3: string;
  venue: string;
}

export function useStudentSearch() {
  const [result, setResult] = useState<StudentRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async (studentId: string) => {
    if (!studentId.trim()) {
      setResult(null);
      setNotFound(false);
      return;
    }
    setSearching(true);
    setNotFound(false);
    setResult(null);
    try {
      const ref = doc(db, "students", studentId.trim().toUpperCase());
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