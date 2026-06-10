(function () {
  "use strict";

  const root = document.getElementById("compare-root");
  const select = document.getElementById("compare-add-select");
  const addButton = document.getElementById("compare-add-button");

  function getSelectedMotorcycles() {
    return MotoTime.getComparison().map(MotoTime.findMotorcycle).filter(Boolean);
  }

  function renderSelect() {
    const selectedIds = new Set(MotoTime.getComparison());
    const available = window.MOTORCYCLES.filter((motorcycle) => !selectedIds.has(motorcycle.id));
    select.innerHTML = available.length
      ? available.map((motorcycle) => `<option value="${motorcycle.id}">${motorcycle.brand} ${motorcycle.model}</option>`).join("")
      : `<option value="">Nessun altro modello</option>`;
    select.disabled = available.length === 0 || selectedIds.size >= MotoTime.MAX_COMPARE;
    addButton.disabled = select.disabled;
  }

  function bestValue(motorcycles, key, direction) {
    if (!motorcycles.length) return null;
    return motorcycles.reduce((best, motorcycle) => {
      if (best === null) return motorcycle[key];
      return direction === "min" ? Math.min(best, motorcycle[key]) : Math.max(best, motorcycle[key]);
    }, null);
  }

  function render() {
    const motorcycles = getSelectedMotorcycles();
    renderSelect();
    if (!motorcycles.length) {
      root.innerHTML = `
        <div class="compare-empty">
          <h2>Il confronto e vuoto</h2>
          <p>Aggiungi un modello qui sopra oppure sceglilo dal catalogo.</p>
          <a class="button button--dark" href="index.html">Apri il catalogo</a>
        </div>
      `;
      return;
    }

    const best = {
      price: bestValue(motorcycles, "price", "min"),
      horsepower: bestValue(motorcycles, "horsepower", "max"),
      torque: bestValue(motorcycles, "torque", "max"),
      weight: bestValue(motorcycles, "weight", "min")
    };

    const row = (label, key, formatter, highlight = false) => `
      <tr>
        <th scope="row">${label}</th>
        ${motorcycles.map((motorcycle) => `
          <td class="comparison-value${highlight && motorcycle[key] === best[key] ? " is-best" : ""}">
            ${formatter(motorcycle[key], motorcycle)}
          </td>
        `).join("")}
      </tr>
    `;

    root.innerHTML = `
      <div class="comparison-wrap">
        <table class="comparison-table">
          <tbody>
            <tr>
              <th scope="row">Foto</th>
              ${motorcycles.map((motorcycle) => `
                <td class="comparison-photo">
                  <img src="${MotoTime.getImage(motorcycle)}" alt="${motorcycle.brand} ${motorcycle.model}" onerror="MotoTime.imageFallback(this)">
                  <button class="comparison-remove" type="button" data-remove-comparison="${motorcycle.id}" aria-label="Rimuovi ${motorcycle.model}">×</button>
                </td>
              `).join("")}
            </tr>
            <tr>
              <th scope="row">Nome</th>
              ${motorcycles.map((motorcycle) => `
                <td class="comparison-name">
                  <span>${motorcycle.brand}</span>
                  <a href="detail.html?id=${motorcycle.id}">${motorcycle.model}</a>
                </td>
              `).join("")}
            </tr>
            ${row("Potenza", "horsepower", (value) => `${value} CV`, true)}
            ${row("Coppia", "torque", (value) => `${value} Nm`, true)}
            ${row("Prezzo", "price", MotoTime.formatCurrency, true)}
            ${row("Peso", "weight", (value) => `${value} kg`, true)}
            ${row("Cilindrata", "displacement", (value) => `${value} cc`)}
            ${row("Altezza sella", "seatHeight", (value) => `${value} mm`)}
            ${row("Serbatoio", "tank", (value) => `${value} l`)}
            ${row("Motore", "cylinders", (value) => value)}
            ${row("Trasmissione", "transmission", (value) => value)}
          </tbody>
        </table>
      </div>
    `;
  }

  addButton.addEventListener("click", () => {
    if (!select.value) return;
    MotoTime.setComparison([...MotoTime.getComparison(), select.value]);
  });

  window.addEventListener("mototime:comparison", render);
  render();
})();
