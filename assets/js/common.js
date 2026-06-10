(function () {
  "use strict";

  const STORAGE_KEY = "mototime-comparison";
  const MAX_COMPARE = 5;
  const placeholder = "assets/images/placeholder.svg";

  function formatCurrency(value) {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function getImage(motorcycle, index = 1) {
    return `assets/images/motos/${motorcycle.id}/${index}.jpg`;
  }

  function findMotorcycle(id) {
    return window.MOTORCYCLES.find((motorcycle) => motorcycle.id === id);
  }

  function getComparison() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value.filter((id) => findMotorcycle(id)).slice(0, MAX_COMPARE) : [];
    } catch {
      return [];
    }
  }

  function setComparison(ids) {
    const cleanIds = [...new Set(ids)].filter((id) => findMotorcycle(id)).slice(0, MAX_COMPARE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanIds));
    syncComparisonUI();
    window.dispatchEvent(new CustomEvent("mototime:comparison", { detail: cleanIds }));
    return cleanIds;
  }

  function toggleComparison(id) {
    const selected = getComparison();
    if (selected.includes(id)) {
      setComparison(selected.filter((item) => item !== id));
      return { selected: false, ok: true };
    }
    if (selected.length >= MAX_COMPARE) {
      showToast(`Puoi confrontare fino a ${MAX_COMPARE} moto.`);
      return { selected: false, ok: false };
    }
    setComparison([...selected, id]);
    return { selected: true, ok: true };
  }

  function syncComparisonUI() {
    const selected = getComparison();
    document.querySelectorAll("[data-compare-count]").forEach((element) => {
      element.textContent = selected.length;
    });

    document.querySelectorAll("[data-compare-toggle]").forEach((button) => {
      const active = selected.includes(button.dataset.compareToggle);
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));
      const label = button.querySelector("[data-compare-label]");
      if (label) label.textContent = active ? "Selezionata" : "Confronta";
    });

    renderCompareTray(selected);
  }

  function renderCompareTray(selected) {
    const root = document.getElementById("compare-tray");
    if (!root) return;
    if (selected.length === 0 || document.body.dataset.page === "compare") {
      root.innerHTML = "";
      return;
    }

    const motorcycles = selected.map(findMotorcycle).filter(Boolean);
    root.innerHTML = `
      <aside class="compare-tray" aria-label="Moto selezionate per il confronto">
        <div class="compare-tray__items" data-count="${motorcycles.length}">
          ${motorcycles.map((motorcycle) => `
            <div class="compare-tray__item">
              <img src="${getImage(motorcycle)}" alt="" onerror="MotoTime.imageFallback(this)">
              <span>${motorcycle.model}</span>
              <button type="button" data-remove-comparison="${motorcycle.id}" aria-label="Rimuovi ${motorcycle.model}">×</button>
            </div>
          `).join("")}
        </div>
        <a class="button button--primary" href="compare.html">Confronta ora (${motorcycles.length})</a>
      </aside>
    `;
  }

  function imageFallback(image) {
    image.onerror = null;
    image.src = placeholder;
  }

  function showToast(message) {
    const oldToast = document.querySelector(".app-toast");
    if (oldToast) oldToast.remove();
    const toast = document.createElement("div");
    toast.className = "app-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      zIndex: "100",
      right: "20px",
      bottom: "100px",
      maxWidth: "320px",
      padding: "12px 16px",
      borderRadius: "10px",
      color: "#fffdf7",
      background: "#101512",
      boxShadow: "0 12px 40px rgba(0,0,0,.25)",
      fontWeight: "750",
      fontSize: ".86rem"
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  function cardMarkup(motorcycle) {
    const selected = getComparison().includes(motorcycle.id);
    return `
      <article class="moto-card">
        <a class="moto-card__link" href="detail.html?id=${motorcycle.id}" aria-label="Apri la scheda di ${motorcycle.brand} ${motorcycle.model}">
          <img class="moto-card__image" src="${getImage(motorcycle)}" alt="${motorcycle.brand} ${motorcycle.model}" loading="lazy" onerror="MotoTime.imageFallback(this)">
          <div class="moto-card__content">
            <span class="moto-card__brand">${motorcycle.brand}</span>
            <h3>${motorcycle.model}</h3>
            <div class="moto-card__quick-specs">
              <span>${formatCurrency(motorcycle.price)}</span>
              <span>${motorcycle.horsepower} CV</span>
              <span>${motorcycle.torque} Nm</span>
              <span>${motorcycle.weight} kg</span>
            </div>
          </div>
        </a>
        <button class="compare-toggle${selected ? " is-selected" : ""}" type="button" data-compare-toggle="${motorcycle.id}" aria-pressed="${selected}" aria-label="Aggiungi ${motorcycle.model} al confronto">
          <span data-compare-label>${selected ? "Selezionata" : "Confronta"}</span>
        </button>
      </article>
    `;
  }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-compare-toggle]");
    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleComparison(toggle.dataset.compareToggle);
      return;
    }

    const remove = event.target.closest("[data-remove-comparison]");
    if (remove) {
      setComparison(getComparison().filter((id) => id !== remove.dataset.removeComparison));
    }
  });

  window.addEventListener("storage", syncComparisonUI);
  document.addEventListener("DOMContentLoaded", syncComparisonUI);

  window.MotoTime = {
    MAX_COMPARE,
    cardMarkup,
    findMotorcycle,
    formatCurrency,
    getComparison,
    getImage,
    imageFallback,
    setComparison,
    showToast,
    syncComparisonUI,
    toggleComparison
  };
})();
