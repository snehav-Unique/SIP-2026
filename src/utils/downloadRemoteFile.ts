export async function downloadRemoteFile(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch the file");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
