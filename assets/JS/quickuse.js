  // Carregar JSON e renderizar dimensões
    $.getJSON("../data/modelinfo.json", function(data) {
      let container = $("#dimensionsList");
      data.dimensions.forEach(dim => {
        let kpList = dim.KPs.map(kp =>
          `<li>${kp.name}: ${kp.description}</li>`).join("");

        let section = `
          <div class="mb-5">
            <h3>${dim.name}</h3>
            <p>${dim.description}</p>
            <ul style="text-align: left;">
              ${kpList}
            </ul>
          </div>`;
        container.append(section);
      });
    });