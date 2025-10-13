// src/controllers/keyPracticeMergeController.js
import {
  getKeyPracticeById,
  updateKeyPractice,
  deleteKeyPractice
} from '../models/keyPracticeModel.js';

import { reassignPracticeInstances, reassignTextPassages } from '../models/mergeModel.js';

export async function mergeKeyPractices(req, res) {
  try {
    console.log('Merge request received:', req.body);
    const { targetId, mergedIds, newDescription } = req.body;

    if (!targetId || !mergedIds || !Array.isArray(mergedIds) || mergedIds.length === 0) {
      return res.status(400).json({ error: 'Parâmetros inválidos. Envie targetId e mergedIds.' });
    }

    const target = await getKeyPracticeById(targetId);
    if (!target) {
      return res.status(404).json({ error: 'KeyPractice principal não encontrada' });
    }

    // Reatribui todas as practice instances
    await reassignPracticeInstances(mergedIds, targetId);

    // Reatribui todos os text passages
    await reassignTextPassages(mergedIds, targetId);

    // Atualiza a descrição da KP principal
    if (newDescription && newDescription.trim() !== '') {
      await updateKeyPractice(
        targetId,
        newDescription,
        target.level_id,
        target.dimension_id
      );
    }

    // Deleta as KPs que foram mescladas
    for (const id of mergedIds) {
      if (id !== targetId) {
        await deleteKeyPractice(id);
      }
    }

    res.json({ message: 'Merge realizado com sucesso', targetId });
  } catch (err) {
    console.error('❌ Erro no merge:', err);
    res.status(500).json({ error: err.message });
  }
}
