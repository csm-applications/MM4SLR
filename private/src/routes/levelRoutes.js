// src/routes/levelRoutes.js
import express from 'express';
import {
  listLevels,
  getLevel,
  createNewLevel,
  updateExistingLevel,
  removeLevel
} from '../controllers/levelController.js';

const router = express.Router();

router.get('/', listLevels);                // GET /levels
router.get('/:id', getLevel);               // GET /levels/:id
router.post('/', createNewLevel);           // POST /levels
router.put('/:id', updateExistingLevel);    // PUT /levels/:id
router.delete('/:id', removeLevel);         // DELETE /levels/:id

export default router;
