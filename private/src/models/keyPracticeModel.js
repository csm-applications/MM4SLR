// src/models/keyPracticeModel.js
import { getDB } from '../db/database.js';

// 🔸 Lista todas as Key Practices com Level e Dimension associados
export async function getAllKeyPractices() {
  const db = getDB();
  return db.all(`
    SELECT kp.id, kp.description,
           l.id as level_id, l.name as level_name, l.value as level_value,
           d.id as dimension_id, d.name as dimension_name
    FROM keypractice kp
    JOIN level l ON l.id = kp.level_id
    JOIN dimension d ON d.id = kp.dimension_id
    ORDER BY kp.id ASC
  `);
}

// 🔸 Buscar Key Practice por ID
export async function getKeyPracticeById(id) {
  const db = getDB();
  return db.get(`
    SELECT kp.id, kp.description,
           l.id as level_id, l.name as level_name, l.value as level_value,
           d.id as dimension_id, d.name as dimension_name
    FROM keypractice kp
    JOIN level l ON l.id = kp.level_id
    JOIN dimension d ON d.id = kp.dimension_id
    WHERE kp.id = ?
  `, [id]);
}

// 🔸 Criar Key Practice
export async function createKeyPractice(description, level_id, dimension_id) {
  const db = getDB();
  const result = await db.run(
    `INSERT INTO keypractice (description, level_id, dimension_id)
     VALUES (?, ?, ?)`,
    [description, level_id, dimension_id]
  );
  return getKeyPracticeById(result.lastID);
}

// 🔸 Atualizar Key Practice
export async function updateKeyPractice(id, description, level_id, dimension_id) {
  const db = getDB();
  await db.run(
    `UPDATE keypractice
     SET description = ?, level_id = ?, dimension_id = ?
     WHERE id = ?`,
    [description, level_id, dimension_id, id]
  );
  return getKeyPracticeById(id);
}

export async function getPracticeInstanceCountByKeyPracticeId(kpId) {
  const db = getDB();
  const result = await db.get(
    'SELECT COUNT(*) AS count FROM practiceinstance WHERE keypractice_id = ?',
    [kpId]
  );
  return parseInt(result.count, 10);
}


// 🔸 Deletar Key Practice
export async function deleteKeyPractice(id) {
  const db = getDB();
  await db.run('DELETE FROM keypractice WHERE id = ?', [id]);
}
