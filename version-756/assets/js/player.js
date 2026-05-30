import { H as Hls } from "./hls-vendor-dru42stk.js";

function attachPlayer(shell) {
  var video = shell.querySelector("video");
  var button = shell.querySelector("[data-play-button]");
  var url = shell.getAttribute("data-video");
  var attached = false;
  var hls = null;

  if (!video || !url) {
    return;
  }

  function load() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
  }

  function play() {
    load();
    shell.classList.add("is-playing");
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        shell.classList.remove("is-playing");
      });
    }
  }

  if (button) {
    button.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", function () {
    shell.classList.add("is-playing");
  });

  video.addEventListener("pause", function () {
    if (!video.ended) {
      shell.classList.remove("is-playing");
    }
  });

  video.addEventListener("ended", function () {
    shell.classList.remove("is-playing");
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.querySelectorAll(".player-shell").forEach(attachPlayer);
