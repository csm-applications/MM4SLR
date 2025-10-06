const jsonPath = '../../data/data.json';
let jsonData = {};
let levelMap = {}; // níveis preenchidos dinamicamente
let selectedDimensions = new Set();
let selectedLevels = new Set();

// 1. Popular checkboxes de dimensões
function populateDimensions(data) {
    const dimensionContainer = document.getElementById('dimensionSelect');
    dimensionContainer.innerHTML = '';

    Object.keys(data).forEach(dim => {
        const div = document.createElement('div');
        div.className = "form-check text-start";

        const input = document.createElement('input');
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = `dim-${dim}`;
        input.value = dim;

        input.addEventListener('change', () => {
            if (input.checked) {
                selectedDimensions.add(dim);
            } else {
                selectedDimensions.delete(dim);
            }
            showKPs();
        });

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.setAttribute("for", `dim-${dim}`);
        label.textContent = dim;

        div.appendChild(input);
        div.appendChild(label);
        dimensionContainer.appendChild(div);
    });
}

// 2. Construir o mapa de níveis dinamicamente
function buildLevelMap(data) {
    levelMap = {};
    Object.keys(data).forEach(dimension => {
        const dimData = data[dimension];
        Object.keys(dimData).forEach(category => {
            const entry = dimData[category];
            const level = `Level ${entry.level}`;
            if (!levelMap[level]) levelMap[level] = [];
            levelMap[level].push({ category, dimension, instances: entry.practice_instances });
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
    const kpContainer = document.getElementById('kpContainer');
    kpContainer.innerHTML = '';

    let kpsToShow = [];

    if (selectedDimensions.size > 0) {
        selectedDimensions.forEach(dim => {
            const dimData = jsonData[dim];
            Object.keys(dimData).forEach(category => {
                const entry = dimData[category];
                if (selectedLevels.size === 0 || selectedLevels.has(`Level ${entry.level}`)) {
                    kpsToShow.push({ category, dimension: dim, instances: entry.practice_instances });
                }
            });
        });
    } else if (selectedLevels.size > 0) {
        selectedLevels.forEach(level => {
            if (levelMap[level]) {
                kpsToShow = kpsToShow.concat(levelMap[level]);
            }
        });
    }

    if (kpsToShow.length === 0) return;

    const title = document.createElement('h4');
    title.className = "text-start mb-3";
    title.textContent = "Knowledge Practices (KPs)";
    kpContainer.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = "list-group text-start";

    kpsToShow.forEach(({ category, dimension, instances }) => {
        createKPItem(ul, category, instances, dimension, category);
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

// 6. Mostrar detalhes de um KP
function showKPDetail(kpName, instances, dimension, category) {
    const detail = document.getElementById('kpDetail');
    detail.style.display = 'block';
    detail.className = "card mt-4 border-0 shadow-sm";

    const cardBody = detail.querySelector(".card-body");
    cardBody.style.backgroundColor = "#f8f9fa";
    cardBody.style.borderRadius = "10px";

    document.getElementById('kpTitle').textContent = kpName;
    document.getElementById('kpTitle').className = "card-title h4 mb-3 text-primary";
    document.getElementById('kpDescription').textContent = `Dimension: ${dimension} | Category: ${category}`;
    document.getElementById('kpDescription').className = "mb-3 fw-light text-muted";

    const tbody = document.getElementById('kpTableBody');
    tbody.innerHTML = '';

    instances.forEach(inst => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${inst.bibtexkey}</td><td>${inst.text}</td>`;
        tbody.appendChild(tr);
    });
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
