// src/database/db.ts
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('barberflow.db');
  await initializeDB(db);
  return db;
}

async function initializeDB(database: SQLite.SQLiteDatabase) {
  // Executa cada statement separadamente
  const statements = CREATE_TABLES
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    await database.execAsync(stmt + ';');
  }

  // Seed inicial: barbearia demo + usuários demo
  await seedDemo(database);
}

async function seedDemo(database: SQLite.SQLiteDatabase) {
  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users'
  );
  if (existing && existing.count > 0) return;

  const shopId = 'shop_demo_001';
  const ownerId = 'user_owner_001';
  const barberId = 'user_barber_001';
  const clientId = 'user_client_001';

  await database.execAsync(`
    INSERT INTO barbershops (id, name, address, phone)
    VALUES ('${shopId}', 'Barbearia Demo', 'Rua das Tesouras, 42', '(83) 99999-0000');

    INSERT INTO users (id, name, phone, password_hash, role, barbershop_id)
    VALUES
      ('${ownerId}', 'Carlos Dono', '11900000001', 'demo123', 'DONO', '${shopId}'),
      ('${barberId}', 'João Barbeiro', '11900000002', 'demo123', 'BARBEIRO', '${shopId}'),
      ('${clientId}', 'Maria Cliente', '11900000003', 'demo123', 'CLIENTE', '${shopId}');

    INSERT INTO services (id, barbershop_id, barber_id, name, price, duration_minutes)
    VALUES
      ('svc_001', '${shopId}', '${barberId}', 'Corte Degradê', 45.00, 45),
      ('svc_002', '${shopId}', '${barberId}', 'Barba Completa', 35.00, 30),
      ('svc_003', '${shopId}', '${barberId}', 'Corte + Barba', 75.00, 60),
      ('svc_004', '${shopId}', '${barberId}', 'Pigmentação', 90.00, 90);
  `);
}