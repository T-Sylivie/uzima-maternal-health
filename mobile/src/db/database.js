import { open } from '@op-engineering/op-sqlite';
import { CREATE_PATIENTS_TABLE, CREATE_VISIT_LOGS_TABLE } from './schema';

let dbInstance = null;

export const getDatabase = () => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = open({ name: 'uzima.db' });
  return dbInstance;
};

export const initDatabase = async () => {
  const db = getDatabase();
  await db.execute(CREATE_PATIENTS_TABLE);
  await db.execute(CREATE_VISIT_LOGS_TABLE);
};