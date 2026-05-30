(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function getQueryValue(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      toggle.textContent = panel.hidden ? "☰" : "×";
    });
  }

  function setupSearchForms() {
    document.querySelectorAll(".site-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";

        if (!value) {
          event.preventDefault();
          window.location.href = "search.html";
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupCardFilters() {
    var grid = document.querySelector("[data-card-grid]");

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var input = document.querySelector("[data-filter-input]");
    var categorySelect = document.querySelector("[data-category-select]");
    var sortSelect = document.querySelector("[data-sort-select]");
    var initialQuery = getQueryValue("q");

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function applyFilters() {
      var query = normalize(input ? input.value : "");
      var category = categorySelect ? categorySelect.value : "";
      var sort = sortSelect ? sortSelect.value : "default";
      var visibleCards = cards.filter(function (card) {
        var haystack = normalize(card.getAttribute("data-search"));
        var cardCategory = card.getAttribute("data-category") || "";
        var queryMatch = !query || haystack.indexOf(query) !== -1;
        var categoryMatch = !category || cardCategory === category;

        return queryMatch && categoryMatch;
      });

      if (sort === "year-desc") {
        visibleCards.sort(function (left, right) {
          return Number(right.getAttribute("data-year") || 0) - Number(left.getAttribute("data-year") || 0);
        });
      }

      if (sort === "title-asc") {
        visibleCards.sort(function (left, right) {
          return String(left.getAttribute("data-title") || "").localeCompare(String(right.getAttribute("data-title") || ""), "zh-Hans-CN");
        });
      }

      cards.forEach(function (card) {
        card.hidden = true;
      });

      visibleCards.forEach(function (card) {
        card.hidden = false;
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", applyFilters);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", applyFilters);
    }

    var pageForm = document.querySelector(".search-page-form");

    if (pageForm) {
      pageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
      });
    }

    applyFilters();
  }

  function setupPlayers() {
    document.querySelectorAll(".stream-player").forEach(function (player) {
      var video = player.querySelector("video");
      var playButton = player.querySelector(".player-play");
      var toggleButton = player.querySelector(".player-toggle");
      var muteButton = player.querySelector(".player-mute");
      var fullscreenButton = player.querySelector(".player-fullscreen");

      if (!video) {
        return;
      }

      var stream = video.getAttribute("data-stream");

      if (stream) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(stream);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        }
      }

      function syncState() {
        var isPlaying = !video.paused && !video.ended;
        player.classList.toggle("is-playing", isPlaying);

        if (toggleButton) {
          toggleButton.textContent = isPlaying ? "暂停" : "播放";
        }

        if (muteButton) {
          muteButton.textContent = video.muted ? "取消静音" : "静音";
        }
      }

      function togglePlay() {
        if (video.paused || video.ended) {
          var request = video.play();

          if (request && typeof request.catch === "function") {
            request.catch(function () {});
          }
        } else {
          video.pause();
        }
      }

      if (playButton) {
        playButton.addEventListener("click", togglePlay);
      }

      if (toggleButton) {
        toggleButton.addEventListener("click", togglePlay);
      }

      if (muteButton) {
        muteButton.addEventListener("click", function () {
          video.muted = !video.muted;
          syncState();
        });
      }

      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function () {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });
      }

      video.addEventListener("play", syncState);
      video.addEventListener("pause", syncState);
      video.addEventListener("ended", syncState);
      syncState();
    });
  }

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupCardFilters();
    setupPlayers();
  });
})();
