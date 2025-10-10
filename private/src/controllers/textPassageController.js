import {
  getAllTextPassages,
  getTextPassageById,
  createTextPassage,
  updateTextPassage,
  deleteTextPassage,
  getTextPassagesByKeyPractice,
  getTextPassagesByPracticeInstance
} from '../models/textPassageModel.js';

export async function listTextPassages(req, res) {
  try {
    const data = await getAllTextPassages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTextPassage(req, res) {
  try {
    const { id } = req.params;
    const tp = await getTextPassageById(id);
    if (!tp) return res.status(404).json({ error: 'TextPassage não encontrada' });
    res.json(tp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNewTextPassage(req, res) {
  try {
    const { study_id, text, keypractice_id, practiceinstance_id } = req.body;
    if (!study_id || !text) return res.status(400).json({ error: 'Campos obrigatórios: study_id e text' });
    const newTP = await createTextPassage({ study_id, text, keypractice_id, practiceinstance_id });
    res.status(201).json(newTP);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateExistingTextPassage(req, res) {
  try {
    const { id } = req.params;
    const existing = await getTextPassageById(id);
    if (!existing) return res.status(404).json({ error: 'TextPassage não encontrada' });

    const { study_id, text, keypractice_id, practiceinstance_id } = req.body;
    const updated = await updateTextPassage(id, {
      study_id: study_id ?? existing.study_id,
      text: text ?? existing.text,
      keypractice_id: keypractice_id ?? existing.keypractice_id,
      practiceinstance_id: practiceinstance_id ?? existing.practiceinstance_id
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function removeTextPassage(req, res) {
  try {
    const { id } = req.params;
    const existing = await getTextPassageById(id);
    if (!existing) return res.status(404).json({ error: 'TextPassage não encontrada' });

    await deleteTextPassage(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Obter TextPassages de uma KeyPractice
export async function getByKeyPractice(req, res) {
  try {
    const { keypractice_id } = req.params;
    const data = await getTextPassagesByKeyPractice(keypractice_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Obter TextPassages de uma PracticeInstance
export async function getByPracticeInstance(req, res) {
  try {
    const { practiceinstance_id } = req.params;
    const data = await getTextPassagesByPracticeInstance(practiceinstance_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
