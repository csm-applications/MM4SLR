// src/routes/textPassageRoutes.js
import express from 'express';
import {
  listTextPassages,
  getTextPassage,
  createNewTextPassage,
  updateExistingTextPassage,
  removeTextPassage,
  getByKeyPractice,
  getByPracticeInstance
} from '../controllers/textPassageController.js';

const router = express.Router();

// CRUD básico
router.get('/', listTextPassages);
router.get('/:id', getTextPassage);
router.post('/', createNewTextPassage);
router.put('/:id', updateExistingTextPassage);
router.delete('/:id', removeTextPassage);

// Obter textpassages por entidade
router.get('/keypractice/:keypractice_id', getByKeyPractice);
router.get('/practiceinstance/:practiceinstance_id', getByPracticeInstance);

export default router;
