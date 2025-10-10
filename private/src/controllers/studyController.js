import {
  getAllStudies,
  getStudyById,
  createStudy,
  updateStudy,
  deleteStudy
} from '../models/studyModel.js';

// 🔸 Listar todos os estudos
export async function listStudies(req, res) {
  try {
    const studies = await getAllStudies();
    res.json(studies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 🔸 Buscar estudo por ID
export async function getStudy(req, res) {
  try {
    const { id } = req.params;
    const study = await getStudyById(id);
    if (!study) {
      return res.status(404).json({ error: 'Study não encontrado' });
    }
    res.json(study);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createNewStudy(req, res) {
  try {
    const entries = [req.body[0]];

    const createdStudies = [];

    for (const entry of entries) {
      const {
        ID,
        ENTRYTYPE,
        title,
        author,
        year,
        month,
        pages,
        series,
        booktitle,
        publisher,
        url,
        DOI,
        collection
      } = entry;


      if (!ID || !ENTRYTYPE || !title || !author) {
        return res.status(400).json({
          error: 'Campos "ID", "ENTRYTYPE", "title" e "author" são obrigatórios em todos os estudos.'
        });
      }


      const newStudy = await createStudy({
        bibtex_key: ID,
        entry_type: ENTRYTYPE,
        title,
        author,
        year,
        month,
        pages,
        series,
        booktitle,
        publisher,
        url,
        doi: DOI,
        collection
      });

      createdStudies.push(newStudy);
    }

    res.status(201).json(createdStudies);
  } catch (err) {
    console.log(err)
  }
}



// 🔸 Atualizar estudo existente
export async function updateExistingStudy(req, res) {
  try {
    const { id } = req.params;
    const existing = await getStudyById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Study não encontrado' });
    }

    const updatedData = {
      bibtex_key: req.body.bibtex_key ?? existing.bibtex_key,
      entry_type: req.body.entry_type ?? existing.entry_type,
      title: req.body.title ?? existing.title,
      authors: req.body.authors ?? existing.authors,
      year: req.body.year ?? existing.year,
      month: req.body.month ?? existing.month,
      pages: req.body.pages ?? existing.pages,
      series: req.body.series ?? existing.series,
      booktitle: req.body.booktitle ?? existing.booktitle,
      publisher: req.body.publisher ?? existing.publisher,
      url: req.body.url ?? existing.url,
      doi: req.body.doi ?? existing.doi,
      collection: req.body.collection ?? existing.collection
    };

    const updated = await updateStudy(id, updatedData);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 🔸 Excluir estudo
export async function removeStudy(req, res) {
  try {
    const { id } = req.params;
    const existing = await getStudyById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Study não encontrado' });
    }

    await deleteStudy(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
