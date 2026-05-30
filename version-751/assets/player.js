(function () {
  function hideOverlay(overlay) {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function showOverlay(overlay) {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  }

  window.initVideoPlayer = function (sourceUrl) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var playButtons = Array.prototype.slice.call(document.querySelectorAll('[data-player-play]'));
    var hlsInstance = null;

    if (!video || !sourceUrl) {
      return;
    }

    function attachSource() {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            hlsInstance.destroy();
          }
        });
        return;
      }
      video.src = sourceUrl;
    }

    function playVideo() {
      hideOverlay(overlay);
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          showOverlay(overlay);
        });
      }
    }

    attachSource();

    playButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      hideOverlay(overlay);
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        showOverlay(overlay);
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
