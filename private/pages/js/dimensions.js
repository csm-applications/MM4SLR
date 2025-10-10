
$(document).ready(function() {

  const apiUrl = url + '/dimensions';

  // ------------------------------
  // FUNÇÃO PARA CARREGAR DIMENSIONS
  // ------------------------------
  function loadDimensions() {
    $.get(apiUrl, function(data) {
      const $tbody = $('#dimensionTableBody');
      $tbody.empty();

      data.forEach(dim => {
        $tbody.append(`
          <tr>
            <td>${dim.id}</td>
            <td>${dim.name}</td>
            <td>${dim.description || ''}</td>
            <td class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-dark edit" data-id="${dim.id}"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-outline-dark edit" data-id="${dim.id}"><i class="bi bi-trash"></i></button>
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
    $('#dimensionId').val('');
    $('#dimensionName').val('');
    $('#dimensionDescription').val('');
  }

  $('#resetDimension').click(resetForm);

  // ------------------------------
  // SALVAR DIMENSION (CRIAR OU EDITAR)
  // ------------------------------
  $('#saveDimension').click(function() {
    const id = $('#dimensionId').val();
    const name = $('#dimensionName').val().trim();
    const description = $('#dimensionDescription').val().trim();

    if (!name) {
      alert('O campo "Name" é obrigatório.');
      return;
    }

    const payload = { name, description };

    if (id) {
      // EDITAR
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function() {
          resetForm();
          loadDimensions();
        },
        error: function(err) {
          alert('Erro ao atualizar dimension: ' + err.responseJSON?.error || err.statusText);
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
          loadDimensions();
        },
        error: function(err) {
          alert('Erro ao criar dimension: ' + err.responseJSON?.error || err.statusText);
        }
      });
    }
  });

  // ------------------------------
  // EDITAR DIMENSION (CARREGAR NO FORMULÁRIO)
  // ------------------------------
  $('#dimensionTableBody').on('click', '.edit', function() {
    const id = $(this).data('id');
    $.get(`${apiUrl}/${id}`, function(dim) {
      $('#dimensionId').val(dim.id);
      $('#dimensionName').val(dim.name);
      $('#dimensionDescription').val(dim.description || '');
    }).fail(function(err) {
      alert('Erro ao buscar dimension: ' + err.responseJSON?.error || err.statusText);
    });
  });

  // ------------------------------
  // DELETAR DIMENSION
  // ------------------------------
  $('#dimensionTableBody').on('click', '.delete', function() {
    if (!confirm('Tem certeza que deseja deletar esta dimension?')) return;
    const id = $(this).data('id');

    $.ajax({
      url: `${apiUrl}/${id}`,
      type: 'DELETE',
      success: function() {
        loadDimensions();
      },
      error: function(err) {
        alert('Erro ao deletar dimension: ' + err.responseJSON?.error || err.statusText);
      }
    });
  });

  // CARREGAR DIMENSIONS AO INICIAR
  loadDimensions();

});
