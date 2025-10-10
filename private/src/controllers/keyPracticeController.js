// src/controllers/keyPracticeController.js
import {
  getAllKeyPractices,
  getKeyPracticeById,
  createKeyPractice,
  updateKeyPractice,
  deleteKeyPractice,
  getPracticeInstanceCountByKeyPracticeId
} from '../models/keyPracticeModel.js';

export async function listKeyPractices(req, res) {
  try {
    const result = await getAllKeyPractices();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getKeyPractice(req, res) {
  try {
    const { id } = req.params;
    const kp = await getKeyPracticeById(id);
    if (!kp) return res.status(404).json({ error: 'KeyPractice não encontrada' });
    res.json(kp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNewKeyPractice(req, res) {
  try {
    const { description, level_id, dimension_id } = req.body;
    if (!description || !level_id || !dimension_id) {
      return res.status(400).json({ error: 'Campos "description", "level_id" e "dimension_id" são obrigatórios' });
    }
    const newKP = await createKeyPractice(description, level_id, dimension_id);
    res.status(201).json(newKP);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateExistingKeyPractice(req, res) {
  try {
    const { id } = req.params;
    const { description, level_id, dimension_id } = req.body;

    const existing = await getKeyPracticeById(id);
    if (!existing) {
      return res.status(404).json({ error: 'KeyPractice não encontrada' });
    }

    const updated = await updateKeyPractice(
      id,
      description ?? existing.description,
      level_id ?? existing.level_id,
      dimension_id ?? existing.dimension_id
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function countPracticeInstances(req, res) {
  try {
    const { id } = req.params;
    const count = await getPracticeInstanceCountByKeyPracticeId(id);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeKeyPractice(req, res) {
  try {
    const { id } = req.params;
    const existing = await getKeyPracticeById(id);
    if (!existing) {
      return res.status(404).json({ error: 'KeyPractice não encontrada' });
    }

    await deleteKeyPractice(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
