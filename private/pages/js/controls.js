$(document).ready(function () {
  const apiUrl = url + '/export'; // mesmo padrão do levels.js

  // ------------------------------
  // EXPORTAR DADOS
  // ------------------------------
  function exportData() {
    $('#status').text('Exporting data...');

    $.ajax({
      url: apiUrl,
      type: 'POST',
      contentType: 'application/json',
      success: function (result) {
        if (result.success) {
          $('#status').text('✅ Data exported successfully!');
        } else {
          $('#status').text('❌ Failed to export data.');
        }
      },
      error: function (err) {
        console.error(err);
        $('#status').text('❌ Error occurred during export.');
      }
    });
  }

  // ------------------------------
  // BOTÃO EXPORTAR
  // ------------------------------
  $('#exportBtn').on('click', exportData);
});
