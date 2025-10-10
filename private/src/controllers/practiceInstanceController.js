// src/controllers/practiceInstanceController.js
import {
  getAllPracticeInstances,
  getPracticeInstanceById,
  createPracticeInstance,
  updatePracticeInstance,
  deletePracticeInstance,
  getPracticeInstancesByKeyPractice
} from '../models/practiceInstanceModel.js';

import { countTextPassagesForPracticeInstance } from '../models/textPassageModel.js';



export async function listPracticeInstances(req, res) {
  try {
    const result = await getAllPracticeInstances();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const listPracticeInstancesByKeyPractice = async (req, res) => {
  try {
    console.log(req.params)
    const instances =  await getPracticeInstancesByKeyPractice(req, res);
    res.json(instances);
  } catch (err) {
    console.error('Erro ao buscar Practice Instances por Key Practice:', err);
    res.status(500).json({ error: 'Erro ao buscar Practice Instances.' });
  }
};

export async function getPracticeInstance(req, res) {
  try {
    const { id } = req.params;
    const pi = await getPracticeInstanceById(id);
    if (!pi) return res.status(404).json({ error: 'PracticeInstance não encontrada' });
    res.json(pi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNewPracticeInstance(req, res) {
  try {
    const { description, keypractice_id } = req.body;
    if (!description || !keypractice_id) {
      return res.status(400).json({ error: 'Campos "description" e "keypractice_id" são obrigatórios' });
    }

    const newPI = await createPracticeInstance(description, keypractice_id);
    console.log(newPI);
    res.status(201).json(newPI);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateExistingPracticeInstance(req, res) {
  try {
    const { id } = req.params;
    const { description, keypractice_id } = req.body;

    const existing = await getPracticeInstanceById(id);
    if (!existing) return res.status(404).json({ error: 'PracticeInstance não encontrada' });

    const updated = await updatePracticeInstance(
      id,
      description ?? existing.description,
      keypractice_id ?? existing.keypractice_id
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function removePracticeInstance(req, res) {
  try {
    const { id } = req.params;
    const existing = await getPracticeInstanceById(id);
    if (!existing) return res.status(404).json({ error: 'PracticeInstance não encontrada' });

    await deletePracticeInstance(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function countTextPassagesByPracticeInstance(req, res) {
  try {
    const { id } = req.params;

    // Chama a função do model que retorna a contagem
    const count = await countTextPassagesForPracticeInstance(id);

    res.json({ count });
  } catch (err) {
    console.error('Erro ao contar Text Passages:', err);
    res.status(500).json({ error: 'Erro ao contar Text Passages.' });
  }
}
