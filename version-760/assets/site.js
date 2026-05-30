(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            navLinks.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var currentSlide = 0;
    var heroTimer = null;

    function setHeroSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === currentSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === currentSlide);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            setHeroSlide(currentSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            setHeroSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            startHero();
        });
    });

    startHero();

    var searchInput = document.querySelector("[data-search-input]");
    var typeFilter = document.querySelector("[data-filter-type]");
    var yearFilter = document.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var type = typeFilter ? typeFilter.value : "";
        var year = yearFilter ? yearFilter.value : "";

        cards.forEach(function (card) {
            var haystack = (card.getAttribute("data-search") || "").toLowerCase();
            var cardType = card.getAttribute("data-type") || "";
            var cardYear = card.getAttribute("data-year") || "";
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var matchType = !type || cardType.indexOf(type) !== -1;
            var matchYear = !year || cardYear === year;
            card.classList.toggle("is-hidden", !(matchQuery && matchType && matchYear));
        });
    }

    [searchInput, typeFilter, yearFilter].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });
})();

window.initMoviePlayer = function (streamUrl, videoId, layerId) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    var hlsInstance = null;
    var ready = false;

    if (!video || !layer || !streamUrl) {
        return;
    }

    function prepare() {
        if (ready) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            ready = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal || !hlsInstance) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                } else {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
            ready = true;
        }
    }

    function playVideo() {
        prepare();
        layer.classList.add("is-hidden");
        var action = video.play();
        if (action && typeof action.catch === "function") {
            action.catch(function () {
                layer.classList.remove("is-hidden");
            });
        }
    }

    layer.addEventListener("click", playVideo);
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });
};
