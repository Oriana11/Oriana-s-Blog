/* ============================================================
   script.js — lightweight static-site interactivity
   ============================================================ */

/* --- Utility: debounce --- */
function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* --- Mobile nav toggle --- */
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('header.site-nav nav');
  if (!toggle || !nav) return;

  toggle.setAttribute('aria-expanded', 'false');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  /* Close when clicking outside the header */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header.site-nav') && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', 'Open menu');
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.focus();
    }
  });
})();

/* --- Post search + tag filter (index page only) --- */
(function () {
  const searchInput = document.getElementById('post-search');
  const chips       = document.querySelectorAll('.chip[data-filter]');
  const cards       = document.querySelectorAll('.post-card');
  const noResults   = document.querySelector('.no-results');

  if (!cards.length) return;

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visible = 0;

    cards.forEach((card) => {
      const title   = (card.querySelector('h3')?.textContent ?? '').toLowerCase();
      const excerpt = (card.querySelector('p')?.textContent  ?? '').toLowerCase();
      const tags    = card.dataset.tags ?? '';

      const matchesSearch = !query || title.includes(query) || excerpt.includes(query);
      const matchesFilter = activeFilter === 'all' || tags.split(' ').includes(activeFilter);

      card.hidden = !(matchesSearch && matchesFilter);
      if (!card.hidden) visible++;
    });

    if (noResults) noResults.hidden = visible > 0;
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 200));

    /* Clear search with Escape while input is focused */
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        applyFilters();
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });
})();

/* --- Back-to-top button --- */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AT = 400;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < SHOW_AT;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
