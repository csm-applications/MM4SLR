// src/db/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 🔹 Carrega variáveis do .env
dotenv.config();

// 🔹 Nome do banco de dados via .env, fallback para 'default.db'
const DATABASE_NAME = process.env.DATABASE_NAME || 'default.db';
const DATA_DIR = path.resolve('./../data');
const dbPath = path.join(DATA_DIR, DATABASE_NAME);

let db;

/**
 * Cria o diretório de dados se não existir
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * SQL para criar todas as tabelas
 */
const TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS dimension (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS level (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS keypractice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    level_id INTEGER NOT NULL,
    dimension_id INTEGER NOT NULL,
    FOREIGN KEY (level_id) REFERENCES level(id),
    FOREIGN KEY (dimension_id) REFERENCES dimension(id)
  );`,
  `CREATE TABLE IF NOT EXISTS practiceinstance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    keypractice_id INTEGER NOT NULL,
    FOREIGN KEY (keypractice_id) REFERENCES keypractice(id)
  );`,
  `CREATE TABLE IF NOT EXISTS study (
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
  );`,
  `CREATE TABLE IF NOT EXISTS textpassage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER NOT NULL,
    keypractice_id INTEGER,
    practiceinstance_id INTEGER,
    text TEXT NOT NULL,
    FOREIGN KEY (study_id) REFERENCES study(id),
    FOREIGN KEY (keypractice_id) REFERENCES keypractice(id),
    FOREIGN KEY (practiceinstance_id) REFERENCES practiceinstance(id)
  );`
];

/**
 * Inicializa o banco de dados
 */
export async function initDB() {
  ensureDataDir();

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  for (const sql of TABLES_SQL) {
    await db.exec(sql);
  }

  console.log(`✅ Banco de dados inicializado em: ${dbPath}`);
}

/**
 * Retorna a instância do banco de dados
 */
export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}
