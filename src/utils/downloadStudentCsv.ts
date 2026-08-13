import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { StudentRecord } from "../hooks/useStudentSearch";

const HEADERS = [
  "Sl no",
  "Student id",
  "Usn",
  "Name",
  "Branch",
  "Group",
  "Slot 1",
  "Slot 2",
  "Slot 3",
  "Venue",
] as const;

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toRow(record: StudentRecord, index: number): string {
  const fields = [
    String(index + 1),
    record.studentId ?? "",
    record.usn ?? "",
    record.name ?? "",
    record.branch ?? "",
    record.group ?? "",
    record.slot1 ?? "",
    record.slot2 ?? "",
    record.slot3 ?? "",
    record.venue ?? "",
  ];
  return fields.map(escapeCsv).join(",");
}

export async function downloadStudentCsv(): Promise<void> {
  const snap = await getDocs(collection(db, "students"));
  if (snap.empty) throw new Error("No student file uploaded yet.");

  const records = snap.docs.map((d) => d.data() as StudentRecord);

  const lines = [
    HEADERS.join(","),
    ...records.map((record, i) => toRow(record, i)),
  ];
  const content = lines.join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}