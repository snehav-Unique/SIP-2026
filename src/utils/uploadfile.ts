import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Uploads a file to Firebase Storage and returns its public download URL.
 * 
 * @param file The file to upload
 * @param namePrefix A string to prefix the file name with (usually the announcement title or ID)
 * @returns The download URL of the uploaded file
 */
export async function uploadAnnouncementFile(file: File, namePrefix: string): Promise<string> {
  // Sanitize prefix to be URL and filesystem safe
  const safePrefix = namePrefix.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${safePrefix}-${Date.now()}.${fileExtension}`;
  
  // Create a reference to 'announcement-attachments/{fileName}'
  const storageRef = ref(storage, `announcement-attachments/${fileName}`);
  
  // Upload the file
  await uploadBytes(storageRef, file);
  
  // Get and return the download URL
  return await getDownloadURL(storageRef);
}
