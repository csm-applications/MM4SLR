// src/routes/keyPracticeRoutes.js
import express from 'express';
import {
  listKeyPractices,
  getKeyPractice,
  createNewKeyPractice,
  updateExistingKeyPractice,
  removeKeyPractice,
  countPracticeInstances          // importando o novo método
} from '../controllers/keyPracticeController.js';

const router = express.Router();

router.get('/', listKeyPractices);                // GET /keypractices
router.get('/:id', getKeyPractice);               // GET /keypractices/:id
router.get('/:id/instances/count', countPracticeInstances); // GET /keypractices/:id/instances/count
router.post('/', createNewKeyPractice);           // POST /keypractices
router.put('/:id', updateExistingKeyPractice);    // PUT /keypractices/:id
router.delete('/:id', removeKeyPractice);         // DELETE /keypractices/:id

export default router;
