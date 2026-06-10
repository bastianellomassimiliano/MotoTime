(function () {
  "use strict";

  document.getElementById("price-disclaimer").textContent = window.MOTORCYCLE_META.priceDisclaimer;
  document.getElementById("weight-disclaimer").textContent = window.MOTORCYCLE_META.weightDisclaimer;

  document.getElementById("source-list").innerHTML = window.MOTORCYCLES.map((motorcycle) => `
    <div class="source-row">
      <strong>${motorcycle.brand} ${motorcycle.model}</strong>
      <span>${motorcycle.year} · ${MotoTime.formatCurrency(motorcycle.price)}</span>
      <a href="${motorcycle.source}" target="_blank" rel="noopener">Fonte ufficiale ↗</a>
    </div>
  `).join("");

  function flattenCredits(value) {
    if (Array.isArray(value)) return value.flatMap(flattenCredits);
    if (value && value.motorcycleId) return [value];
    if (value && value.value) return flattenCredits(value.value);
    return [];
  }

  fetch("data/image-credits.json")
    .then((response) => {
      if (!response.ok) throw new Error("Crediti non disponibili");
      return response.json();
    })
    .then((rawCredits) => {
      const credits = flattenCredits(rawCredits);
      document.getElementById("credit-list").innerHTML = credits.map((credit) => {
        const motorcycle = MotoTime.findMotorcycle(credit.motorcycleId);
        return `
          <div class="credit-row">
            <strong>${motorcycle ? `${motorcycle.brand} ${motorcycle.model}` : credit.motorcycleId}</strong>
            <span>${credit.author}</span>
            <span>${credit.license}</span>
            <a href="${credit.source}" target="_blank" rel="noopener">Sorgente ↗</a>
          </div>
        `;
      }).join("");
    })
    .catch(() => {
      document.getElementById("credit-list").innerHTML = "<p>I crediti fotografici verranno visualizzati al termine del download delle immagini.</p>";
    });
})();
