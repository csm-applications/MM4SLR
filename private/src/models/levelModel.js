// src/models/levelModel.js
import { getDB } from '../db/database.js';

// 🔸 Lista todos os níveis
export async function getAllLevels() {
  const db = getDB();
  return db.all('SELECT * FROM level ORDER BY value ASC');
}

// 🔸 Busca nível por ID
export async function getLevelById(id) {
  const db = getDB();
  return db.get('SELECT * FROM level WHERE id = ?', [id]);
}

// 🔸 Cria novo nível
export async function createLevel(value, name, description) {
  const db = getDB();
  const result = await db.run(
    'INSERT INTO level (value, name, description) VALUES (?, ?, ?)',
    [value, name, description]
  );
  return { id: result.lastID, value, name, description };
}

// 🔸 Atualiza nível existente
export async function updateLevel(id, value, name, description) {
  const db = getDB();
  await db.run(
    'UPDATE level SET value = ?, name = ?, description = ? WHERE id = ?',
    [value, name, description, id]
  );
  return getLevelById(id);
}

// 🔸 Exclui nível
export async function deleteLevel(id) {
  const db = getDB();
  await db.run('DELETE FROM level WHERE id = ?', [id]);
}
