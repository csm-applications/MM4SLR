// src/models/dimensionModel.js
import { getDB } from '../db/database.js';

// 🔸 Lista todas as dimensões
export async function getAllDimensions() {
  const db = getDB();
  return db.all('SELECT * FROM dimension');
}

// 🔸 Busca uma dimensão pelo ID
export async function getDimensionById(id) {
  const db = getDB();
  return db.get('SELECT * FROM dimension WHERE id = ?', [id]);
}

// 🔸 Cria uma nova dimensão
export async function createDimension(name, description) {
  const db = getDB();
  const result = await db.run(
    'INSERT INTO dimension (name, description) VALUES (?, ?)',
    [name, description]
  );
  return { id: result.lastID, name, description };
}

// 🔸 Atualiza uma dimensão existente
export async function updateDimension(id, name, description) {
  const db = getDB();
  await db.run(
    'UPDATE dimension SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return getDimensionById(id);
}

// 🔸 Exclui uma dimensão
export async function deleteDimension(id) {
  const db = getDB();
  await db.run('DELETE FROM dimension WHERE id = ?', [id]);
}
