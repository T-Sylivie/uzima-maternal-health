import { getDatabase } from './database';

export const insertVisitLog = async (visitLog) => {
  const db = getDatabase();
  const createdAt = new Date().toISOString();

  const result = await db.execute(
    `INSERT INTO visit_logs (patient_id, visit_date, outcome, danger_signs, synced, created_at)
     VALUES (?, ?, ?, ?, 0, ?)`,
    [
      visitLog.patientId,
      visitLog.visitDate,
      visitLog.outcome,
      visitLog.dangerSigns || '',
      createdAt,
    ]
  );

  return result.insertId;
};