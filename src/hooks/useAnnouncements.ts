import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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

  const deleteById = async (id: string | number) => id;
  const updateById = async (id: string | number, updated: Announcement) => id;
  const addAnnouncement = async (announcement: Omit<Announcement, "id">) => 0;

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