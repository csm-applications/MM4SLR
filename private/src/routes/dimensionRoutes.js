// src/routes/dimensionRoutes.js
import express from 'express';
import {
  listDimensions,
  getDimension,
  createNewDimension,
  updateExistingDimension,
  removeDimension
} from '../controllers/dimensionController.js';

const router = express.Router();

// CRUD completo
router.get('/', listDimensions);               // GET /dimensions
router.get('/:id', getDimension);              // GET /dimensions/:id
router.post('/', createNewDimension);          // POST /dimensions
router.put('/:id', updateExistingDimension);   // PUT /dimensions/:id
router.delete('/:id', removeDimension);        // DELETE /dimensions/:id

export default router;
