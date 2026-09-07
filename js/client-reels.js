/* ==========================================================================
   ARRISE DIGITAL — CLIENT PAGE REELS RENDERER
   Renders a 9:16 reel carousel on individual client detail pages.
   Reads data from window.ARRISE_CLIENTS (client-data.js).
   Self-contained — no dependency on reels-showcase.js.
   ========================================================================== */
(function () {
  'use strict';

  var CLIENTS = window.ARRISE_CLIENTS || {};
  var root = document.getElementById('clientReels');
  if (!root) return;

  /* Detect current client from URL */
  var path = window.location.pathname;
  var slug = path.replace(/^.*\/clients\//, '').replace(/\.html.*$/, '').replace(/\/$/, '');
  var client = CLIENTS[slug];
  if (!client || !client.reels || !client.reels.length) { root.hidden = true; return; }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var viewer = null;
  var lastFocused = null;
  var dragMoved = false;
  var closeTimer = null;
  var state = { index: 0 };

  var ICON_PLAY = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>';
  var ICON_MUTE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4V5.5l-5 4H3zM16 8.5a5 5 0 0 1 0 7l-1.4-1.4a3.2 3.2 0 0 0 0-4.2L16 8.5z" stroke="currentColor" fill="currentColor"/></svg>';
  var ICON_UNMUTE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4V5.5l-5 4H3z" fill="currentColor"/><path d="M15.5 8.5l5 7M20.5 8.5l-5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>';

  function html(str) {
    var t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.firstElementChild;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ------------------------------------------------------------------
     Build the reel section
     ------------------------------------------------------------------ */
  function build() {
    root.hidden = false;

    var heading = html('<h3 class="client-reels__heading reveal-up">Project Reels</h3>');
    root.appendChild(heading);

    var carousel = buildCarousel();
    root.appendChild(carousel);
  }

  function buildCarousel() {
    var car = html('<div class="reel-carousel"></div>');
    var navPrev = html('<button class="reel-nav reel-nav--prev" aria-label="Scroll reels left">&larr;</button>');
    var navNext = html('<button class="reel-nav reel-nav--next" aria-label="Scroll reels right">&rarr;</button>');
    var track = html('<div class="reel-track" role="list" aria-label="Reels for ' + client.name + '"></div>');

    client.reels.forEach(function (r, ri) {
      track.appendChild(buildReelCard(r, ri));
    });

    car.appendChild(track);
    car.appendChild(navPrev);
    car.appendChild(navNext);
    initCarousel(car, track, navPrev, navNext);
    return car;
  }

  /* ------------------------------------------------------------------
     Reel card (strict 9:16)
     ------------------------------------------------------------------ */
  function buildReelCard(r, ri) {
    var card = html(
      '<button type="button" class="reel-card" role="listitem" style="--d:' + (ri * 80) + 'ms" data-index="' + ri + '">' +
      '<span class="reel-media">' +
      '<img class="reel-poster" alt="Thumbnail of ' + r.title + '" aria-hidden="true">' +
      '<span class="reel-shade"></span>' +
      '<span class="reel-badge">' + pad(ri + 1) + '</span>' +
      '<span class="reel-play">' + ICON_PLAY + '</span>' +
      '<span class="reel-caption"><span class="reel-title">' + r.title + '</span></span>' +
      '</span>' +
      '</button>'
    );
    card.setAttribute('aria-label', 'Play ' + r.title + ' reel by ' + client.name);

    var video = document.createElement('video');
    video.className = 'reel-video';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.src = r.video;
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    card.querySelector('.reel-media').insertBefore(video, card.querySelector('.reel-shade'));

    card.addEventListener('click', function () {
      if (dragMoved) { dragMoved = false; return; }
      stopCardPreviews(card);
      openViewer(ri, card);
    });

    if (canHover) bindHover(card);
    if (posterIO) posterIO.observe(card);
    return card;
  }

  function bindHover(card) {
    var video = card.querySelector('.reel-video');
    card.addEventListener('mouseenter', function () {
      stopCardPreviews(card);
      if (video) {
        video.currentTime = 0;
        var p = video.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      }
      card.classList.add('is-playing');
    });
    card.addEventListener('mouseleave', function () {
      if (video && !video.paused) { video.pause(); }
      card.classList.remove('is-playing');
    });
  }

  function stopCardPreviews(except) {
    document.querySelectorAll('.reel-card.is-playing').forEach(function (c) {
      if (c === except) return;
      var v = c.querySelector('.reel-video');
      if (v && !v.paused) { v.pause(); }
      c.classList.remove('is-playing');
    });
  }

  /* ------------------------------------------------------------------
     Lazy poster generation
     ------------------------------------------------------------------ */
  var posterIO = null;
  var posterQueue = [];
  var posterBusy = false;

  function initPosterIO() {
    if (!('IntersectionObserver' in window)) return;
    posterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          posterIO.unobserve(en.target);
          posterQueue.push(en.target);
          pumpPosters();
        }
      });
    }, { rootMargin: '420px 0px' });
  }

  function pumpPosters() {
    if (posterBusy || !posterQueue.length) return;
    var card = posterQueue.shift();
    var reel = client.reels[parseInt(card.dataset.index, 10)];
    var st = card.dataset.posterState;
    if (st === 'done' || st === 'loading' || !reel) { pumpPosters(); return; }
    card.dataset.posterState = 'loading';
    posterBusy = true;

    var v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.src = reel.video;

    var settled = false;
    function settle() {
      if (settled) return;
      settled = true;
      try { v.removeAttribute('src'); v.load(); } catch (e) {}
      posterBusy = false;
      pumpPosters();
    }

    v.addEventListener('loadedmetadata', function () {
      var d = v.duration;
      v.currentTime = (d === Infinity || isNaN(d)) ? 0.3 : Math.min(0.6, d / 2);
    }, { once: true });

    v.addEventListener('seeked', function () {
      try {
        var c = document.createElement('canvas');
        c.width = 270; c.height = 480;
        var ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(v, 0, 0, 270, 480);
          var img = card.querySelector('.reel-poster');
          if (img) { img.src = c.toDataURL('image/jpeg', 0.72); img.classList.add('is-loaded'); }
        }
      } catch (e) {}
      card.dataset.posterState = 'done';
      settle();
    }, { once: true });

    v.addEventListener('error', function () { card.dataset.posterState = 'done'; settle(); }, { once: true });
    v.load();
  }

  /* ------------------------------------------------------------------
     Carousel: drag + arrows
     ------------------------------------------------------------------ */
  function initCarousel(car, track, navPrev, navNext) {
    var drag = null;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      drag = { id: e.pointerId, x: e.clientX, left: track.scrollLeft, moved: false };
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) drag.moved = true;
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      dragMoved = drag.moved;
      drag = null;
      track.classList.remove('is-dragging');
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', function (e) {
      if (dragMoved) { e.preventDefault(); e.stopPropagation(); dragMoved = false; }
    }, true);

    function updateArrows() {
      var max = track.scrollWidth - track.clientWidth - 4;
      navPrev.disabled = track.scrollLeft <= 4;
      navNext.disabled = track.scrollLeft >= max - 4;
    }
    var scrollTimer = null;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateArrows, 60);
    }, { passive: true });
    navPrev.addEventListener('click', function () {
      track.scrollBy({ left: -track.clientWidth * 0.85, behavior: reduced ? 'auto' : 'smooth' });
    });
    navNext.addEventListener('click', function () {
      track.scrollBy({ left: track.clientWidth * 0.85, behavior: reduced ? 'auto' : 'smooth' });
    });
    updateArrows();
  }

  /* ------------------------------------------------------------------
     Fullscreen viewer
     ------------------------------------------------------------------ */
  function ensureViewer() {
    if (viewer) return;
    viewer = html(
      '<div class="reel-viewer" role="dialog" aria-modal="true" aria-label="Reel viewer" hidden>' +
      '<div class="reel-viewer__backdrop"></div>' +
      '<div class="reel-viewer__shell">' +
      '<header class="reel-viewer__head">' +
      '<img class="reel-viewer__logo" alt="" hidden>' +
      '<span class="reel-viewer__brand">' +
      '<strong class="reel-viewer__name"></strong>' +
      '<span class="reel-viewer__handle"></span>' +
      '</span>' +
      '<span class="reel-viewer__counter"></span>' +
      '<button class="reel-viewer__close" aria-label="Close viewer">&#10005;</button>' +
      '</header>' +
      '<div class="reel-viewer__stage is-loading">' +
      '<video class="reel-viewer__video" muted playsinline preload="none"></video>' +
      '<span class="reel-viewer__spinner"></span>' +
      '<button class="reel-viewer__bigplay" aria-label="Play / pause">' + ICON_PLAY + '</button>' +
      '<button class="reel-viewer__nav reel-viewer__nav--prev" aria-label="Previous reel">&larr;</button>' +
      '<button class="reel-viewer__nav reel-viewer__nav--next" aria-label="Next reel">&rarr;</button>' +
      '<div class="reel-viewer__error" role="alert">' +
      '<span class="reel-viewer__error-msg">Unable to load this video.</span>' +
      '<button class="reel-viewer__error-retry" aria-label="Try again">Try Again</button>' +
      '</div>' +
      '</div>' +
      '<footer class="reel-viewer__bar">' +
      '<button class="reel-viewer__pp" aria-label="Play / pause">' + ICON_PAUSE + '</button>' +
      '<div class="reel-viewer__seek"><input type="range" min="0" max="1000" step="1" value="0" aria-label="Seek"></div>' +
      '<span class="reel-viewer__time">0:00 / 0:00</span>' +
      '<button class="reel-viewer__mute" aria-label="Mute / unmute">' + ICON_UNMUTE + '</button>' +
      '<button class="reel-viewer__fs" aria-label="Toggle fullscreen">' + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>' + '</button>' +
      '</footer>' +
      '</div>' +
      '</div>'
    );
    document.body.appendChild(viewer);

    var video = viewer.querySelector('.reel-viewer__video');
    var seek = viewer.querySelector('.reel-viewer__seek input');
    var time = viewer.querySelector('.reel-viewer__time');
    var seeking = false;

    viewer.querySelector('.reel-viewer__backdrop').addEventListener('click', closeViewer);
    viewer.querySelector('.reel-viewer__close').addEventListener('click', closeViewer);
    viewer.querySelector('.reel-viewer__bigplay').addEventListener('click', togglePlay);
    viewer.querySelector('.reel-viewer__pp').addEventListener('click', togglePlay);
    viewer.querySelector('.reel-viewer__mute').addEventListener('click', toggleMute);
    viewer.querySelector('.reel-viewer__nav--prev').addEventListener('click', function () { step(-1); });
    viewer.querySelector('.reel-viewer__nav--next').addEventListener('click', function () { step(1); });
    viewer.querySelector('.reel-viewer__error-retry').addEventListener('click', function () { retryReel(); });
    viewer.querySelector('.reel-viewer__fs').addEventListener('click', function () { toggleFullscreen(); });

    video.addEventListener('canplay', function () {
      viewer.querySelector('.reel-viewer__stage').classList.remove('is-loading');
      if (!video.paused) return;
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    });
    video.addEventListener('play', function () {
      viewer.classList.remove('is-paused');
      viewer.querySelector('.reel-viewer__pp').innerHTML = ICON_PAUSE;
    });
    video.addEventListener('pause', function () {
      viewer.classList.add('is-paused');
      viewer.querySelector('.reel-viewer__pp').innerHTML = ICON_PLAY;
    });
    video.addEventListener('timeupdate', function () {
      if (seeking || !video.duration) return;
      seek.value = (video.currentTime / video.duration) * 1000;
      time.textContent = fmtTime(video.currentTime) + ' / ' + fmtTime(video.duration);
    });
    video.addEventListener('ended', function () { step(1); });

    video.addEventListener('error', function () {
      stageError();
    });

    document.addEventListener('fullscreenchange', function () {
      syncFsIcon();
    });

    seek.addEventListener('pointerdown', function () { seeking = true; });
    seek.addEventListener('input', function () {
      if (video.duration) video.currentTime = (seek.value / 1000) * video.duration;
    });
    seek.addEventListener('change', function () { seeking = false; });

    bindViewerSwipe(viewer.querySelector('.reel-viewer__stage'));
  }

  function bindViewerSwipe(stage) {
    var startX = null;
    var startY = null;
    var swiping = false;

    stage.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      swiping = false;
    }, { passive: true });

    stage.addEventListener('touchmove', function (e) {
      if (startX === null) return;
      var t = e.touches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy) * 1.15) {
        swiping = true;
        e.preventDefault();
      }
    }, { passive: false });

    stage.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = (e.changedTouches[0].clientX || 0) - startX;
      if (swiping) {
        var THRESHOLD = 46;
        if (dx <= -THRESHOLD) { e.preventDefault(); step(1); }
        else if (dx >= THRESHOLD) { e.preventDefault(); step(-1); }
      }
      startX = null;
      startY = null;
      swiping = false;
    }, { passive: false });
  }

  function fmtTime(sec) {
    if (!isFinite(sec)) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function openViewer(index, origin) {
    ensureViewer();
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    viewer.classList.remove('is-closing');
    lastFocused = origin || document.activeElement;
    state.index = index;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      viewer.classList.add('is-open');
    });
    loadReel();
    viewer.querySelector('.reel-viewer__close').focus();
  }

  function loadReel() {
    var reel = client.reels[state.index];
    var stage = viewer.querySelector('.reel-viewer__stage');
    var video = viewer.querySelector('.reel-viewer__video');
    var seek = viewer.querySelector('.reel-viewer__seek input');
    var logo = viewer.querySelector('.reel-viewer__logo');

    viewer.querySelector('.reel-viewer__name').textContent = client.name;
    viewer.querySelector('.reel-viewer__handle').textContent = client.handle;
    viewer.querySelector('.reel-viewer__counter').textContent = pad(state.index + 1) + ' / ' + pad(client.reels.length);
    if (client.logo) { logo.src = client.logo; logo.hidden = false; } else { logo.hidden = true; }

    stage.classList.add('is-loading');
    stage.classList.remove('has-error');
    seek.value = 0;
    video.muted = true;
    syncMute();
    video.currentTime = 0;
    video.src = reel.video;
  }

  function step(dir) {
    state.index = (state.index + dir + client.reels.length) % client.reels.length;
    loadReel();
  }

  function togglePlay() {
    var video = viewer.querySelector('.reel-viewer__video');
    if (video.paused) { var p = video.play(); if (p && typeof p.catch === 'function') p.catch(function () {}); }
    else { video.pause(); }
  }

  function toggleMute() {
    var video = viewer.querySelector('.reel-viewer__video');
    video.muted = !video.muted;
    syncMute();
  }

  function syncMute() {
    var muted = viewer.querySelector('.reel-viewer__video').muted;
    viewer.querySelector('.reel-viewer__mute').innerHTML = muted ? ICON_UNMUTE : ICON_MUTE;
    viewer.querySelector('.reel-viewer__mute').setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  }

  function stageError() {
    var stage = viewer.querySelector('.reel-viewer__stage');
    stage.classList.remove('is-loading');
    stage.classList.add('has-error');
    viewer.classList.add('is-paused');
    viewer.querySelector('.reel-viewer__pp').innerHTML = ICON_PLAY;
  }

  function retryReel() {
    var stage = viewer.querySelector('.reel-viewer__stage');
    stage.classList.remove('has-error');
    loadReel();
  }

  function toggleFullscreen() {
    var stage = viewer.querySelector('.reel-viewer__stage');
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
    } else if (stage && stage.requestFullscreen) {
      var p = stage.requestFullscreen();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }
  }

  function syncFsIcon() {
    var btn = viewer.querySelector('.reel-viewer__fs');
    if (!btn) return;
    var active = !!document.fullscreenElement;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  function closeViewer() {
    if (!viewer || viewer.hidden) return;
    var video = viewer.querySelector('.reel-viewer__video');
    video.pause();
    if (!viewer.classList.contains('is-closing')) {
      viewer.classList.add('is-closing');
      var done = function () {
        closeTimer = null;
        viewer.classList.remove('is-open', 'is-closing');
        viewer.hidden = true;
        video.removeAttribute('src');
        try { video.load(); } catch (e) {}
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      };
      closeTimer = setTimeout(done, reduced ? 0 : 320);
    }
  }

  document.addEventListener('keydown', function (e) {
    if (!viewer || viewer.hidden) return;
    if (e.key === 'Escape') { closeViewer(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'm' || e.key === 'M') { toggleMute(); }
  });

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  initPosterIO();
  build();
})();