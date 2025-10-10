import express from 'express';
import {
  listStudies,
  getStudy,
  createNewStudy,
  updateExistingStudy,
  removeStudy
} from '../controllers/studyController.js';

const router = express.Router();

// CRUD completo
router.get('/', listStudies);               // GET /studies
router.get('/:id', getStudy);               // GET /studies/:id
router.post('/', createNewStudy);           // POST /studies
router.put('/:id', updateExistingStudy);    // PUT /studies/:id
router.delete('/:id', removeStudy);         // DELETE /studies/:id

export default router;
