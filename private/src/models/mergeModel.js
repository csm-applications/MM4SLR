// src/models/keyPracticeModel.js
import { getDB } from '../db/database.js';

// 🔸 Reatribuir Practice Instances de uma lista de KPs para outra
export async function reassignPracticeInstances(oldIds, newId) {
  const db = getDB();
  const placeholders = oldIds.map(() => '?').join(',');
  await db.run(
    `UPDATE practiceinstance
     SET keypractice_id = ?
     WHERE keypractice_id IN (${placeholders})`,
    [newId, ...oldIds]
  );
}

// 🔸 Reatribuir Text Passages de uma lista de KPs para outra
export async function reassignTextPassages(oldIds, newId) {
  const db = getDB();
  const placeholders = oldIds.map(() => '?').join(',');
  await db.run(
    `UPDATE textpassage
     SET keypractice_id = ?
     WHERE keypractice_id IN (${placeholders})`,
    [newId, ...oldIds]
  );
}
