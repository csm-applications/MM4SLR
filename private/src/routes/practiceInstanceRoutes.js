// src/routes/practiceInstanceRoutes.js
import express from 'express';
import {
  listPracticeInstances,
  getPracticeInstance,
  createNewPracticeInstance,
  updateExistingPracticeInstance,
  removePracticeInstance,
  listPracticeInstancesByKeyPractice,
  countTextPassagesByPracticeInstance
} from '../controllers/practiceInstanceController.js';

const router = express.Router();

// ------------------------------
// Rotas principais
// ------------------------------
router.get('/', listPracticeInstances);                   // GET /practiceinstances
router.get('/:id', getPracticeInstance);                  // GET /practiceinstances/:id
router.post('/', createNewPracticeInstance);              // POST /practiceinstances
router.put('/:id', updateExistingPracticeInstance);        // PUT /practiceinstances/:id
router.delete('/:id', removePracticeInstance);             // DELETE /practiceinstances/:id

// ------------------------------
// Rotas adicionais
// ------------------------------
router.get('/keypractice/:keypracticeId', listPracticeInstancesByKeyPractice);  // GET /practiceinstances/keypractice/:id
router.get('/:id/textpassages/count', countTextPassagesByPracticeInstance);      // 👈 NOVA ROTA: contagem de Text Passages

export default router;
