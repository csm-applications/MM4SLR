$(document).ready(function () {

  let items = [];

  // ===============================
  // 1️⃣ Load Key Practices
  // ===============================
  function loadItems() {
    console.log("Loading items for merge...");
    $("#mergeTable tbody").empty();

    $.get(`${url}/keypractices`, function (data) {
      items = data;
      populateFilters(items);
      renderItems();
    });
  }

  // ===============================
  // 2️⃣ Populate Filters
  // ===============================
  function populateFilters(items) {
    // Extract unique level names and dimension names
    const levels = [...new Set(items.map(i => i.level_name))];
    const dimensions = [...new Set(items.map(i => i.dimension_name))];

    console.log("Available Levels:", levels);
    console.log("Available Dimensions:", dimensions);

    const levelSelect = $("#filterLevel");
    const dimensionSelect = $("#filterDimension");

    // Remove existing options except first
    levelSelect.find("option:not(:first)").remove();
    dimensionSelect.find("option:not(:first)").remove();

    // Populate dropdowns
    levels.forEach(lvl => {
      levelSelect.append(`<option value="${lvl}">${lvl}</option>`);
    });

    dimensions.forEach(dim => {
      dimensionSelect.append(`<option value="${dim}">${dim}</option>`);
    });
  }

  // ===============================
  // 3️⃣ Filtered Items
  // ===============================
  function getFilteredItems() {
    const selectedLevel = $("#filterLevel").val();
    const selectedDimension = $("#filterDimension").val();

    return items.filter(item => {
      const matchLevel = selectedLevel ? item.level_name === selectedLevel : true;
      const matchDimension = selectedDimension ? item.dimension_name === selectedDimension : true;
      return matchLevel && matchDimension;
    });
  }

  // ===============================
  // 4️⃣ Render Table
  // ===============================
  function renderItems() {
    const filteredItems = getFilteredItems();
    const tbody = $("#mergeTable tbody");
    tbody.empty();

    filteredItems.forEach(item => {
      const row = $(`
        <tr class="merge-row" data-id="${item.id}" draggable="true">
          <td class="drag-handle text-center">☰</td>
          <td>${item.description}</td>
          <td class="similar-concepts"
              style="background:#f8f9fa;
                     min-height:50px;
                     border:1px dashed #adb5bd;
                     vertical-align:top;
                     position:relative;
                     transition: background-color 0.2s ease;">
          </td>
          <td class="merge-input-cell"></td>
        </tr>
      `);
      tbody.append(row);
    });

    initDragDrop();
  }

  // ===============================
  // 5️⃣ Drag & Drop
  // ===============================
  function initDragDrop() {
    $(".merge-row").off("dragstart").on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("text/plain", $(this).data("id"));
      e.originalEvent.dataTransfer.effectAllowed = "move";
    });

    $(".similar-concepts").each(function () {
      const cell = $(this);
      cell.css({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        padding: "5px",
        gap: "4px",
        minHeight: "50px"
      });

      cell.off("dragover").on("dragover", function (e) {
        e.preventDefault();
        $(this).css({ backgroundColor: "#eef2f4", borderColor: "#6c757d" });
      });

      cell.off("dragleave").on("dragleave", function () {
        $(this).css({ backgroundColor: "#f8f9fa", borderColor: "#adb5bd" });
      });

      cell.off("drop").on("drop", function (e) {
        e.preventDefault();
        $(this).css({ backgroundColor: "#f8f9fa", borderColor: "#adb5bd" });

        const draggedId = e.originalEvent.dataTransfer.getData("text/plain");
        const draggedRow = $(`.merge-row[data-id='${draggedId}']`);
        const draggedDesc = draggedRow.find("td:nth-child(2)").text();

        draggedRow.remove();

        const conceptItem = $(`
          <div class="concept-item"
               style="border:1px solid #6c757d;
                      background:#ffffff;
                      padding:4px 6px;
                      cursor:grab;
                      text-align:left;">
            ${draggedDesc}
          </div>
        `).attr("draggable", "true").attr("data-id", draggedId);

        $(this).append(conceptItem);

        const parentRow = $(this).closest("tr");
        if (parentRow.find(".merge-input-cell input").length === 0) {
          parentRow.find(".merge-input-cell").html(`
            <input type="text" class="form-control merge-desc"
                   value="${draggedDesc}" placeholder="New description for merge">
          `);
        }

        conceptItem.on("dragstart", function (ev) {
          ev.originalEvent.dataTransfer.setData("text/concept-id", $(this).data("id"));
        });
      });
    });

    $("#mergeTable tbody")
      .off("dragover drop")
      .on("dragover", "tr", function (e) { e.preventDefault(); })
      .on("drop", "tr", function (e) {
        const conceptId = e.originalEvent.dataTransfer.getData("text/concept-id");
        if (!conceptId) return;

        $(`.concept-item[data-id='${conceptId}']`).remove();

        const originalItem = items.find(i => i.id == conceptId);
        if (!originalItem) return;

        const newRow = $(`
          <tr class="merge-row" data-id="${originalItem.id}" draggable="true">
            <td class="drag-handle text-center">☰</td>
            <td>${originalItem.description}</td>
            <td class="similar-concepts"
                style="background:#f8f9fa;
                       min-height:50px;
                       border:1px dashed #adb5bd;
                       vertical-align:top;
                       position:relative;
                       transition: background-color 0.2s ease;">
            </td>
            <td class="merge-input-cell"></td>
          </tr>
        `);
        $(this).after(newRow);
        initDragDrop();
      });
  }

  // ===============================
  // 6️⃣ Buttons
  // ===============================
  $("#cancelMerge").click(function () {
    $("#mergeTable tbody").empty();
    renderItems();
  });

  $("#saveMerge").click(async function () {
    const merges = [];

    $("#mergeTable tbody tr").each(function () {
      const row = $(this);
      const input = row.find(".merge-desc");
      const concepts = row.find(".concept-item");

      if (input.length > 0 && concepts.length > 0) {
        const conceptIds = concepts.map((i, el) => $(el).data("id")).get();
        merges.push({
          targetId: row.data("id"),
          mergedIds: conceptIds,
          newDescription: input.val().trim()
        });
      }
    });

    if (merges.length === 0) {
      alert("Arraste pelo menos um item para a coluna 'Similar Concepts' para mesclar.");
      return;
    }

    try {
      for (const merge of merges) {
        const resp = await fetch(`${url}/keypractices/merge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merge)
        });
        if (!resp.ok) {
          const err = await resp.json();
          console.error('Erro no merge:', err);
          alert('Erro ao realizar merge');
          return;
        }
      }

      alert('Merge realizado com sucesso!');
      loadItems();
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  });

  // ===============================
  // 7️⃣ Filters change
  // ===============================
  $("#filterLevel, #filterDimension").change(function () {
    renderItems();
  });

  // ===============================
  // 8️⃣ Initialize
  // ===============================
  loadItems();
});
