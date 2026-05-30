(function () {
  function initMoviePlayer(src) {
    var video = document.getElementById("playerVideo");
    var cover = document.getElementById("playerCover");
    var button = document.getElementById("playerButton");
    var loaded = false;
    var hls = null;

    if (!video || !src) {
      return;
    }

    function loadVideo() {
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }

        loaded = true;
        video.setAttribute("controls", "controls");
      }

      if (cover) {
        cover.classList.add("is-hidden");
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", loadVideo);
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        loadVideo();
      });
    }

    video.addEventListener("click", function () {
      if (!loaded) {
        loadVideo();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
