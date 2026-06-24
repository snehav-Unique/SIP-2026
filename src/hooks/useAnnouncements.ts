import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Announcement, defaultAnnouncements } from "../data/announcements";

const LAST_UPDATED_KEY = "rvce_announcements_updated";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const announcementsCollection = collection(db, "announcements");
      const q = query(announcementsCollection, orderBy("createdAt", "desc"));
const unsubscribe = onSnapshot(
  q,
  (snapshot) => {
    if (snapshot.empty) {
      // No Firestore docs at all — show defaults as placeholder
      setAnnouncements(defaultAnnouncements);
    } else {
      // Firestore has data — show ONLY Firestore docs, ignore defaults entirely
      const firestoreData: Announcement[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "",
          date: d.date || "",
          time: d.time || "",
          location: d.location || "",
          description: d.description || "",
          author: d.author || "",
          category: d.category || "Dean",
          hasDocument: d.hasDocument || false,
          documentUrl: d.documentUrl || d.fileUrl || "",
          fileUrl: d.fileUrl || d.documentUrl || "",
          documentName: d.documentName || "",
          documentType: d.documentType || "",
        };
      });
      setAnnouncements(firestoreData);
    }
    setLoading(false);
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
  },
  (err) => {
    console.error("Firestore snapshot error:", err);
    setError("Failed to load announcements");
    setAnnouncements(defaultAnnouncements);
    setLoading(false);
  }
);
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up announcements listener:", err);
      setError("Failed to load announcements");
      setAnnouncements(defaultAnnouncements);
      setLoading(false);
    }
  }, []);

  const deleteById = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, "announcements", String(id)));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement");
      throw err;
    }
  };

  const updateById = async (id: string | number, updated: Announcement) => {
    try {
      await updateDoc(doc(db, "announcements", String(id)), { ...updated });
    } catch (err) {
      console.error("Error updating announcement:", err);
      setError("Failed to update announcement");
      throw err;
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, "id">) => {
    try {
      const announcementsCollection = collection(db, "announcements");
      await addDoc(announcementsCollection, {
        ...announcement,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error adding announcement:", err);
      setError("Failed to add announcement");
      throw err;
    }
  };

  const getLastUpdated = (): string | null => {
    return localStorage.getItem(LAST_UPDATED_KEY);
  };

  return {
    announcements,
    deleteById,
    updateById,
    addAnnouncement,
    getLastUpdated,
    loading,
    error,
  };
}
