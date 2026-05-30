(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 6200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-area]").forEach(function (area) {
      var input = area.querySelector(".filter-input");
      var selects = Array.prototype.slice.call(area.querySelectorAll(".filter-select"));
      var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var filters = selects.map(function (select) {
          return {
            field: select.getAttribute("data-filter-field"),
            value: select.value.trim().toLowerCase()
          };
        });

        cards.forEach(function (card) {
          var searchText = (card.getAttribute("data-search") || "").toLowerCase();
          var matched = !query || searchText.indexOf(query) !== -1;

          filters.forEach(function (filter) {
            if (!filter.value || !matched) {
              return;
            }
            var cardValue = (card.getAttribute("data-" + filter.field) || "").toLowerCase();
            matched = cardValue.indexOf(filter.value) !== -1;
          });

          card.classList.toggle("is-hidden", !matched);
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      selects.forEach(function (select) {
        select.addEventListener("change", applyFilter);
      });
    });

    var homeSearch = document.querySelector("[data-home-search]");
    if (homeSearch) {
      var homeInput = homeSearch.querySelector("input");
      var catalog = document.querySelector("#home-catalog");
      var catalogInput = catalog ? catalog.querySelector(".filter-input") : null;

      homeSearch.addEventListener("submit", function (event) {
        event.preventDefault();
        if (catalog && catalogInput && homeInput) {
          catalogInput.value = homeInput.value;
          catalogInput.dispatchEvent(new Event("input"));
          catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  });
})();
