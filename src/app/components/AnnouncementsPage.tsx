import { useState, useEffect } from "react";
import {
  addDoc, collection, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Announcement, defaultAnnouncements } from "../../data/announcements";

const LAST_UPDATED_KEY = "rvce_announcements_updated";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          if (snapshot.empty) {
            setAnnouncements(defaultAnnouncements);
          } else {
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
          console.error("Firestore error:", err);
          setError("Failed to load announcements");
          setAnnouncements(defaultAnnouncements);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.error("Listener setup error:", err);
      setAnnouncements(defaultAnnouncements);
      setLoading(false);
    }
  }, []);

  const deleteById = async (id: string | number) => {
    await deleteDoc(doc(db, "announcements", String(id)));
  };

  const updateById = async (id: string | number, updated: Announcement) => {
    await updateDoc(doc(db, "announcements", String(id)), { ...updated });
  };

  const addAnnouncement = async (announcement: Omit<Announcement, "id">) => {
    await addDoc(collection(db, "announcements"), {
      ...announcement,
      createdAt: serverTimestamp(),
    });
  };

  const getLastUpdated = (): string | null => localStorage.getItem(LAST_UPDATED_KEY);

  return { announcements, deleteById, updateById, addAnnouncement, getLastUpdated, loading, error };
}