// src/controllers/dimensionController.js
import {
  getAllDimensions,
  getDimensionById,
  createDimension,
  updateDimension,
  deleteDimension
} from '../models/dimensionModel.js';

// 🔸 Listar todas as dimensões
export async function listDimensions(req, res) {
  try {
    const dimensions = await getAllDimensions();
    res.json(dimensions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 🔸 Buscar dimensão por ID
export async function getDimension(req, res) {
  try {
    const { id } = req.params;
    const dimension = await getDimensionById(id);
    if (!dimension) {
      return res.status(404).json({ error: 'Dimension não encontrada' });
    }
    res.json(dimension);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 🔸 Criar nova dimensão
export async function createNewDimension(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Campo "name" é obrigatório' });
    }
    const newDimension = await createDimension(name, description || '');
    res.status(201).json(newDimension);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Atualizar dimensão existente
export async function updateExistingDimension(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const existing = await getDimensionById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Dimension não encontrada' });
    }

    const updated = await updateDimension(id, name || existing.name, description || existing.description);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Excluir dimensão
export async function removeDimension(req, res) {
  try {
    const { id } = req.params;
    const existing = await getDimensionById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Dimension não encontrada' });
    }

    await deleteDimension(id);
    res.status(204).send(); // Sem conteúdo, operação bem-sucedida
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
