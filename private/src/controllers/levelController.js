// src/controllers/levelController.js
import {
  getAllLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel
} from '../models/levelModel.js';

// 🔸 Listar todos os níveis
export async function listLevels(req, res) {
  try {
    const levels = await getAllLevels();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 🔸 Buscar nível por ID
export async function getLevel(req, res) {
  try {
    const { id } = req.params;
    const level = await getLevelById(id);
    if (!level) {
      return res.status(404).json({ error: 'Level não encontrado' });
    }
    res.json(level);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 🔸 Criar novo nível
export async function createNewLevel(req, res) {
  try {
    const { value, name, description } = req.body;

    if (value === undefined || !name) {
      return res.status(400).json({ error: 'Campos "value" e "name" são obrigatórios' });
    }

    const newLevel = await createLevel(value, name, description || '');
    res.status(201).json(newLevel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Atualizar nível existente
export async function updateExistingLevel(req, res) {
  try {
    const { id } = req.params;
    const { value, name, description } = req.body;

    const existing = await getLevelById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Level não encontrado' });
    }

    const updated = await updateLevel(
      id,
      value ?? existing.value,
      name ?? existing.name,
      description ?? existing.description
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Excluir nível
export async function removeLevel(req, res) {
  try {
    const { id } = req.params;
    const existing = await getLevelById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Level não encontrado' });
    }

    await deleteLevel(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
