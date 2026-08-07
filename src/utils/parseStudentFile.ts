import * as XLSX from "xlsx";

export interface StudentRecord {
  usn: string;
  name: string;
  venue: string;
  department?: string;
  reportingTime?: string;
  block?: string;
  group?: string;
  slot1Time?: string;
  slot1Venue?: string;
  slot2Time?: string;
  slot2Venue?: string;
  slot3Time?: string;
  slot3Venue?: string;
  slot4Time?: string;
  slot4Venue?: string;
  slot5Time?: string;
  slot5Venue?: string;
  slot6Time?: string;
  slot6Venue?: string;
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
    // Normalize keys to lowercase, trim whitespace
    const normalized: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      normalized[key.toLowerCase().trim()] = String(row[key]).trim();
    }

    // Required fields
    const usn =
      normalized["student id"] ||
      normalized["usn"] ||
      normalized["usn no"] ||
      "";

    const name =
      normalized["student full name"] ||
      normalized["name"] ||
      normalized["student name"] ||
      "";

    if (!usn || !name) {
      invalidCount++;
      continue;
    }

    const department =
      normalized["program"] ||
      normalized["department"] ||
      normalized["dept"] ||
      "";

    const group =
      normalized["group"] ||
      normalized["student group"] ||
      "";

    // Slot 1 is the primary venue and reporting time
    const slot1Time = normalized["slot 1time"] || normalized["slot 1 time"] || "";
    const slot1Venue = normalized["slot 1venue"] || normalized["slot 1 venue"] || "";

    const slot2Time = normalized["slot 2time"] || normalized["slot 2 time"] || "";
    const slot2Venue = normalized["slot 2venue"] || normalized["slot 2 venue"] || "";

    const slot3Time = normalized["slot 3time"] || normalized["slot 3 time"] || "";
    const slot3Venue = normalized["slot 3venue"] || normalized["slot 3 venue"] || "";

    const slot4Time = normalized["slot 4time"] || normalized["slot 4 time"] || "";
    const slot4Venue = normalized["slot 4venue"] || normalized["slot 4 venue"] || "";

    const slot5Time = normalized["slot 5time"] || normalized["slot 5 time"] || "";
    const slot5Venue = normalized["slot 5venue"] || normalized["slot 5 venue"] || "";

    const slot6Time = normalized["slot 6time"] || normalized["slot 6 time"] || "";
    const slot6Venue = normalized["slot 6venue"] || normalized["slot 6 venue"] || "";

    valid.push({
      usn: usn.toUpperCase().trim(),
      name: name.trim(),
      // Primary venue and time = Slot 1
      venue: slot1Venue.trim(),
      reportingTime: slot1Time.trim(),
      department: department.trim(),
      block: "",
      group: group.trim(),
      // All slots stored individually
      slot1Time: slot1Time.trim(),
      slot1Venue: slot1Venue.trim(),
      slot2Time: slot2Time.trim(),
      slot2Venue: slot2Venue.trim(),
      slot3Time: slot3Time.trim(),
      slot3Venue: slot3Venue.trim(),
      slot4Time: slot4Time.trim(),
      slot4Venue: slot4Venue.trim(),
      slot5Time: slot5Time.trim(),
      slot5Venue: slot5Venue.trim(),
      slot6Time: slot6Time.trim(),
      slot6Venue: slot6Venue.trim(),
    });
  }

  return { valid, invalidCount, totalRows: rows.length };
}