$(document).ready(function () {
  const apiUrl = url + '/studies';

  // ------------------------------
  // Resetar formulário
  // ------------------------------
  function resetForm() {
    $('#studyId').val('');
    $('#studyBib').val('');
  }

  $('#resetStudy').click(resetForm);

  // ------------------------------
  // Carregar estudos
  // ------------------------------
  function loadStudies() {
    $.get(apiUrl, function (data) {
      const $tbody = $('#studyTableBody');
      $tbody.empty();

      data.forEach(study => {
        const doiLink = study.doi
          ? `<a href="https://doi.org/${study.doi}" target="_blank">${study.doi}</a>`
          : '-';

        $tbody.append(`
        <tr>
          <td><strong>${study.bibtex_key || '-'}</strong></td>
          <td style="max-width: 300px; white-space: pre-wrap; text-align: left;">${study.title || '-'}</td>
          <td style="max-width: 300px; white-space: pre-wrap; text-align: left;">${study.authors || '-'}</td>
          <td>${study.year || '-'}</td>
          <td>${doiLink}</td>
          <td>
            <button class="btn btn-sm btn-outline-dark edit" data-id="${study.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-dark delete" data-id="${study.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `);
      });
    }).fail(function (err) {
      alert('Erro ao carregar estudos.');
      console.error(err);
    });
  }

  function bibToJson(bibText) {
    const entries = bibText.split(/@/).filter(Boolean);
    return entries.map((entry) => {
      const typeMatch = entry.match(/^(\w+){([^,]+),/);
      const type = typeMatch ? typeMatch[1] : "unknown";
      const id = typeMatch ? typeMatch[2] : "unknown";
      const fields = {};
      const fieldRegex = /(\w+)\s*=\s*[{"]([^}"]+)[}"]/g;
      let match;
      while ((match = fieldRegex.exec(entry)) !== null) {
        fields[match[1]] = match[2];
      }
      return { ID: id, ENTRYTYPE: type, ...fields };
    });
  }

  // ------------------------------
  // Salvar (criar ou editar)
  // ------------------------------
  $('#saveStudy').click(function () {
    const id = $('#studyId').val();
    const bib = $('#studyBib').val().trim();


    if (!bib) {
      alert('O campo "BibTex" é obrigatório.');
      return;
    }

    let entry = bibToJson(bib)


    if (id) {
      // EDITAR
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(entry),
        success: function () {
          resetForm();
          loadStudies();
        },
        error: function (err) {
          alert('Erro ao atualizar estudo: ' + (err.responseJSON?.error || err.statusText));
        }
      });
    } else {
      // CRIAR 
      console.log(entry)
      $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(entry),
        success: function () {
          resetForm();
          loadStudies();
        },
        error: function (err) {
          alert('Erro ao criar estudo: ' + (err.responseJSON?.error || err.statusText));
        }
      });
    }
  });

  // ------------------------------
  // Editar
  // ------------------------------
  $('#studyTableBody').on('click', '.edit', function () {
    const id = $(this).data('id');
    $.get(`${apiUrl}/${id}`, function (study) {
      $('#studyId').val(study.id);

      // Reconstrói um BibTex simples para edição (não precisa ser perfeito)
      const bibPreview = `
@${study.entry_type || 'inproceedings'}{${study.bibtex_key},
  title = {${study.title || ''}},
  author = {${study.authors || ''}},
  year = {${study.year || ''}},
  month = {${study.month || ''}},
  pages = {${study.pages || ''}},
  series = {${study.series || ''}},
  booktitle = {${study.booktitle || ''}},
  publisher = {${study.publisher || ''}},
  url = {${study.url || ''}},
  doi = {${study.doi || ''}},
  collection = {${study.collection || ''}}
}`;
      $('#studyBib').val(bibPreview.trim());
    }).fail(function (err) {
      alert('Erro ao buscar estudo: ' + (err.responseJSON?.error || err.statusText));
    });
  });

  // ------------------------------
  // Deletar
  // ------------------------------
  $('#studyTableBody').on('click', '.delete', function () {
    const id = $(this).data('id');
    if (!confirm('Tem certeza que deseja deletar este estudo?')) return;

    $.ajax({
      url: `${apiUrl}/${id}`,
      type: 'DELETE',
      success: function () {
        loadStudies();
      },
      error: function (err) {
        alert('Erro ao deletar estudo: ' + (err.responseJSON?.error || err.statusText));
      }
    });
  });

  // ------------------------------
  // Inicialização
  // ------------------------------
  loadStudies();
});
