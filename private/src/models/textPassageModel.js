import { getDB } from '../db/database.js';

// 🔸 Lista todos os TextPassages
export async function getAllTextPassages() {
  const db = getDB();
  return db.all('SELECT * FROM textpassage ORDER BY id ASC');
}

// 🔸 Buscar TextPassage por ID
export async function getTextPassageById(id) {
  const db = getDB();
  return db.get('SELECT * FROM textpassage WHERE id = ?', [id]);
}

// 🔸 Criar TextPassage
export async function createTextPassage({ study_id, text, keypractice_id = null, practiceinstance_id = null }) {
  const db = getDB();
  const result = await db.run(
    `INSERT INTO textpassage (study_id, text, keypractice_id, practiceinstance_id)
     VALUES (?, ?, ?, ?)`,
    [study_id, text, keypractice_id, practiceinstance_id]
  );
  return getTextPassageById(result.lastID);
}

// 🔸 Atualizar TextPassage
export async function updateTextPassage(id, { study_id, text, keypractice_id = null, practiceinstance_id = null }) {
  const db = getDB();
  await db.run(
    `UPDATE textpassage
     SET study_id = ?, text = ?, keypractice_id = ?, practiceinstance_id = ?
     WHERE id = ?`,
    [study_id, text, keypractice_id, practiceinstance_id, id]
  );
  return getTextPassageById(id);
}

// 🔸 Excluir TextPassage
export async function deleteTextPassage(id) {
  const db = getDB();
  await db.run('DELETE FROM textpassage WHERE id = ?', [id]);
}

// 🔸 Obter TextPassages de uma KeyPractice
export async function getTextPassagesByKeyPractice(keypractice_id) {
  const db = getDB();
  return db.all('SELECT * FROM textpassage WHERE keypractice_id = ?', [keypractice_id]);
}

// 🔸 Obter TextPassages de uma PracticeInstance
export async function getTextPassagesByPracticeInstance(practiceinstance_id) {
  const db = getDB();
  return db.all('SELECT * FROM textpassage WHERE practiceinstance_id = ?', [practiceinstance_id]);
}

// Contar Text Passages
export async function countTextPassagesForPracticeInstance(practiceInstanceId) {
  const db = getDB();
  const result = await db.get(
    `SELECT COUNT(*) as count
     FROM textpassage
     WHERE practiceinstance_id = ?`,
    [practiceInstanceId]
  );
  return result.count || 0;
}
