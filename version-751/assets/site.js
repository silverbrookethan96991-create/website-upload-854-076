(function () {
  function findAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = findAll('[data-hero-slide]');
    var thumbs = findAll('[data-hero-thumb]');
    if (!slides.length || !thumbs.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === index);
      });
    }
    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.addEventListener('click', function () {
        show(thumbIndex);
        start();
      });
    });
    show(0);
    start();
  }

  function setupFilters() {
    findAll('[data-filter-panel]').forEach(function (panel) {
      var section = panel.closest('section') || document;
      var keyword = panel.querySelector('[data-filter-keyword]');
      var year = panel.querySelector('[data-filter-year]');
      var type = panel.querySelector('[data-filter-type]');
      var cards = findAll('[data-card]', section);
      var emptyTip = section.querySelector('[data-empty-tip]');
      function apply() {
        var query = keyword ? keyword.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedType = type ? type.value : '';
        var visible = 0;
        cards.forEach(function (card) {
          var text = [card.dataset.title, card.dataset.tags, card.dataset.year, card.dataset.type].join(' ').toLowerCase();
          var passKeyword = !query || text.indexOf(query) !== -1;
          var passYear = !selectedYear || card.dataset.year === selectedYear;
          var passType = !selectedType || card.dataset.type === selectedType;
          var pass = passKeyword && passYear && passType;
          card.style.display = pass ? '' : 'none';
          if (pass) {
            visible += 1;
          }
        });
        if (emptyTip) {
          emptyTip.classList.toggle('is-visible', visible === 0);
        }
      }
      [keyword, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
