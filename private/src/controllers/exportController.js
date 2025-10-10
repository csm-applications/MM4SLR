// src/controllers/exportController.js
import { getDB } from '../db/database.js';
import fs from 'fs';
import path from 'path';

export async function exportModel(req, res) {
  console.log("entrei")
  try {
    const db = getDB();

    // 🔹 Buscar dimensões
    const dimensions = await db.all('SELECT * FROM dimension');

    // 🔹 Para cada dimensão, buscar key practices
    const dimensionData = [];
    for (const dim of dimensions) {
      const keyPractices = await db.all(
        'SELECT * FROM keypractice WHERE dimension_id = ?',
        dim.id
      );

      const keyPracticeData = [];
      for (const kp of keyPractices) {
        // Buscar practice instances
        const practiceInstances = await db.all(
          'SELECT * FROM practiceinstance WHERE keypractice_id = ?',
          kp.id
        );

        const practiceInstanceData = [];
        for (const pi of practiceInstances) {
          // Buscar text passages relacionadas
          const textPassages = await db.all(
            'SELECT tp.*, s.title AS study_title, s.authors AS study_authors FROM textpassage tp ' +
            'LEFT JOIN study s ON tp.study_id = s.id ' +
            'WHERE tp.practiceinstance_id = ?',
            pi.id
          );

          practiceInstanceData.push({
            ...pi,
            textPassages
          });
        }

        // Buscar text passages diretamente ligadas ao key practice
        const keyPracticeTextPassages = await db.all(
          'SELECT tp.*, s.title AS study_title, s.authors AS study_authors FROM textpassage tp ' +
          'LEFT JOIN study s ON tp.study_id = s.id ' +
          'WHERE tp.keypractice_id = ?',
          kp.id
        );

        keyPracticeData.push({
          ...kp,
          textPassages: keyPracticeTextPassages,
          practiceInstances: practiceInstanceData
        });
      }

      dimensionData.push({
        DimensionName: dim.name,
        Description: dim.description,
        keyPractices: keyPracticeData
      });
    }

    // 🔹 Montar JSON final
    const exportData = {
      MaturityModel: 'MM4SLR',
      ModelVersion: '1.0',
      LastUpdate: new Date().toISOString().split('T')[0],
      ModelAuthors: [
        'Vinicius dos Santos',
        'Rick Kazman',
        'Rafael Capilla',
        'Elisa Y. Nakagawa'
      ],
      Dimensions: dimensionData
    };

    // 🔹 Salvar em ../../data/data.json

    const outputPath = path.resolve('../data/data.json');
    console.log("Saving to:", outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

    res.json({ success: true, message: 'Data exported successfully', path: outputPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
