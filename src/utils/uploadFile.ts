import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadAnnouncementFile(
  file: File,
  announcementTitle: string,
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const safeTitle = announcementTitle.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `announcements/${safeTitle}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
