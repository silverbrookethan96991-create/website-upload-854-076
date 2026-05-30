(function () {
  function unique(values) {
    var seen = {};
    return values.filter(function (value) {
      if (!value || seen[value]) {
        return false;
      }
      seen[value] = true;
      return true;
    });
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function option(value) {
    var item = document.createElement('option');
    item.value = value;
    item.textContent = value;
    return item;
  }

  function card(movie) {
    var tags = (movie.tags || []).join(' ');
    return [
      '<article class="video-card" data-card data-title="' + escapeHtml(movie.title) + '" data-tags="' + escapeHtml(tags) + '" data-year="' + escapeHtml(movie.year) + '" data-type="' + escapeHtml(movie.type) + '">',
      '  <a href="./' + escapeHtml(movie.file) + '">',
      '    <div class="video-thumb">',
      '      <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <span class="view-pill">' + escapeHtml(movie.year) + '</span>',
      '    </div>',
      '    <div class="video-body">',
      '      <span class="type-pill">' + escapeHtml(movie.category) + '</span>',
      '      <h3>' + escapeHtml(movie.title) + '</h3>',
      '      <p>' + escapeHtml(movie.oneLine) + '</p>',
      '      <div class="card-meta">★ 4.' + ((Number(movie.id) % 9) + 1) + ' · ' + escapeHtml(movie.region) + '</div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function start() {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var category = document.querySelector('[data-search-category]');
    var type = document.querySelector('[data-search-type]');
    var year = document.querySelector('[data-search-year]');
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');

    if (!input || !results || typeof MOVIES === 'undefined') {
      return;
    }

    unique(MOVIES.map(function (movie) { return movie.type; })).sort().slice(0, 80).forEach(function (value) {
      if (type) {
        type.appendChild(option(value));
      }
    });

    unique(MOVIES.map(function (movie) { return movie.year; })).sort().reverse().slice(0, 60).forEach(function (value) {
      if (year) {
        year.appendChild(option(value));
      }
    });

    input.value = getQueryParam('q');

    function apply() {
      var query = input.value.trim().toLowerCase();
      var categoryValue = category ? category.value : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      var matched = MOVIES.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
        var passQuery = !query || text.indexOf(query) !== -1;
        var passCategory = !categoryValue || movie.category === categoryValue;
        var passType = !typeValue || movie.type === typeValue;
        var passYear = !yearValue || movie.year === yearValue;
        return passQuery && passCategory && passType && passYear;
      }).slice(0, 240);

      results.innerHTML = matched.map(card).join('');
      if (status) {
        status.textContent = matched.length ? '搜索结果' : '没有找到匹配内容';
      }
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });
    }

    [input, category, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  document.addEventListener('DOMContentLoaded', start);
})();
