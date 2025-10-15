// ============================================
// MM4SLR - JavaScript Refatorado
// ============================================

const jsonPath = '../assets/data.json';
let jsonData = {};
let levelMap = {};
let selectedDimensions = new Set();
let selectedLevels = new Set();

// ============================================
// 1. Popular checkboxes de dimensões
// ============================================
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
            if (input.checked) selectedDimensions.add(dim.DimensionName);
            else selectedDimensions.delete(dim.DimensionName);
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

// ============================================
// 2. Construir o mapa de níveis
// ============================================
function buildLevelMap(data) {
    levelMap = {};
    data.Dimensions.forEach(dim => {
        dim.keyPractices.forEach(kp => {
            const level = `Level ${kp.level_id}`;
            if (!levelMap[level]) levelMap[level] = [];

            levelMap[level].push({
                kpName: kp.description,
                dimension: dim.DimensionName,
                kpTextPassages: kp.textPassages.map(tp => ({
                    text: tp.text,
                    title: tp.study_title,
                    authors: tp.study_authors,
                    bibtex: tp.study_bibtex_key
                })),
                instances: kp.practiceInstances.map(pi => ({
                    practice_instance: pi.description,
                    text: pi.textPassages.map(tp => tp.text).join(' | '),
                    study_bibtex_keys: pi.textPassages.map(tp => tp.study_bibtex_key).join('; '),
                    study_titles: pi.textPassages.map(tp => tp.study_title).join('; '),
                    study_authors: pi.textPassages.map(tp => tp.study_authors || '').join('; ')
                }))
            });
        });
    });
}

// ============================================
// 3. Mostrar níveis
// ============================================
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
            if (input.checked) selectedLevels.add(level);
            else selectedLevels.delete(level);
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

// ============================================
// 4. Mostrar Key Practices (KPs)
// ============================================
function showKPs() {
    const detail = document.getElementById('kpDetail');
    detail.style.display = 'none';

    const kpContainer = document.getElementById('kpContainer');
    kpContainer.innerHTML = '';

    const kpsToShow = [];

    jsonData.Dimensions.forEach(dim => {
        if (selectedDimensions.size === 0 || selectedDimensions.has(dim.DimensionName)) {
            dim.keyPractices.forEach(kp => {
                const level = `Level ${kp.level_id}`;
                if (selectedLevels.size === 0 || selectedLevels.has(level)) {
                    kpsToShow.push({
                        kpName: kp.description,
                        dimension: dim.DimensionName,
                        category: kp.description,
                        kpTextPassages: kp.textPassages.map(tp => ({
                            text: tp.text,
                            title: tp.study_title,
                            authors: tp.study_authors,
                            bibtex: tp.study_bibtex_key
                        })),
                        instances: kp.practiceInstances.map(pi => ({
                            practice_instance: pi.description,
                            text: pi.textPassages.map(tp => tp.text).join(' | '),
                            study_bibtex_keys: pi.textPassages.map(tp => tp.study_bibtex_key).join('; '),
                            study_titles: pi.textPassages.map(tp => tp.study_title).join('; '),
                            study_authors: pi.textPassages.map(tp => tp.study_authors || '').join('; ')
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

    kpsToShow.forEach(({ kpName, instances, dimension, category, kpTextPassages }) => {
        createKPItem(ul, kpName, instances, dimension, category, kpTextPassages);
    });

    kpContainer.appendChild(ul);
}

// ============================================
// 5. Criar item de lista KP
// ============================================
function createKPItem(container, kpName, instances, dimension, category, kpTextPassages) {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = kpName;
    li.style.cursor = "pointer";
    li.addEventListener('click', () => showKPDetail(kpName, instances, dimension, category, kpTextPassages));
    container.appendChild(li);
}

// ============================================
// 6. Mostrar detalhes KP
// ============================================
// ============================================
// 6. Mostrar detalhes KP (com ícone discreto para text passages)
// ============================================
function showKPDetail(kpName, instances, dimension, category, kpTextPassages = []) {
    const detail = document.getElementById('kpDetail');
    detail.style.display = 'block';

    document.getElementById('kpTitle').textContent = kpName;
    document.getElementById('kpDescription').textContent = `Dimension: ${dimension} | Key Practice: ${category}`;

    const cardBody = detail.querySelector('.card-body');
    const tbody = document.getElementById('kpTableBody');
    tbody.innerHTML = '';

    // --- Ícone discreto à direita ---
    let kpIcon = document.getElementById('kpTextPassagesIcon');
    if (!kpIcon) {
        kpIcon = document.createElement('button');
        kpIcon.id = 'kpTextPassagesIcon';
        kpIcon.className = 'btn btn-sm btn-outline-primary float-end';
        kpIcon.innerHTML = `<i class="bi bi-eye"></i>`;
        kpIcon.title = 'View Key Practice text passages';
        kpIcon.style.marginTop = '-5px';

        // Insere logo após o título
        const titleEl = document.getElementById('kpTitle');
        titleEl.style.display = 'inline-block';
        titleEl.parentNode.insertBefore(kpIcon, titleEl.nextSibling);
    }

    // Mostra ou esconde ícone dependendo se tem text passages
    if (kpTextPassages.length > 0) {
        kpIcon.style.display = 'inline-block';
        kpIcon.onclick = () => openKPTextModal(kpTextPassages);
    } else {
        kpIcon.style.display = 'none';
    }

    // --- Practice Instances ---
    if (instances.length === 0) {
        detail.querySelector('table').style.display = 'none';
        if (!detail.querySelector('.no-instances-msg')) {
            const msg = document.createElement('p');
            msg.className = 'no-instances-msg text-muted fst-italic';
            msg.textContent = 'No instances found yet.';
            cardBody.appendChild(msg);
        }
    } else {
        const msg = detail.querySelector('.no-instances-msg');
        if (msg) msg.remove();
        detail.querySelector('table').style.display = '';

        instances.forEach(inst => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td title="${inst.study_titles}">${inst.study_bibtex_keys}</td>
                <td title="${inst.text}">${inst.practice_instance}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary view-texts-btn" title="View instance text passages">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tr.querySelector('.view-texts-btn').addEventListener('click', () => {
                openTextModal(inst.text, inst.study_titles, inst.study_authors);
            });
            tbody.appendChild(tr);
        });
    }
}


// ============================================
// 7A. Abrir modal com text passages de instances
// ============================================
function openTextModal(textString, titleString, authorsString = '') {
    const modalBody = document.getElementById('textModalBody');
    modalBody.innerHTML = '';

    const texts = textString.split(' | ');
    const titles = titleString.split('; ');
    const authors = authorsString ? authorsString.split('; ') : [];

    texts.forEach((t, idx) => {
        const title = titles[idx] || 'Unknown title';
        const author = authors[idx] || 'N/A';

        const div = document.createElement('div');
        div.className = 'mb-4 p-3 border rounded bg-light';
        div.innerHTML = `
            <p class="mb-1"><strong>📖 Title:</strong> ${title}</p>
            <p class="mb-2"><strong>🧑‍🔬 Authors:</strong> ${author}</p>
            <p class="fst-italic text-secondary">${t}</p>
        `;
        modalBody.appendChild(div);
    });

    const modal = new bootstrap.Modal(document.getElementById('textModal'));
    modal.show();
}

// ============================================
// 7B. Abrir modal com text passages da Key Practice
// ============================================
function openKPTextModal(textPassages) {
    const modalBody = document.getElementById('textModalBody');
    modalBody.innerHTML = '';

    if (!textPassages || textPassages.length === 0) {
        modalBody.innerHTML = `<p class="text-muted fst-italic">No text passages for this Key Practice.</p>`;
    } else {
        textPassages.forEach(tp => {
            const div = document.createElement('div');
            div.className = 'mb-4 p-3 border rounded bg-light';
            div.innerHTML = `
                <p class="mb-1"><strong>📖 Title:</strong> ${tp.title || 'Unknown'}</p>
                <p class="mb-2"><strong>🧑‍🔬 Authors:</strong> ${tp.authors || 'N/A'}</p>
                <p class="fst-italic text-secondary">${tp.text}</p>
            `;
            modalBody.appendChild(div);
        });
    }

    const modal = new bootstrap.Modal(document.getElementById('textModal'));
    modal.show();
}

// ============================================
// 8. Inicialização
// ============================================
fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
        jsonData = data;
        buildLevelMap(jsonData);
        populateDimensions(jsonData);
        showLevels();
    })
    .catch(err => console.error('Erro ao carregar JSON:', err));
