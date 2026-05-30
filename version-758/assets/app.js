(function () {
  var menuButton = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var index = 0;
  var timer = null;

  function showSlide(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  function stopHero() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        stopHero();
        showSlide(dotIndex);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        stopHero();
        showSlide(index - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        stopHero();
        showSlide(index + 1);
        startHero();
      });
    }

    startHero();
  }

  var grid = document.getElementById("movieGrid");
  var searchInput = document.getElementById("movieSearch");
  var categorySelect = document.getElementById("categoryFilter");
  var sortSelect = document.getElementById("sortSelect");
  var resetButton = document.getElementById("resetFilters");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilters() {
    if (!grid) {
      return;
    }

    var keyword = normalize(searchInput && searchInput.value);
    var category = normalize(categorySelect && categorySelect.value);
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".js-movie-card"));

    cards.forEach(function (card) {
      var combined = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-region"),
        card.getAttribute("data-category"),
        card.getAttribute("data-year")
      ].join(" "));
      var cardCategory = normalize(card.getAttribute("data-category"));
      var keywordMatch = !keyword || combined.indexOf(keyword) !== -1;
      var categoryMatch = !category || cardCategory === category;
      card.classList.toggle("hidden-card", !(keywordMatch && categoryMatch));
    });
  }

  function sortCards() {
    if (!grid || !sortSelect) {
      return;
    }

    var mode = sortSelect.value;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".js-movie-card"));

    cards.sort(function (a, b) {
      if (mode === "rating") {
        return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
      }

      if (mode === "year") {
        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
      }

      if (mode === "title") {
        return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
      }

      return 0;
    });

    cards.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  if (grid) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q && searchInput) {
      searchInput.value = q;
    }

    [searchInput, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortCards();
        applyFilters();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
        }

        if (categorySelect) {
          categorySelect.value = "";
        }

        if (sortSelect) {
          sortSelect.value = "default";
        }

        sortCards();
        applyFilters();
      });
    }

    sortCards();
    applyFilters();
  }
})();
