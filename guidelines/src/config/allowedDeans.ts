const raw = import.meta.env.VITE_ALLOWED_DEANS || "";
export const ALLOWED_EMAILS: string[] = raw
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);