$(document).ready(function() {

  const apiUrl = url + '/levels';

  // ------------------------------
  // FUNÇÃO PARA CARREGAR LEVELS
  // ------------------------------
  function loadLevels() {
    $.get(apiUrl, function(data) {
      const $tbody = $('#levelTableBody');
      $tbody.empty();

      data.forEach(level => {
        $tbody.append(`
          <tr>
            <td>${level.id}</td>
            <td>${level.value}</td>
            <td>${level.name}</td>
            <td>${level.description || ''}</td>
            <td class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-dark edit" data-id="${level.id}"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-outline-dark edit" data-id="${level.id}"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `);
      });
    });
  }

  // ------------------------------
  // RESETAR FORMULÁRIO
  // ------------------------------
  function resetForm() {
    $('#levelId').val('');
    $('#levelValue').val('');
    $('#levelName').val('');
    $('#levelDescription').val('');
  }

  $('#resetLevel').click(resetForm);

  // ------------------------------
  // SALVAR LEVEL (CRIAR OU EDITAR)
  // ------------------------------
  $('#saveLevel').click(function() {
    const id = $('#levelId').val();
    const value = parseInt($('#levelValue').val(), 10);
    const name = $('#levelName').val().trim();
    const description = $('#levelDescription').val().trim();

    if (value === undefined || isNaN(value)) {
      alert('O campo "Value" é obrigatório e deve ser um número.');
      return;
    }
    if (!name) {
      alert('O campo "Name" é obrigatório.');
      return;
    }

    const payload = { value, name, description };

    if (id) {
      // EDITAR
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function() {
          resetForm();
          loadLevels();
        },
        error: function(err) {
          alert('Erro ao atualizar level: ' + err.responseJSON?.error || err.statusText);
        }
      });
    } else {
      // CRIAR
      $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function() {
          resetForm();
          loadLevels();
        },
        error: function(err) {
          alert('Erro ao criar level: ' + err.responseJSON?.error || err.statusText);
        }
      });
    }
  });

  // ------------------------------
  // EDITAR LEVEL (CARREGAR NO FORMULÁRIO)
  // ------------------------------
  $('#levelTableBody').on('click', '.edit', function() {
    const id = $(this).data('id');
    $.get(`${apiUrl}/${id}`, function(level) {
      $('#levelId').val(level.id);
      $('#levelValue').val(level.value);
      $('#levelName').val(level.name);
      $('#levelDescription').val(level.description || '');
    }).fail(function(err) {
      alert('Erro ao buscar level: ' + err.responseJSON?.error || err.statusText);
    });
  });

  // ------------------------------
  // DELETAR LEVEL
  // ------------------------------
  $('#levelTableBody').on('click', '.delete', function() {
    if (!confirm('Tem certeza que deseja deletar este level?')) return;
    const id = $(this).data('id');

    $.ajax({
      url: `${apiUrl}/${id}`,
      type: 'DELETE',
      success: function() {
        loadLevels();
      },
      error: function(err) {
        alert('Erro ao deletar level: ' + err.responseJSON?.error || err.statusText);
      }
    });
  });

  // CARREGAR LEVELS AO INICIAR
  loadLevels();

});
