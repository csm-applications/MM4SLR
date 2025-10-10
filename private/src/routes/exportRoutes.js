// src/routes/exportRoutes.js
import express from 'express';
import { exportModel } from '../controllers/exportController.js';

const router = express.Router();

router.post('/', exportModel);

export default router;
