$(document).ready(function () {

  const apiUrl = url + '/keypractices';
  const levelsUrl = url + '/levels';
  const dimensionsUrl = url + '/dimensions';

  // ------------------------------
  // CARREGAR KEY PRACTICES COM CONTAGEM DE INSTANCES
  // ------------------------------
  function loadKeyPractices(filters = {}) {
    $.get(apiUrl, function (data) {
      const $tbody = $('#keyPracticeTableBody');
      $tbody.empty();

      console.log('loadKeyPractices called with filters:', filters);


      const filtered = data.filter(kp => {
        if (filters.level && kp.level_id != filters.level) return false;
        if (filters.dimension && kp.dimension_id != filters.dimension) return false;
        if (filters.description && !kp.description.toLowerCase().includes(filters.description.toLowerCase())) return false;
        return true;
      });

      const promises = filtered.map(kp => {
        return $.get(`${apiUrl}/${kp.id}/instances/count`).then(countData => {
          return {
            ...kp,
            instanceCount: countData.count || 0
          };
        });
      });

      Promise.all(promises).then(results => {
        results.forEach(kp => {
          $tbody.append(`
          <tr>
            <td>${kp.id}</td>
            <td>${kp.description}</td>
            <td>${kp.level_name || ''}</td>
            <td>${kp.dimension_name || ''}</td>
            <td>${kp.instanceCount}</td>
            <td class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-dark edit" data-id="${kp.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-dark delete" data-id="${kp.id}">
                <i class="bi bi-trash"></i>
              </button>
              <button class="btn btn-sm btn-outline-dark manage-instances" 
                onclick="window.location.href='practiceInstances.html?kpId=${kp.id}'">
                <i class="bi bi-grid-3x3-gap"></i>
              </button>
              <button class="btn btn-sm btn-outline-dark manage-instances" 
                onclick="window.location.href='textpassages.html?keypracticeId=${kp.id}'">
                <i class="bi bi-card-text"></i>
              </button>
            </td>
          </tr>
        `);
        });
      });
    });
  }


  // ------------------------------
  // RESETAR FORMULÁRIO
  // ------------------------------
  function resetForm() {
    $('#keyPracticeId').val('');
    $('#keyPracticeDescription').val('');
    $('#keyPracticeLevel').val('');
    $('#keyPracticeDimension').val('');
  }

  $('#resetKeyPractice').click(resetForm);

  // ------------------------------
  // SALVAR KEY PRACTICE
  // ------------------------------
  $('#saveKeyPractice').click(function () {
    const id = $('#keyPracticeId').val();
    const description = $('#keyPracticeDescription').val().trim();
    const level_id = $('#keyPracticeLevel').val();
    const dimension_id = $('#keyPracticeDimension').val();

    if (!description || !level_id || !dimension_id) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    const payload = { description, level_id, dimension_id };

    const ajaxOptions = {
      url: id ? `${apiUrl}/${id}` : apiUrl,
      type: id ? 'PUT' : 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function () {
        resetForm();
        loadKeyPractices();
      },
      error: function (err) {
        alert('Erro ao salvar Key Practice: ' + (err.responseJSON?.error || err.statusText));
      }
    };

    $.ajax(ajaxOptions);
  });

  // ------------------------------
  // EDITAR KEY PRACTICE
  // ------------------------------
  $('#keyPracticeTableBody').on('click', '.edit', function () {
    const id = $(this).data('id');
    $.get(`${apiUrl}/${id}`, function (kp) {
      $('#keyPracticeId').val(kp.id);
      $('#keyPracticeDescription').val(kp.description);
      $('#keyPracticeLevel').val(kp.level_id);
      $('#keyPracticeDimension').val(kp.dimension_id);
    }).fail(function (err) {
      alert('Erro ao buscar Key Practice: ' + (err.responseJSON?.error || err.statusText));
    });
  });

  // ------------------------------
  // DELETAR KEY PRACTICE
  // ------------------------------
  $('#keyPracticeTableBody').on('click', '.delete', function () {
    if (!confirm('Tem certeza que deseja deletar esta Key Practice?')) return;
    const id = $(this).data('id');

    $.ajax({
      url: `${apiUrl}/${id}`,
      type: 'DELETE',
      success: function () {
        loadKeyPractices();
      },
      error: function (err) {
        alert('Erro ao deletar Key Practice: ' + (err.responseJSON?.error || err.statusText));
      }
    });
  });

  function loadDropdowns() {
    // Levels
    $.get(levelsUrl, function (data) {
      const $levelSelect = $('#keyPracticeLevel'); // form
      const $filterLevel = $('#filterLevel');       // th
      $levelSelect.empty().append('<option value="">Select Level</option>');
      $filterLevel.empty().append('<option value="">All Levels</option>');

      data.forEach(lvl => {
        const option = `<option value="${lvl.id}">${lvl.value} - ${lvl.name}</option>`;
        $levelSelect.append(option);
        $filterLevel.append(option);
      });
    });

    // Dimensions
    $.get(dimensionsUrl, function (data) {
      const $dimSelect = $('#keyPracticeDimension'); // form
      const $filterDimension = $('#filterDimension'); // th
      $dimSelect.empty().append('<option value="">Select Dimension</option>');
      $filterDimension.empty().append('<option value="">All Dimensions</option>');

      data.forEach(dim => {
        const option = `<option value="${dim.id}">${dim.name}</option>`;
        $dimSelect.append(option);
        $filterDimension.append(option);
      });
    });
  }

  $('#filterLevel, #filterDimension').on('change', function () {
    const filters = {
      level: $('#filterLevel').val(),
      dimension: $('#filterDimension').val(),
      description: $('#filterDescription').val().trim()
    };
    loadKeyPractices(filters);
  });

  $('#filterDescription').on('input', function () {
    const filters = {
      level: $('#filterLevel').val(),
      dimension: $('#filterDimension').val(),
      description: $('#filterDescription').val().trim()
    };
    loadKeyPractices(filters);
  });

  // ------------------------------
  // INICIALIZAÇÃO
  // ------------------------------
  loadDropdowns();
  loadKeyPractices();

});
