import {
  collection,
  doc,
  getDocs,
  writeBatch,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { StudentRecord } from "./parseStudentFile";

const BATCH_SIZE = 400;

export interface UploadResult {
  imported: number;
  failed: number;
}

// ✅ Save raw CSV string to Firestore config doc
export async function saveRawCsvToFirestore(
  rawCsv: string,
  fileName: string,
  recordCount: number
): Promise<void> {
  await setDoc(doc(db, "config", "studentCsv"), {
    content: rawCsv,
    fileName,
    recordCount,
    uploadedAt: serverTimestamp(),
  });
}

// ✅ Clear all students + import new ones
export async function clearAndUploadStudents(
  records: StudentRecord[]
): Promise<UploadResult> {
  // Step 1: Delete all existing student documents
  const studentsCol = collection(db, "students");
  const existing = await getDocs(studentsCol);

  const deleteBatches: ReturnType<typeof writeBatch>[] = [];
  let deleteBatch = writeBatch(db);
  let deleteCount = 0;

  for (const docSnap of existing.docs) {
    deleteBatch.delete(docSnap.ref);
    deleteCount++;
    if (deleteCount % BATCH_SIZE === 0) {
      deleteBatches.push(deleteBatch);
      deleteBatch = writeBatch(db);
    }
  }
  if (deleteCount % BATCH_SIZE !== 0) deleteBatches.push(deleteBatch);
  await Promise.all(deleteBatches.map((b) => b.commit()));

  // Step 2: Import new records
  let imported = 0;
  let failed = 0;
  let writeBatchInstance = writeBatch(db);
  let writeCount = 0;

  for (const record of records) {
    try {
      const ref = doc(db, "students", record.studentId);
      writeBatchInstance.set(ref, record);
      writeCount++;
      imported++;
      if (writeCount % BATCH_SIZE === 0) {
        await writeBatchInstance.commit();
        writeBatchInstance = writeBatch(db);
        writeCount = 0;
      }
    } catch {
      failed++;
    }
  }
  if (writeCount > 0) await writeBatchInstance.commit();

  return { imported, failed };
}
