// src/db/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// ===============================
// 🔧 Just change this line 👇
// ===============================
const DATABASE_NAME = 'testing.db';  // 👈 change this to use another database
// e.g. const DATABASE_NAME = 'test.db';

const DATA_DIR = path.resolve('./../data');
const dbPath = path.join(DATA_DIR, DATABASE_NAME);

let db;

export async function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS dimension (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS level (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS keypractice (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      level_id INTEGER NOT NULL,
      dimension_id INTEGER NOT NULL,
      FOREIGN KEY (level_id) REFERENCES level(id),
      FOREIGN KEY (dimension_id) REFERENCES dimension(id)
    );

    CREATE TABLE IF NOT EXISTS practiceinstance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      keypractice_id INTEGER NOT NULL,
      FOREIGN KEY (keypractice_id) REFERENCES keypractice(id)
    );

    CREATE TABLE IF NOT EXISTS study (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bibtex_key TEXT NOT NULL UNIQUE,
      entry_type TEXT NOT NULL,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      year INTEGER,
      month TEXT,
      pages TEXT,
      series TEXT,
      booktitle TEXT,
      publisher TEXT,
      url TEXT,
      doi TEXT,
      collection TEXT
    );

    CREATE TABLE IF NOT EXISTS textpassage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      study_id INTEGER NOT NULL,
      keypractice_id INTEGER,
      practiceinstance_id INTEGER,
      text TEXT NOT NULL,
      FOREIGN KEY (study_id) REFERENCES study(id),
      FOREIGN KEY (keypractice_id) REFERENCES keypractice(id),
      FOREIGN KEY (practiceinstance_id) REFERENCES practiceinstance(id)
    );
  `);

  console.log(`✅ Banco de dados inicializado em: ${dbPath}`);
}

export function getDB() {
  return db;
}
