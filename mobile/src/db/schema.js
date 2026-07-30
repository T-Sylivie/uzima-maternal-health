export const CREATE_PATIENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    village TEXT NOT NULL,
    lmp_date TEXT NOT NULL,
    visit_1_date TEXT NOT NULL,
    visit_2_date TEXT NOT NULL,
    visit_3_date TEXT NOT NULL,
    visit_4_date TEXT NOT NULL,
    synced INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`;

export const CREATE_VISIT_LOGS_TABLE = `
  CREATE TABLE IF NOT EXISTS visit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    visit_date TEXT NOT NULL,
    outcome TEXT NOT NULL,
    danger_signs TEXT,
    synced INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
  );
`;