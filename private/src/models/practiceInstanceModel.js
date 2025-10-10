// src/models/practiceInstanceModel.js
import { getDB } from '../db/database.js';

// 🔸 Lista todas as Practice Instances com KeyPractice associada
export async function getAllPracticeInstances() {
  const db = getDB();
  return db.all(`
    SELECT pi.id, pi.description,
           kp.id as keypractice_id, kp.description as keypractice_description
    FROM practiceinstance pi
    JOIN keypractice kp ON kp.id = pi.keypractice_id
    ORDER BY pi.id ASC
  `);
}

export async function getPracticeInstancesByKeyPractice(keypracticeId) {
  const db = getDB();
  return db.all(`
    SELECT pi.id, pi.description,
           kp.id as keypractice_id, kp.description as keypractice_description
    FROM practiceinstance pi
    JOIN keypractice kp ON kp.id = pi.keypractice_id
    WHERE pi.keypractice_id = ?
    ORDER BY pi.id ASC
  `, [keypracticeId]);
}

// 🔸 Buscar Practice Instance por ID
export async function getPracticeInstanceById(id) {
  const db = getDB();
  return db.get(`
    SELECT pi.id, pi.description,
           kp.id as keypractice_id, kp.description as keypractice_description
    FROM practiceinstance pi
    JOIN keypractice kp ON kp.id = pi.keypractice_id
    WHERE pi.id = ?
  `, [id]);
}

// 🔸 Criar Practice Instance
export async function createPracticeInstance(description, keypractice_id) {
  const db = getDB();
  const result = await db.run(
    `INSERT INTO practiceinstance (description, keypractice_id)
     VALUES (?, ?)`,
    [description, keypractice_id]
  );
  return getPracticeInstanceById(result.lastID);
}

// 🔸 Atualizar Practice Instance
export async function updatePracticeInstance(id, description, keypractice_id) {
  const db = getDB();
  await db.run(
    `UPDATE practiceinstance
     SET description = ?, keypractice_id = ?
     WHERE id = ?`,
    [description, keypractice_id, id]
  );
  return getPracticeInstanceById(id);
}

// 🔸 Deletar Practice Instance
export async function deletePracticeInstance(id) {
  const db = getDB();
  await db.run('DELETE FROM practiceinstance WHERE id = ?', [id]);
}
