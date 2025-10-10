// server.js
import express from 'express';
import cors from 'cors'; // ✅ importa o cors
import { initDB } from './src/db/database.js';
import dimensionRoutes from './src/routes/dimensionRoutes.js';
import levelRoutes from './src/routes/levelRoutes.js';
import keyPracticeRoutes from './src/routes/keyPracticeRoutes.js';
import practiceInstanceRoutes from './src/routes/practiceInstanceRoutes.js';
import textPassageRoutes from './src/routes/textPassageRoutes.js';
import studyRoutes from './src/routes/studyRoutes.js';

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Inicializa Banco
await initDB();

// Rotas
app.use('/dimensions', dimensionRoutes);
app.use('/levels', levelRoutes);
app.use('/keypractices', keyPracticeRoutes);
app.use('/practiceinstances', practiceInstanceRoutes);
app.use('/textpassages', textPassageRoutes);
app.use('/studies', studyRoutes);

app.get('/', (req, res) => res.send('🚀 MM4SLR API rodando'));

const PORT = 3000;
app.listen(PORT, () => console.log(`🌐 Servidor em http://localhost:${PORT}`));
