// src/database/schema.ts

export const CREATE_TABLES = `
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS barbershops (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    address     TEXT,
    phone       TEXT,
    open_time   TEXT DEFAULT '08:00',
    close_time  TEXT DEFAULT '19:00',
    work_days   TEXT DEFAULT '[1,2,3,4,5,6]',
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    phone          TEXT UNIQUE NOT NULL,
    email          TEXT UNIQUE,
    password_hash  TEXT NOT NULL,
    role           TEXT NOT NULL DEFAULT 'CLIENTE',
    avatar         TEXT,
    barbershop_id  TEXT REFERENCES barbershops(id),
    is_active      INTEGER DEFAULT 1,
    created_at     TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id               TEXT PRIMARY KEY,
    barbershop_id    TEXT NOT NULL REFERENCES barbershops(id),
    barber_id        TEXT REFERENCES users(id),
    name             TEXT NOT NULL,
    description      TEXT,
    price            REAL NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_active        INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id              TEXT PRIMARY KEY,
    client_id       TEXT NOT NULL REFERENCES users(id),
    barber_id       TEXT NOT NULL REFERENCES users(id),
    service_id      TEXT NOT NULL REFERENCES services(id),
    barbershop_id   TEXT NOT NULL REFERENCES barbershops(id),
    date            TEXT NOT NULL,
    start_time      TEXT NOT NULL,
    end_time        TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'PENDENTE',
    notes           TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blocked_slots (
    id          TEXT PRIMARY KEY,
    barber_id   TEXT NOT NULL REFERENCES users(id),
    date        TEXT NOT NULL,
    start_time  TEXT NOT NULL,
    end_time    TEXT NOT NULL,
    reason      TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id                     TEXT PRIMARY KEY,
    user_id                TEXT NOT NULL REFERENCES users(id),
    title                  TEXT NOT NULL,
    body                   TEXT NOT NULL,
    type                   TEXT NOT NULL,
    is_read                INTEGER DEFAULT 0,
    related_appointment_id TEXT REFERENCES appointments(id),
    created_at             TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id              TEXT PRIMARY KEY,
    appointment_id  TEXT NOT NULL REFERENCES appointments(id),
    client_id       TEXT NOT NULL REFERENCES users(id),
    barber_id       TEXT NOT NULL REFERENCES users(id),
    score           INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS barber_clients (
    barber_id    TEXT NOT NULL REFERENCES users(id),
    client_id    TEXT NOT NULL REFERENCES users(id),
    notes        TEXT,
    is_favorite  INTEGER DEFAULT 0,
    PRIMARY KEY (barber_id, client_id)
  );
`;