// src/routes/keyPracticeRoutes.js
import express from 'express';
import {
  listKeyPractices,
  getKeyPractice,
  createNewKeyPractice,
  updateExistingKeyPractice,
  removeKeyPractice,
  countPracticeInstances,
} from '../controllers/keyPracticeController.js';
import { mergeKeyPractices } from '../controllers/mergePracticesController.js'; // 👈 importar novo controller

const router = express.Router();

router.get('/', listKeyPractices);
router.get('/:id', getKeyPractice);
router.get('/:id/instances/count', countPracticeInstances);
router.post('/', createNewKeyPractice);
router.put('/:id', updateExistingKeyPractice);
router.delete('/:id', removeKeyPractice);

// 👇 Nova rota de merge
router.post('/merge', mergeKeyPractices);

export default router;
