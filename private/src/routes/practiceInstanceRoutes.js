// src/routes/practiceInstanceRoutes.js
import express from 'express';
import {
  listPracticeInstances,
  getPracticeInstance,
  createNewPracticeInstance,
  updateExistingPracticeInstance,
  removePracticeInstance,
  listPracticeInstancesByKeyPractice
} from '../controllers/practiceInstanceController.js';

const router = express.Router();

router.get('/', listPracticeInstances);                 // GET /practiceinstances
router.get('/:id', getPracticeInstance);                // GET /practiceinstances/:id
router.post('/', createNewPracticeInstance);           // POST /practiceinstances
router.put('/:id', updateExistingPracticeInstance);    // PUT /practiceinstances/:id
router.delete('/:id', removePracticeInstance);         // DELETE /practiceinstances/:id
router.get('/keypractice/:keypracticeId', listPracticeInstancesByKeyPractice);

export default router;
