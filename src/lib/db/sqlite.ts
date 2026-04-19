import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { getEnv } from "@/lib/env";

let dbInstance: Database.Database | null = null;

function getDb() {
  const env = getEnv();

  if (!env.sqliteBackupEnabled) {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  const absolutePath = path.resolve(env.SQLITE_BACKUP_PATH);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  const db = new Database(absolutePath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    create table if not exists backup_events (
      id integer primary key autoincrement,
      event_type text not null,
      user_sub text,
      payload text not null,
      created_at text not null default (datetime('now'))
    );
  `);

  dbInstance = db;
  return dbInstance;
}

export function writeBackupEvent(eventType: string, userSub: string, payload: unknown) {
  const db = getDb();

  if (!db) {
    return;
  }

  const stmt = db.prepare(
    "insert into backup_events (event_type, user_sub, payload) values (?, ?, ?)",
  );

  stmt.run(eventType, userSub, JSON.stringify(payload));
}
