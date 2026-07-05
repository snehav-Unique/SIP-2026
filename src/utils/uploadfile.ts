/**
 * Uploads a file to Cloudinary and returns its public download URL.
 * Uses image/upload for all file types (including PDFs) to ensure
 * public access — raw/upload defaults to authenticated on free plans.
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
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `Upload failed: ${errData?.error?.message || res.statusText}`
    );
  }

  const data = await res.json();
  return data.secure_url;
}