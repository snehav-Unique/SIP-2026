import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface StudentRecord {
  name: string;
  studentId: string;
  usn: string;
  branch: string;
  group: string;
  venue: string;
  slot1: string;
  slot2: string;
  slot3: string;
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
      const studentId = usn.trim().toUpperCase();

      const ref = doc(db, "students", studentId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setResult({
          name: data.name ?? "",
          studentId: data.studentId || studentId,
          usn: data.usn || studentId,
          branch: data.branch ?? "",
          group: data.group ?? "",
          venue: data.venue ?? "",
          slot1: data.slot1 ?? "",
          slot2: data.slot2 ?? "",
          slot3: data.slot3 ?? "",
        });

        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching student:", error);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const clear = () => {
    setResult(null);
    setNotFound(false);
  };

  return {
    result,
    searching,
    notFound,
    search,
    clear,
  };
}