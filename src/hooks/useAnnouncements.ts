import { useState, useEffect } from "react";
import { Announcement, defaultAnnouncements } from "../data/announcements";

const STORAGE_KEY = "rvce_announcements";
const LAST_UPDATED_KEY = "rvce_announcements_updated";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Initialize from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch {
        setAnnouncements(defaultAnnouncements);
      }
    } else {
      setAnnouncements(defaultAnnouncements);
    }
  }, []);

  const save = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
  };

  const deleteById = (id: number) => {
    const updated = announcements.filter((a) => a.id !== id);
    save(updated);
  };

  const updateById = (id: number, updated: Announcement) => {
    const newList = announcements.map((a) => (a.id === id ? updated : a));
    save(newList);
  };

  const addAnnouncement = (announcement: Omit<Announcement, "id">) => {
    const newId = Math.max(...announcements.map((a) => a.id), 0) + 1;
    const newAnnouncement: Announcement = { ...announcement, id: newId };
    save([newAnnouncement, ...announcements]);
    return newId;
  };

  const getLastUpdated = (): string | null => {
    return localStorage.getItem(LAST_UPDATED_KEY);
  };

  return {
    announcements,
    save,
    deleteById,
    updateById,
    addAnnouncement,
    getLastUpdated,
  };
}
