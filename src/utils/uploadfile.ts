/**
 * Uploads a file to Cloudinary and returns its public download URL.
 */
export async function uploadAnnouncementFile(
  file: File,
  _id: string
): Promise<string> {
  const CLOUD_NAME = "wdojfhlz";
  const UPLOAD_PRESET = "kg7qybrg";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url;
}