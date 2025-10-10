$(document).ready(function () {

    const apiUrl = url + '/practiceinstances';

    // ------------------------------
    // Função para obter query params da URL
    // ------------------------------
    function getQueryParams() {
        const params = {};
        const search = window.location.search.substring(1);
        if (search) {
            search.split("&").forEach(pair => {
                const [key, value] = pair.split("=");
                params[key] = decodeURIComponent(value);
            });
        }
        return params;
    }

    const query = getQueryParams();
    const keyPracticeId = query.kpId;

    // Atualiza hidden field
    $('#practiceInstanceKeyPracticeId').val(keyPracticeId);

    // ------------------------------
    // Carregar dados da Key Practice
    // ------------------------------
    function loadKeyPractice() {
        if (!keyPracticeId) return;

        $.get(url + '/keypractices/' + keyPracticeId, function (kp) {
            $('#kpTitle').text(`Practice Instances for Key Practice: ${kp.description || ''}`);
            const html = `
                <h5>KP Details:</h5>
                <br>
                <p><strong>KP-Id:</strong> ${kp.id}</p>
                <p><strong>Description:</strong> ${kp.description}</p>
                <p><strong>Owner:</strong> ${kp.owner || 'N/A'}</p>
            `;
            $('#keyPracticeInfo').html(html);
        }).fail(function (err) {
            $('#keyPracticeInfo').html('<p class="text-danger">Erro ao carregar Key Practice.</p>');
            console.error(err);
        });
    }

    function loadStudies() {
        $.get(url + '/studies', function (studies) {
            const $select = $('#studySelect');
            $select.empty(); // limpa opções existentes

            if (studies.length === 0) {
                $select.append('<option disabled>Nenhum estudo disponível</option>');
                return;
            }

            $select.append('<option value="">-- Selecione um estudo --</option>');

            studies.forEach(study => {
                // mostra bibtex_key, valor é o id
                $select.append(`<option value="${study.id}">${study.bibtex_key}</option>`);
            });
        }).fail(function (err) {
            $('#studySelect').html('<option class="text-danger">Erro ao carregar estudos</option>');
            console.error('Erro ao carregar estudos:', err);
        });
    }


    // ------------------------------
    // Resetar formulário
    // ------------------------------
    function resetForm() {
        $('#practiceInstanceId').val('');
        $('#practiceInstanceDescription').val('');
    }

    $('#resetPracticeInstance').click(resetForm);

    // ------------------------------
    // Carregar Practice Instances
    // ------------------------------
    function loadPracticeInstances() {
        if (!keyPracticeId) return;

        $.get(apiUrl, { keypractice_id: keyPracticeId }, function (data) {
            const $tbody = $('#practiceInstanceTableBody');
            $tbody.empty();
            console.log(data)
            data.forEach(pi => {
                $tbody.append(`
                    <tr>
                        <td>${pi.id}</td>
                        <td>${pi.description}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-dark edit" data-id="${pi.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-dark delete" data-id="${pi.id}"><i class="bi bi-trash"></i></button>
                            <button class="btn btn-sm btn-outline-success add-textpassage" data-id="${pi.id}">+</button>
                        </td>
                    </tr>
                `);
            });
        }).fail(function (err) {
            alert('Erro ao carregar Practice Instances.');
            console.error(err);
        });
    }

    // ------------------------------
    // Salvar (criar ou editar) Practice Instance
    // ------------------------------
    $('#savePracticeInstance').click(function () {

        const id = $('#practiceInstanceId').val();
        const description = $('#practiceInstanceDescription').val().trim();
        const studyId = $('#studySelect').val();           // opcional: se quiser enviar study_id também
        const keypractice_id = keyPracticeId;              // já existente

        if (!description) {
            alert('O campo "Description" é obrigatório.');
            return;
        }

        const payload = {
            description,
            keypractice_id,
            study_id: studyId      // se precisar relacionar com estudo
        };

        console.log(payload)

        if (id) {
            // EDITAR
            $.ajax({
                url: `${apiUrl}/${id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function () {
                    resetForm();
                    loadPracticeInstances();
                },
                error: function (err) {
                    alert('Erro ao atualizar Practice Instance: ' + (err.responseJSON?.error || err.statusText));
                }
            });
        } else {
            // CRIAR
            $.ajax({
                url: apiUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function () {
                    resetForm();
                    loadPracticeInstances();
                },
                error: function (err) {
                    alert('Erro ao criar Practice Instance: ' + (err.responseJSON?.error || err.statusText));
                }
            });
        }
    });


    // ------------------------------
    // Editar Practice Instance
    // ------------------------------
    $('#practiceInstanceTableBody').on('click', '.edit', function () {
        const id = $(this).data('id');
        $.get(`${apiUrl}/${id}`, function (pi) {
            $('#practiceInstanceId').val(pi.id);
            $('#practiceInstanceDescription').val(pi.description);
        }).fail(function (err) {
            alert('Erro ao buscar Practice Instance: ' + (err.responseJSON?.error || err.statusText));
        });
    });

    // ------------------------------
    // Deletar Practice Instance
    // ------------------------------
    $('#practiceInstanceTableBody').on('click', '.delete', function () {
        const id = $(this).data('id');
        if (!confirm('Tem certeza que deseja deletar esta Practice Instance?')) return;

        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            success: function () {
                loadPracticeInstances();
            },
            error: function (err) {
                alert('Erro ao deletar Practice Instance: ' + (err.responseJSON?.error || err.statusText));
            }
        });
    });

    // ------------------------------
    // Inicialização
    // ------------------------------
    loadKeyPractice();
    loadPracticeInstances();
    loadStudies();
    loadStudiesForTextPassage();

    // ------------------------------
    // Botão voltar
    // ------------------------------
    $('#backToKeyPractices').click(function () {
        window.location.href = 'keyPractices.html';
    });


    $('#practiceInstanceTableBody').on('click', '.add-textpassage', function () {
        const practiceInstanceId = $(this).data('id');
        const keyPracticeId = $('#practiceInstanceKeyPracticeId').val();

        // Atualiza hidden fields do modal
        $('#textPassagePracticeInstanceId').val(practiceInstanceId);
        $('#textPassageKeyPracticeId').val(keyPracticeId);
        $('#textPassageId').val('');
        $('#textPassageText').val('');
        $('#textPassageStudySelect').val('');

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('textPassageModal'));
        modal.show();
    });

    function loadStudiesForTextPassage() {
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
        }).fail(function (err) {
            console.error('Erro ao carregar estudos para Text Passage:', err);
        });
    }


    $('#saveTextPassage').click(function () {
        const id = $('#textPassageId').val();
        const study_id = $('#textPassageStudySelect').val();
        const keypractice_id = $('#textPassageKeyPracticeId').val();
        const practiceinstance_id = $('#textPassagePracticeInstanceId').val();
        const text = $('#textPassageText').val().trim();

        if (!study_id) {
            alert('Selecione um estudo.');
            return;
        }
        if (!text) {
            alert('O campo "Text Passage" é obrigatório.');
            return;
        }

        const payload = { study_id, keypractice_id, practiceinstance_id, text };

        const ajaxOptions = {
            url: url + '/textpassages' + (id ? `/${id}` : ''),
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (response) {
                alert('Text Passage salva com sucesso! ID: ' + response.id);
                // Fechar modal
                const modalEl = document.getElementById('textPassageModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                // Aqui você pode atualizar uma lista de text passages se tiver
            },
            error: function (err) {
                alert('Erro ao salvar Text Passage: ' + (err.responseJSON?.error || err.statusText));
            }
        };

        $.ajax(ajaxOptions);
    });





});
