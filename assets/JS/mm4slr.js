const jsonPath = '../assets/data.json';
let jsonData = {};
let levelMap = {}; // níveis preenchidos dinamicamente
let selectedDimensions = new Set();
let selectedLevels = new Set();

// 1. Popular checkboxes de dimensões
function populateDimensions(data) {
    const dimensionContainer = document.getElementById('dimensionSelect');
    dimensionContainer.innerHTML = '';

    data.Dimensions.forEach((dim, index) => {
        const div = document.createElement('div');
        div.className = "form-check text-start";

        const input = document.createElement('input');
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = `dim-${index}`;
        input.value = dim.DimensionName;

        input.addEventListener('change', () => {
            if (input.checked) {
                selectedDimensions.add(dim.DimensionName);
            } else {
                selectedDimensions.delete(dim.DimensionName);
            }
            showKPs();
        });

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.setAttribute("for", `dim-${index}`);
        label.textContent = dim.DimensionName;

        div.appendChild(input);
        div.appendChild(label);
        dimensionContainer.appendChild(div);
    });
}

// 2. Construir o mapa de níveis dinamicamente (agora usa bibtex_key)
function buildLevelMap(data) {
    levelMap = {};
    data.Dimensions.forEach(dim => {
        dim.keyPractices.forEach(kp => {
            const level = `Level ${kp.level_id}`;
            if (!levelMap[level]) levelMap[level] = [];

            levelMap[level].push({
                kpName: kp.description,
                dimension: dim.DimensionName,
                instances: kp.practiceInstances.map(pi => ({
                    practice_instance: pi.description,
                    text: pi.textPassages.map(tp => tp.text).join(' | '),
                    study_bibtex_keys: pi.textPassages.map(tp => tp.study_bibtex_key).join('; '),
                    study_titles: pi.textPassages.map(tp => tp.study_title).join('; ')
                }))
            });
        });
    });
}

// 3. Mostrar checkboxes de níveis
function showLevels() {
    const levelsContainer = document.getElementById('levelsContainer');
    levelsContainer.innerHTML = '';

    Object.keys(levelMap).sort().forEach(level => {
        const div = document.createElement('div');
        div.className = "form-check text-start";

        const input = document.createElement('input');
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = `level-${level}`;
        input.value = level;

        input.addEventListener('change', () => {
            if (input.checked) {
                selectedLevels.add(level);
            } else {
                selectedLevels.delete(level);
            }
            showKPs();
        });

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.setAttribute("for", `level-${level}`);
        label.textContent = level;

        div.appendChild(input);
        div.appendChild(label);
        levelsContainer.appendChild(div);
    });
}

// 4. Mostrar KPs conforme filtros
function showKPs() {
    const detail = document.getElementById('kpDetail');
    detail.style.display = 'none';

    const kpContainer = document.getElementById('kpContainer');
    kpContainer.innerHTML = '';

    let kpsToShow = [];

    jsonData.Dimensions.forEach(dim => {
        if (selectedDimensions.size === 0 || selectedDimensions.has(dim.DimensionName)) {
            dim.keyPractices.forEach(kp => {
                const level = `Level ${kp.level_id}`;
                if (selectedLevels.size === 0 || selectedLevels.has(level)) {
                    kpsToShow.push({
                        kpName: kp.description,
                        dimension: dim.DimensionName,
                        category: kp.description,
                        instances: kp.practiceInstances.map(pi => ({
                            practice_instance: pi.description,
                            text: pi.textPassages.map(tp => tp.text).join(' | '),
                            study_bibtex_keys: pi.textPassages.map(tp => tp.study_bibtex_key).join('; '),
                            study_titles: pi.textPassages.map(tp => tp.study_title).join('; ')
                        }))
                    });
                }
            });
        }
    });

    if (kpsToShow.length === 0) return;

    const title = document.createElement('h4');
    title.className = "text-start mb-3";
    title.textContent = "Key Practices (KPs)";
    kpContainer.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = "list-group text-start";

    kpsToShow.forEach(({ kpName, instances, dimension, category }) => {
        createKPItem(ul, kpName, instances, dimension, category);
    });

    kpContainer.appendChild(ul);
}

// 5. Criar item de lista para cada KP
function createKPItem(container, kpName, instances, dimension, category) {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = kpName;
    li.style.cursor = "pointer";
    li.addEventListener('click', () => showKPDetail(kpName, instances, dimension, category));
    container.appendChild(li);
}

// 6. Mostrar detalhes de um KP (agora mostra bibtex_key no lugar de study_id)
function showKPDetail(kpName, instances, dimension, category) {
    const detail = document.getElementById('kpDetail');
    detail.style.display = 'block';
    detail.className = "card mt-4 border-0 shadow-sm";

    const cardBody = detail.querySelector(".card-body");
    cardBody.style.backgroundColor = "#f8f9fa";
    cardBody.style.borderRadius = "10px";

    document.getElementById('kpTitle').textContent = kpName;
    document.getElementById('kpTitle').className = "card-title h4 mb-3 text-primary";
    document.getElementById('kpDescription').textContent = `Dimension: ${dimension} | Key Practice: ${category}`;
    document.getElementById('kpDescription').className = "mb-3 fw-light text-muted";

    const tbody = document.getElementById('kpTableBody');
    tbody.innerHTML = '';

    if (instances.length === 0) {
        const table = detail.querySelector('table');
        if (table) table.style.display = 'none';

        let msg = detail.querySelector('.no-instances-msg');
        if (!msg) {
            msg = document.createElement('p');
            msg.className = 'no-instances-msg text-muted fst-italic';
            msg.textContent = 'No instances found yet.';
            cardBody.appendChild(msg);
        }
    } else {
        const msg = detail.querySelector('.no-instances-msg');
        if (msg) msg.remove();

        const table = detail.querySelector('table');
        if (table) table.style.display = '';

        instances.forEach(inst => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td title="${inst.study_titles}">${inst.study_bibtex_keys}</td>
                <td title="${inst.text}">${inst.practice_instance}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // === Adiciona o div do BibTeX logo abaixo da tabela ===
    let bibDiv = detail.querySelector('.bib-div');
    if (!bibDiv) {
        bibDiv = document.createElement('div');
        bibDiv.className = 'bib-div';
        bibDiv.style.backgroundColor = '#f0f0f0';
        bibDiv.style.padding = '8px 12px';
        bibDiv.style.borderRadius = '5px';
        bibDiv.style.fontSize = '0.95rem';
        bibDiv.style.marginTop = '12px'; // distância da tabela

        const bibLink = document.createElement('a');
        bibLink.href = '../assets/studies.bib';
        bibLink.target = '_blank';
        bibLink.style.textDecoration = 'none';
        bibLink.style.color = '#333';
        bibLink.textContent = 'Check here the references (bibtex file)';

        bibDiv.appendChild(bibLink);
        cardBody.appendChild(bibDiv);
    }
}


// 7. Inicialização
fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
        jsonData = data;
        buildLevelMap(jsonData);
        populateDimensions(jsonData);
        showLevels();
    })
    .catch(err => console.error('Erro ao carregar JSON:', err));
