// src/routes/practiceInstanceRoutes.js
import express from 'express';
import {
  listPracticeInstances,
  getPracticeInstance,
  createNewPracticeInstance,
  updateExistingPracticeInstance,
  removePracticeInstance
} from '../controllers/practiceInstanceController.js';

const router = express.Router();

router.get('/', listPracticeInstances);                 // GET /practiceinstances
router.get('/:id', getPracticeInstance);                // GET /practiceinstances/:id
router.post('/', createNewPracticeInstance);           // POST /practiceinstances
router.put('/:id', updateExistingPracticeInstance);    // PUT /practiceinstances/:id
router.delete('/:id', removePracticeInstance);         // DELETE /practiceinstances/:id

export default router;
