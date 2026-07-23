(function () {
  const grid = document.getElementById("recipe-grid");
  const filterBar = document.getElementById("filter-bar");
  const searchInput = document.getElementById("search-input");
  const noResults = document.getElementById("no-results");
  if (!grid) return;

  const chips = filterBar ? Array.from(filterBar.querySelectorAll(".filter-chip")) : [];
  const clearBtn = document.getElementById("clear-filters");
  const cards = Array.from(grid.querySelectorAll(".recipe-card"));
  const sortButtons = Array.from(document.querySelectorAll(".sort-btn"));

  const active = new Set();
  let query = "";
  let sortMode = "recent";

  function applyAll() {
    let visibleCount = 0;
    cards.forEach((card) => {
      const cardTags = (card.dataset.tags || "").split(",").filter(Boolean);
      const matchesTags = active.size === 0 || [...active].every((t) => cardTags.includes(t));
      const matchesQuery = !query || (card.dataset.search || "").includes(query);
      const visible = matchesTags && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    if (clearBtn) clearBtn.hidden = active.size === 0;
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  function applySort() {
    const sorted = cards.slice().sort((a, b) => {
      if (sortMode === "az") {
        return a.dataset.title.localeCompare(b.dataset.title, "es");
      }
      return Number(b.dataset.date || 0) - Number(a.dataset.date || 0);
    });
    sorted.forEach((card) => grid.appendChild(card));
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const tag = chip.dataset.tag;
      if (active.has(tag)) {
        active.delete(tag);
        chip.classList.remove("is-active");
      } else {
        active.add(tag);
        chip.classList.add("is-active");
      }
      applyAll();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      active.clear();
      chips.forEach((c) => c.classList.remove("is-active"));
      applyAll();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      query = searchInput.value.trim().toLowerCase();
      applyAll();
    });
  }

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortMode = btn.dataset.sort;
      sortButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applySort();
    });
  });

  // Coming from a recipe page tag link (#tag-slug): auto-activate that chip
  if (window.location.hash.startsWith("#tag-")) {
    const target = document.querySelector(window.location.hash);
    if (target && target.classList.contains("filter-chip")) {
      target.click();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
})();
