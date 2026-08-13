import * as XLSX from "xlsx";

export interface StudentRecord {
  slNo: string;
  studentId: string;
  name: string;
  branch: string;
  group: string;
  slot1: string;
  slot2: string;
  slot3: string;
  venue: string;
  [key: string]: string | undefined;
}

export interface ParseResult {
  valid: StudentRecord[];
  invalidCount: number;
  totalRows: number;
}

export async function parseStudentFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
  });

  const valid: StudentRecord[] = [];
  let invalidCount = 0;

  for (const row of rows) {
    const normalized: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      normalized[key.toLowerCase().trim()] = String(row[key]).trim();
    }

    const studentId = normalized["student id"] || "";
    const name = normalized["name"] || "";

    // studentId + name are the only required fields
    if (!studentId || !name) {
      invalidCount++;
      continue;
    }

    valid.push({
      slNo: normalized["sl no"] || "",
      studentId: studentId.toUpperCase().trim(),
      name: name.trim(),
      branch: normalized["branch"] || "",
      group: normalized["group"] || "",
      slot1: normalized["slot 1"] || "",
      slot2: normalized["slot 2"] || "",
      slot3: normalized["slot 3"] || "",
      venue: normalized["venue"] || "",
    });
  }

  return { valid, invalidCount, totalRows: rows.length };
}