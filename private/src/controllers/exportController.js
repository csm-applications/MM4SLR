import { getDB } from '../db/database.js';
import fs from 'fs';
import path from 'path';

export async function exportModel(req, res) {
  try {
    const db = getDB();

    // 🔹 Buscar dimensões
    const dimensions = await db.all('SELECT * FROM dimension');

    const textPassagesQuery = `
      SELECT tp.*, 
             s.title AS study_title, 
             s.authors AS study_authors, 
             s.bibtex_key AS study_bibtex_key
      FROM textpassage tp
      LEFT JOIN study s ON tp.study_id = s.id
      WHERE tp.%s = ?
    `;

    const dimensionData = [];
    for (const dim of dimensions) {
      const keyPractices = await db.all(
        'SELECT * FROM keypractice WHERE dimension_id = ?',
        dim.id
      );

      const keyPracticeData = [];
      for (const kp of keyPractices) {
        const practiceInstances = await db.all(
          'SELECT * FROM practiceinstance WHERE keypractice_id = ?',
          kp.id
        );

        const practiceInstanceData = [];
        for (const pi of practiceInstances) {
          const textPassages = await db.all(
            textPassagesQuery.replace('%s', 'practiceinstance_id'),
            pi.id
          );

          practiceInstanceData.push({
            ...pi,
            textPassages
          });
        }

        const keyPracticeTextPassages = await db.all(
          textPassagesQuery.replace('%s', 'keypractice_id'),
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

    // 🔸 Buscar todos os estudos para exportar .bib
    const studies = await db.all('SELECT * FROM study');

    // 🔸 Montar arquivo BibTeX completo
    const bibEntries = studies.map(study => {
      const fields = [
        ['author', study.authors],
        ['title', study.title],
        ['year', study.year],
        ['month', study.month],
        ['pages', study.pages],
        ['series', study.series],
        ['booktitle', study.booktitle],
        ['publisher', study.publisher],
        ['url', study.url],
        ['doi', study.doi],
        ['collection', study.collection]
      ];

      // Filtra apenas campos que têm valor
      const fieldLines = fields
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .map(([key, value]) => `  ${key} = {${value}}`);

      // Usa o entry_type e bibtex_key do banco
      const entryType = study.entry_type || 'misc';
      const bibKey = study.bibtex_key || `study${study.id}`;

      return `@${entryType}{${bibKey},
${fieldLines.join(',\n')}
}`;
    });

    const bibContent = bibEntries.join('\n\n');

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

    // 🔸 Caminhos de saída
    const outputDir = path.resolve('../data');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const jsonPath = path.join(outputDir, 'data.json');
    const bibPath = path.join(outputDir, 'studies.bib');

    // 🔹 Salvar JSON e BibTeX
    fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');
    fs.writeFileSync(bibPath, bibContent, 'utf-8');

    res.json({
      success: true,
      message: 'Data and BibTeX exported successfully',
      files: {
        json: jsonPath,
        bib: bibPath
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
