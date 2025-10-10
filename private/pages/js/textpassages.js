$(document).ready(function () {
    const apiUrl = url + '/textpassages'; // Assumindo que você tem a variável url definida

    // --------------------------
    // Carregar lista de estudos
    // --------------------------
    function loadStudies() {
        $.get(url + '/studies', function (studies) {
            const $select = $('#textPassageStudySelect');
            $select.empty();
            if (studies.length === 0) {
                $select.append('<option disabled>Nenhum estudo disponível</option>');
                return;
            }
            $select.append('<option value="">-- Selecione um estudo --</option>');
            studies.forEach(study => {
                $select.append(`<option value="${study.id}">${study.bibtex_key}</option>`);
            });
        });
    }

    // --------------------------
    // Carregar todas Text Passages
    // --------------------------
    function loadTextPassages() {
        $.get(apiUrl, function (data) {
            const $tbody = $('#textPassageTableBody');
            $tbody.empty();

            data.forEach(async tp => {
                let kpText = '';
                let piText = '';

                // Buscar Key Practice se existir
                if (tp.keypractice_id) {
                    try {
                        const kp = await $.get(url + `/keypractices/${tp.keypractice_id}`);
                        kpText = kp.description;
                    } catch (err) {
                        kpText = 'N/A';
                        console.error('Erro ao carregar Key Practice', err);
                    }
                }

                // Buscar Practice Instance se existir
                if (tp.practiceinstance_id) {
                    try {
                        const pi = await $.get(url + `/practiceinstances/${tp.practiceinstance_id}`);
                        piText = pi.description;
                    } catch (err) {
                        piText = 'N/A';
                        console.error('Erro ao carregar Practice Instance', err);
                    }
                }

                $tbody.append(`
                <tr>
                    <td>${tp.id}</td>
                    <td>${tp.study_id}</td>
                    <td>${kpText}</td>
                    <td>${piText}</td>
                    <td>${tp.text}</td>
                    <td class="d-flex justify-content-center gap-1">
                        <button class="btn btn-sm btn-outline-dark edit" data-id="${tp.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-dark delete" data-id="${tp.id}"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `);
            });
        });
    }

    function loadTextPassagesByPracticeInstance() {
        // Captura o parâmetro da URL
        const urlParams = new URLSearchParams(window.location.search);
        const practiceInstanceId = urlParams.get('practiceInstanceId');
        
        console.log(`${apiUrl}/practiceinstance/${practiceInstanceId}`);

        // Define o endpoint dinamicamente
        const endpoint = practiceInstanceId
            ? `${apiUrl}/practiceinstance/${practiceInstanceId}`
            : apiUrl;

        $.get(endpoint, function (data) {
            const $tbody = $('#textPassageTableBody');
            $tbody.empty();

            data.forEach(async tp => {
                let kpText = '';
                let piText = '';

                // Buscar Key Practice se existir
                if (tp.keypractice_id) {
                    try {
                        const kp = await $.get(url + `/keypractices/${tp.keypractice_id}`);
                        kpText = kp.description;
                    } catch (err) {
                        kpText = 'N/A';
                        console.error('Erro ao carregar Key Practice', err);
                    }
                }

                // Buscar Practice Instance se existir
                if (tp.practiceinstance_id) {
                    try {
                        const pi = await $.get(url + `/practiceinstances/${tp.practiceinstance_id}`);
                        piText = pi.description;
                    } catch (err) {
                        piText = 'N/A';
                        console.error('Erro ao carregar Practice Instance', err);
                    }
                }

                $tbody.append(`
                <tr>
                    <td>${tp.id}</td>
                    <td>${tp.study_id}</td>
                    <td>${kpText}</td>
                    <td>${piText}</td>
                    <td>${tp.text}</td>
                    <td class="d-flex justify-content-center gap-1">
                        <button class="btn btn-sm btn-outline-dark edit" data-id="${tp.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-dark delete" data-id="${tp.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
            });
        }).fail(err => {
            console.error('Erro ao carregar TextPassages:', err);
        });
    }

    // --------------------------
    // Carregar Key Practices
    // --------------------------
    function loadKeyPractices() {
        $.get(url + '/keypractices', function (data) {
            const $select = $('#textPassageKeyPracticeId');
            $select.empty();
            $select.append('<option value="">-- Selecione uma Key Practice --</option>');
            data.forEach(kp => {
                $select.append(`<option value="${kp.id}">${kp.description}</option>`);
            });
        });
    }

    // --------------------------
    // Carregar Practice Instances
    // --------------------------
    function loadPracticeInstances() {
        $.get(url + '/practiceinstances', function (data) {
            const $select = $('#textPassagePracticeInstanceId');
            $select.empty();
            $select.append('<option value="">-- Selecione uma Practice Instance --</option>');
            data.forEach(pi => {
                $select.append(`<option value="${pi.id}">${pi.description}</option>`);
            });
        });
    }


    // --------------------------
    // Abrir modal para novo
    // --------------------------
    $('#newTextPassage').click(function () {
        $('#textPassageId').val('');
        $('#textPassageStudySelect').val('');
        $('#textPassageKeyPracticeId').val('');
        $('#textPassagePracticeInstanceId').val('');
        $('#textPassageText').val('');

        const modal = new bootstrap.Modal(document.getElementById('textPassageModal'));
        modal.show();
    });

    // --------------------------
    // Salvar (create/update)
    // --------------------------
    $('#saveTextPassage').click(function () {
        const id = $('#textPassageId').val();
        const study_id = $('#textPassageStudySelect').val();
        const keypractice_id = $('#textPassageKeyPracticeId').val() || null;
        const practiceinstance_id = $('#textPassagePracticeInstanceId').val() || null;
        const text = $('#textPassageText').val().trim();

        if (!study_id) {
            alert('Selecione um estudo.');
            return;
        }
        if (!text) {
            alert('O campo "Text" é obrigatório.');
            return;
        }

        const payload = { study_id, keypractice_id, practiceinstance_id, text };

        $.ajax({
            url: apiUrl + (id ? `/${id}` : ''),
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                const modalEl = document.getElementById('textPassageModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                loadTextPassages();
            },
            error: function (err) {
                alert('Erro ao salvar Text Passage: ' + (err.responseJSON?.error || err.statusText));
            }
        });
    });

    // --------------------------
    // Editar Text Passage
    // --------------------------
    $('#textPassageTableBody').on('click', '.edit', function () {
        const id = $(this).data('id');
        $.get(`${apiUrl}/${id}`, function (tp) {
            $('#textPassageId').val(tp.id);
            $('#textPassageStudySelect').val(tp.study_id);
            $('#textPassageKeyPracticeId').val(tp.keypractice_id);
            $('#textPassagePracticeInstanceId').val(tp.practiceinstance_id);
            $('#textPassageText').val(tp.text);

            const modal = new bootstrap.Modal(document.getElementById('textPassageModal'));
            modal.show();
        });
    });

    // --------------------------
    // Deletar Text Passage
    // --------------------------
    $('#textPassageTableBody').on('click', '.delete', function () {
        const id = $(this).data('id');
        if (!confirm('Deseja realmente deletar esta Text Passage?')) return;

        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            success: function () {
                loadTextPassages();
            },
            error: function (err) {
                alert('Erro ao deletar Text Passage: ' + (err.responseJSON?.error || err.statusText));
            }
        });
    });

    // --------------------------
    // Inicialização
    // --------------------------
    loadStudies();
    loadTextPassagesByPracticeInstance()
    loadPracticeInstances();
    loadKeyPractices();
});
