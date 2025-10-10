import { getDB } from '../db/database.js';

// 🔸 Lista todos os estudos
export async function getAllStudies() {
  const db = getDB();
  return db.all('SELECT * FROM study');
}

// 🔸 Busca um estudo pelo ID
export async function getStudyById(id) {
  const db = getDB();
  return db.get('SELECT * FROM study WHERE id = ?', [id]);
}

// 🔸 Cria um novo estudo
export async function createStudy(data) {
  console.log(data)
  const db = getDB();
  const {
    bibtex_key,
    entry_type,
    title,
    author,
    year,
    month,
    pages,
    series,
    booktitle,
    publisher,
    url,
    doi,
    collection
  } = data;

  const result = await db.run(
    `
    INSERT INTO study (
      bibtex_key,
      entry_type,
      title,
      authors,
      year,
      month,
      pages,
      series,
      booktitle,
      publisher,
      url,
      doi,
      collection
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      bibtex_key,
      entry_type,
      title,
      author,
      year,
      month,
      pages,
      series,
      booktitle,
      publisher,
      url,
      doi,
      collection
    ]
  );

  return getStudyById(result.lastID);
}

// 🔸 Atualiza um estudo existente
export async function updateStudy(id, data) {
  const db = getDB();
  const {
    bibtex_key,
    entry_type,
    title,
    authors,
    year,
    month,
    pages,
    series,
    booktitle,
    publisher,
    url,
    doi,
    collection
  } = data;

  await db.run(
    `
    UPDATE study
    SET bibtex_key = ?, entry_type = ?, title = ?, authors = ?, year = ?, month = ?, pages = ?,
        series = ?, booktitle = ?, publisher = ?, url = ?, doi = ?, collection = ?
    WHERE id = ?
    `,
    [
      bibtex_key,
      entry_type,
      title,
      authors,
      year,
      month,
      pages,
      series,
      booktitle,
      publisher,
      url,
      doi,
      collection,
      id
    ]
  );

  return getStudyById(id);
}

// 🔸 Exclui um estudo
export async function deleteStudy(id) {
  const db = getDB();
  await db.run('DELETE FROM study WHERE id = ?', [id]);
}
