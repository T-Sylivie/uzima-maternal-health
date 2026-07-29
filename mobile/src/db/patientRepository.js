import { getDatabase } from './database';
import { calculateAncVisitDates } from '../utils/ancCalculator';

export const insertPatient = async (patient) => {
  const db = getDatabase();
  const visitDates = calculateAncVisitDates(patient.lmpDate);
  const createdAt = new Date().toISOString();

  const result = await db.execute(
    `INSERT INTO patients
      (name, phone_number, village, lmp_date, visit_1_date, visit_2_date, visit_3_date, visit_4_date, synced, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [
      patient.name,
      patient.phoneNumber,
      patient.village,
      patient.lmpDate,
      visitDates.visit1Date,
      visitDates.visit2Date,
      visitDates.visit3Date,
      visitDates.visit4Date,
      createdAt,
    ]
  );

  return result.insertId;
};

export const getAllPatients = async () => {
  const db = getDatabase();
  const result = await db.execute('SELECT * FROM patients ORDER BY created_at DESC');
  return result.rows;
};