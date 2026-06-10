(function () {
  "use strict";

  const motorcycles = window.MOTORCYCLES;
  const collection = document.getElementById("moto-collection");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const selectedBrands = new Set();

  const controls = {
    search: document.getElementById("search-input"),
    priceMin: document.getElementById("price-min"),
    priceMax: document.getElementById("price-max"),
    hpMin: document.getElementById("hp-min"),
    hpMax: document.getElementById("hp-max"),
    torqueMin: document.getElementById("torque-min"),
    torqueMax: document.getElementById("torque-max"),
    sort: document.getElementById("sort-select")
  };

  const bounds = {
    priceMin: Math.floor(Math.min(...motorcycles.map((moto) => moto.price)) / 500) * 500,
    priceMax: Math.ceil(Math.max(...motorcycles.map((moto) => moto.price)) / 500) * 500,
    hpMin: Math.floor(Math.min(...motorcycles.map((moto) => moto.horsepower)) / 5) * 5,
    hpMax: Math.ceil(Math.max(...motorcycles.map((moto) => moto.horsepower)) / 5) * 5,
    torqueMin: Math.floor(Math.min(...motorcycles.map((moto) => moto.torque)) / 5) * 5,
    torqueMax: Math.ceil(Math.max(...motorcycles.map((moto) => moto.torque)) / 5) * 5
  };

  function setDefaults() {
    controls.priceMin.value = bounds.priceMin;
    controls.priceMax.value = bounds.priceMax;
    controls.hpMin.value = bounds.hpMin;
    controls.hpMax.value = bounds.hpMax;
    controls.torqueMin.value = bounds.torqueMin;
    controls.torqueMax.value = bounds.torqueMax;
  }

  function renderBrands() {
    const root = document.getElementById("brand-options");
    const brands = [...new Set(motorcycles.map((motorcycle) => motorcycle.brand))].sort((a, b) => a.localeCompare(b, "it"));
    root.innerHTML = brands.map((brand) => `
      <button class="brand-chip" type="button" data-brand="${brand}" aria-pressed="false">${brand}</button>
    `).join("");
  }

  function numericValue(control, fallback) {
    const value = Number(control.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function getFilteredMotorcycles() {
    const search = controls.search.value.trim().toLocaleLowerCase("it");
    const priceMin = numericValue(controls.priceMin, bounds.priceMin);
    const priceMax = numericValue(controls.priceMax, bounds.priceMax);
    const hpMin = numericValue(controls.hpMin, bounds.hpMin);
    const hpMax = numericValue(controls.hpMax, bounds.hpMax);
    const torqueMin = numericValue(controls.torqueMin, bounds.torqueMin);
    const torqueMax = numericValue(controls.torqueMax, bounds.torqueMax);

    const filtered = motorcycles.filter((motorcycle) => {
      const haystack = `${motorcycle.brand} ${motorcycle.model} ${motorcycle.category}`.toLocaleLowerCase("it");
      return (!selectedBrands.size || selectedBrands.has(motorcycle.brand))
        && (!search || haystack.includes(search))
        && motorcycle.price >= priceMin
        && motorcycle.price <= priceMax
        && motorcycle.horsepower >= hpMin
        && motorcycle.horsepower <= hpMax
        && motorcycle.torque >= torqueMin
        && motorcycle.torque <= torqueMax;
    });

    return filtered.sort((a, b) => {
      switch (controls.sort.value) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "power-desc": return b.horsepower - a.horsepower;
        case "weight-asc": return a.weight - b.weight;
        default: return a.brand.localeCompare(b.brand, "it") || a.model.localeCompare(b.model, "it");
      }
    });
  }

  function render() {
    const filtered = getFilteredMotorcycles();
    collection.innerHTML = filtered.map(MotoTime.cardMarkup).join("");
    resultCount.textContent = filtered.length;
    emptyState.hidden = filtered.length !== 0;
    collection.hidden = filtered.length === 0;
    MotoTime.syncComparisonUI();
  }

  function resetFilters() {
    selectedBrands.clear();
    controls.search.value = "";
    controls.sort.value = "brand";
    setDefaults();
    document.querySelectorAll(".brand-chip").forEach((chip) => {
      chip.classList.remove("is-selected");
      chip.setAttribute("aria-pressed", "false");
    });
    render();
  }

  function setView(view) {
    const isList = view === "list";
    collection.classList.toggle("moto-grid", !isList);
    collection.classList.toggle("moto-list", isList);
    document.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    localStorage.setItem("mototime-view", view);
  }

  renderBrands();
  setDefaults();

  document.getElementById("brand-options").addEventListener("click", (event) => {
    const button = event.target.closest("[data-brand]");
    if (!button) return;
    const brand = button.dataset.brand;
    if (selectedBrands.has(brand)) selectedBrands.delete(brand);
    else selectedBrands.add(brand);
    const active = selectedBrands.has(brand);
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
    render();
  });

  Object.values(controls).forEach((control) => {
    control.addEventListener(control === controls.search ? "input" : "change", render);
  });

  document.getElementById("reset-filters").addEventListener("click", resetFilters);
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  window.addEventListener("mototime:comparison", render);

  setView(localStorage.getItem("mototime-view") === "list" ? "list" : "grid");
  render();
})();
