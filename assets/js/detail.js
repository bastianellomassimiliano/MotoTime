(function () {
  "use strict";

  const root = document.getElementById("detail-root");
  const id = new URLSearchParams(window.location.search).get("id");
  const motorcycle = MotoTime.findMotorcycle(id);

  if (!motorcycle) {
    document.title = "Moto non trovata | Moto Time";
    root.innerHTML = `
      <section class="not-found">
        <p class="eyebrow">Errore 404</p>
        <h1>Moto non trovata</h1>
        <p>Il modello richiesto non esiste nel catalogo.</p>
        <a class="button button--dark" href="index.html">Torna al catalogo</a>
      </section>
    `;
    return;
  }

  document.title = `${motorcycle.brand} ${motorcycle.model} | Moto Time`;
  const selected = MotoTime.getComparison().includes(motorcycle.id);
  const related = window.MOTORCYCLES
    .filter((item) => item.id !== motorcycle.id && item.category === motorcycle.category)
    .sort((a, b) => Math.abs(a.price - motorcycle.price) - Math.abs(b.price - motorcycle.price))
    .slice(0, 3);
  const imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${motorcycle.brand} ${motorcycle.model}`)}`;

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Percorso">
      <a href="index.html">Catalogo</a><span>/</span><span>${motorcycle.brand} ${motorcycle.model}</span>
    </nav>

    <section class="detail-layout">
      <div class="detail-gallery">
        <div class="gallery-main">
          <img id="gallery-main-image" src="${MotoTime.getImage(motorcycle, 1)}" alt="${motorcycle.brand} ${motorcycle.model}" onerror="MotoTime.imageFallback(this)">
        </div>
        <div class="gallery-thumbs">
          ${[1, 2, 3].map((index) => `
            <button class="${index === 1 ? "is-active" : ""}" type="button" data-gallery-image="${MotoTime.getImage(motorcycle, index)}" aria-label="Mostra foto ${index}">
              <img src="${MotoTime.getImage(motorcycle, index)}" alt="" onerror="MotoTime.imageFallback(this)">
            </button>
          `).join("")}
        </div>
      </div>

      <div class="detail-title">
        <p class="eyebrow">${motorcycle.brand} · ${motorcycle.category} · ${motorcycle.year}</p>
        <h1>${motorcycle.model}</h1>
        <p class="detail-price"><strong>${MotoTime.formatCurrency(motorcycle.price)}</strong><span>prezzo indicativo</span></p>
        <p class="detail-description">${motorcycle.description}</p>
        <ul class="highlight-list">${motorcycle.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
        <div class="detail-actions">
          <button class="button ${selected ? "button--outline" : "button--dark"}" type="button" data-compare-toggle="${motorcycle.id}" aria-pressed="${selected}">
            <span data-compare-label>${selected ? "Selezionata" : "Aggiungi al confronto"}</span>
          </button>
          <a class="button button--outline" href="${motorcycle.source}" target="_blank" rel="noopener">Scheda ufficiale ↗</a>
        </div>
      </div>
    </section>

    <section class="detail-specs" aria-label="Specifiche principali">
      ${spec("Potenza", `${motorcycle.horsepower} CV`)}
      ${spec("Coppia", `${motorcycle.torque} Nm`)}
      ${spec("Peso dichiarato", `${motorcycle.weight} kg`)}
      ${spec("Cilindrata", `${motorcycle.displacement} cc`)}
      ${spec("Motore", motorcycle.cylinders)}
      ${spec("Trasmissione", motorcycle.transmission)}
      ${spec("Altezza sella", `${motorcycle.seatHeight} mm`)}
      ${spec("Serbatoio", `${motorcycle.tank} l`)}
    </section>

    <section class="photo-search">
      <div>
        <h2>Vuoi vederla da ogni angolazione?</h2>
        <p>Apri una ricerca immagini gia impostata su ${motorcycle.brand} ${motorcycle.model}.</p>
      </div>
      <a class="button button--primary" href="${imageSearchUrl}" target="_blank" rel="noopener">Cerca altre foto ↗</a>
    </section>

    <section class="related-section">
      <div class="section-heading">
        <div><p class="eyebrow">Alternative</p><h2>Stessa idea, altro carattere</h2></div>
        <a class="text-button" href="index.html">Vedi tutto</a>
      </div>
      <div class="moto-grid">${related.map(MotoTime.cardMarkup).join("")}</div>
    </section>
  `;

  function spec(label, value) {
    return `<div class="detail-spec"><span>${label}</span><strong>${value}</strong></div>`;
  }

  document.querySelector(".gallery-thumbs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-image]");
    if (!button) return;
    const mainImage = document.getElementById("gallery-main-image");
    mainImage.src = button.dataset.galleryImage;
    document.querySelectorAll("[data-gallery-image]").forEach((item) => item.classList.toggle("is-active", item === button));
  });

  window.addEventListener("mototime:comparison", () => {
    const button = document.querySelector(`[data-compare-toggle="${motorcycle.id}"]`);
    if (!button) return;
    const active = MotoTime.getComparison().includes(motorcycle.id);
    button.classList.toggle("button--dark", !active);
    button.classList.toggle("button--outline", active);
  });
})();
