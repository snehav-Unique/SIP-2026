import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function downloadStudentCsv(): Promise<void> {
  const snap = await getDoc(doc(db, "config", "studentCsv"));
  if (!snap.exists()) throw new Error("No student file uploaded yet.");

  const { content, fileName } = snap.data();

  // Generate download in browser
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "students.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}