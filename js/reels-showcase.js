/* ==========================================================================
   ARRISE DIGITAL — REELS SHOWCASE ENGINE
   Renders a data-driven, 9:16 vertical Reel portfolio with:
   category filter · client profiles · horizontal carousels · lazy posters ·
   hover preview · drag scroll · fullscreen viewer
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.ARRISE_REELS || [];
  var filterRoot = document.getElementById('reelsFilters');
  var clientsRoot = document.getElementById('reelsClients');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var state = { filter: 'All', open: null };
  var viewer = null;
  var lastFocused = null;
  var dragMoved = false;

  var ICON_PLAY = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>';
  var ICON_MUTE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4V5.5l-5 4H3zM16 8.5a5 5 0 0 1 0 7l-1.4-1.4a3.2 3.2 0 0 0 0-4.2L16 8.5z" stroke="currentColor" fill="currentColor"/></svg>';
  var ICON_UNMUTE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9.5v5h4l5 4V5.5l-5 4H3z" fill="currentColor"/><path d="M15.5 8.5l5 7M20.5 8.5l-5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>';

  if (!filterRoot || !clientsRoot) { document.body.classList.add('reels-ready'); return; }

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function html(str) {
    var t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.firstElementChild;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ------------------------------------------------------------------
     Category filters
     ------------------------------------------------------------------ */
  function renderFilters() {
    var cats = [];
    DATA.forEach(function (c) {
      if (cats.indexOf(c.filter) === -1) cats.push(c.filter);
    });
    var names = ['All'].concat(cats);
    filterRoot.innerHTML = '';
    names.forEach(function (name) {
      var count = name === 'All'
        ? DATA.length
        : DATA.filter(function (c) { return c.filter === name; }).length;
      var btn = html(
        '<button class="reel-filter' + (name === 'All' ? ' is-active' : '') +
        '" data-filter="' + name + '" role="tab" aria-selected="' + (name === 'All') + '">' +
        '<span>' + name + '</span><em>' + count + '</em></button>'
      );
      btn.addEventListener('click', function () { setFilter(name); });
      filterRoot.appendChild(btn);
    });
  }

  function setFilter(name) {
    state.filter = name;
    filterRoot.querySelectorAll('.reel-filter').forEach(function (b) {
      var on = b.dataset.filter === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    clientsRoot.querySelectorAll('.reel-client').forEach(function (sec) {
      setClientVisible(sec, name === 'All' || sec.dataset.filter === name);
    });
  }

  function setClientVisible(sec, show) {
    clearTimeout(sec._hideT);
    if (show) {
      sec.classList.remove('is-hiding');
      sec.hidden = false;
      sec.classList.remove('is-in');
      void sec.offsetWidth;
      sec.classList.add('is-in');
    } else {
      sec.classList.remove('is-in');
      sec.classList.add('is-hiding');
      sec._hideT = setTimeout(function () {
        sec.hidden = true;
        sec.classList.remove('is-hiding');
      }, reduced ? 0 : 360);
    }
  }

  /* ------------------------------------------------------------------
     Client sections
     ------------------------------------------------------------------ */
  function buildClient(c, ci) {
    var sec = html(
      '<article class="reel-client" data-filter="' + c.filter + '" style="--cd:' + (ci * 60) + 'ms" aria-label="' + c.name + '">' +
      '<header class="reel-client__head">' +
      '<span class="reel-client__logo"><img src="' + c.logo + '" alt="' + c.name + ' logo" loading="lazy"></span>' +
      '<span class="reel-client__info">' +
      '<span class="reel-client__name">' + c.name + '</span>' +
      '<span class="reel-client__handle">' + c.handle + '</span>' +
      '<span class="reel-client__tag">' + c.category + '</span>' +
      '</span>' +
      '<a class="reel-client__view" href="' + c.page + '"><span>View project</span> &rarr;</a>' +
      '</header>' +
      '<p class="reel-client__desc">' + c.description + '</p>' +
      '</article>'
    );
    var car = buildCarousel(c);
    sec.appendChild(car);
    return sec;
  }

  function buildCarousel(c) {
    var car = html('<div class="reel-carousel"></div>');
    var navPrev = html('<button class="reel-nav reel-nav--prev" aria-label="Scroll ' + c.name + ' reels left">&larr;</button>');
    var navNext = html('<button class="reel-nav reel-nav--next" aria-label="Scroll ' + c.name + ' reels right">&rarr;</button>');
    var track = html('<div class="reel-track" role="list" aria-label="Reels for ' + c.name + '"></div>');

    c.reels.forEach(function (r, ri) {
      var card = buildReelCard(c, r, ri);
      track.appendChild(card);
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
  function buildReelCard(c, r, ri) {
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
    card.setAttribute('aria-label', 'Play ' + r.title + ' reel by ' + c.name);

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

    card.__client = c;
    card.__reel = r;
    card.__index = ri;

    card.addEventListener('click', function () {
      if (dragMoved) { dragMoved = false; return; }
      stopCardPreviews(card);
      openViewer(c, ri, card);
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
     Lazy poster generation (first frame via canvas)
     ------------------------------------------------------------------ */
  var posterIO = null;
  var posterQueue = [];
  var posterBusy = false;

  function initPosterIO() {
    if (!('IntersectionObserver' in window)) { document.body.classList.add('reels-ready'); return; }
    posterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          posterIO.unobserve(en.target);
          queuePoster(en.target);
        }
      });
    }, { rootMargin: '420px 0px' });
  }

  function queuePoster(card) {
    posterQueue.push(card);
    pumpPosters();
  }

  function pumpPosters() {
    if (posterBusy || !posterQueue.length) return;
    var card = posterQueue.shift();
    var reel = card.__reel;
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
      if (d === Infinity || isNaN(d)) { v.currentTime = 0.3; }
      else { v.currentTime = Math.min(0.6, d / 2); }
    }, { once: true });

    v.addEventListener('seeked', function () {
      try {
        var c = document.createElement('canvas');
        c.width = 270;
        c.height = 480;
        var ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(v, 0, 0, 270, 480);
          var img = card.querySelector('.reel-poster');
          if (img) {
            img.src = c.toDataURL('image/jpeg', 0.72);
            img.classList.add('is-loaded');
            card.dataset.posterState = 'done';
          }
        }
      } catch (e) { card.dataset.posterState = 'done'; }
      settle();
    }, { once: true });

    v.addEventListener('error', function () {
      card.dataset.posterState = 'done';
      settle();
    }, { once: true });

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
     Entrance reveal
     ------------------------------------------------------------------ */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      clientsRoot.querySelectorAll('.reel-client').forEach(function (s) { s.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -60px' });
    clientsRoot.querySelectorAll('.reel-client').forEach(function (s) { io.observe(s); });
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
      '</div>' +
      '<footer class="reel-viewer__bar">' +
      '<button class="reel-viewer__pp" aria-label="Play / pause">' + ICON_PAUSE + '</button>' +
      '<div class="reel-viewer__seek"><input type="range" min="0" max="1000" step="1" value="0" aria-label="Seek"></div>' +
      '<span class="reel-viewer__time">0:00 / 0:00</span>' +
      '<button class="reel-viewer__mute" aria-label="Mute / unmute">' + ICON_UNMUTE + '</button>' +
      '</footer>' +
      '</div>' +
      '</div>'
    );
    document.body.appendChild(viewer);

    var stage = viewer.querySelector('.reel-viewer__stage');
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

    video.addEventListener('canplay', function () {
      stage.classList.remove('is-loading');
      if (!video.paused) return;
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    });
    video.addEventListener('play', function () {
      viewer.classList.remove('is-paused');
      viewer.querySelector('.reel-viewer__pp').innerHTML = ICON_PAUSE;
      viewer.querySelector('.reel-viewer__pp').setAttribute('aria-label', 'Pause');
    });
    video.addEventListener('pause', function () {
      viewer.classList.add('is-paused');
      viewer.querySelector('.reel-viewer__pp').innerHTML = ICON_PLAY;
      viewer.querySelector('.reel-viewer__pp').setAttribute('aria-label', 'Play');
    });
    video.addEventListener('timeupdate', function () {
      if (seeking || !video.duration) return;
      seek.value = (video.currentTime / video.duration) * 1000;
      time.textContent = fmtTime(video.currentTime) + ' / ' + fmtTime(video.duration);
    });
    video.addEventListener('ended', function () { step(1); });

    seek.addEventListener('pointerdown', function () { seeking = true; });
    seek.addEventListener('input', function () {
      if (video.duration) video.currentTime = (seek.value / 1000) * video.duration;
    });
    seek.addEventListener('change', function () { seeking = false; });
  }

  function fmtTime(sec) {
    if (!isFinite(sec)) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function openViewer(client, index, origin) {
    ensureViewer();
    lastFocused = origin || document.activeElement;
    state.open = { client: client, index: index };
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    loadReel();
    var closeBtn = viewer.querySelector('.reel-viewer__close');
    if (closeBtn) closeBtn.focus();
  }

  function loadReel() {
    var o = state.open;
    var reel = o.client.reels[o.index];
    var stage = viewer.querySelector('.reel-viewer__stage');
    var video = viewer.querySelector('.reel-viewer__video');
    var seek = viewer.querySelector('.reel-viewer__seek input');
    var logo = viewer.querySelector('.reel-viewer__logo');

    viewer.querySelector('.reel-viewer__name').textContent = o.client.name;
    viewer.querySelector('.reel-viewer__handle').textContent = o.client.handle;
    viewer.querySelector('.reel-viewer__counter').textContent = pad(o.index + 1) + ' / ' + pad(o.client.reels.length);
    if (o.client.logo) {
      logo.src = o.client.logo;
      logo.hidden = false;
    } else {
      logo.hidden = true;
    }

    stage.classList.add('is-loading');
    seek.value = 0;
    video.muted = true;
    syncMute();
    video.currentTime = 0;
    video.src = reel.video;
  }

  function step(dir) {
    if (!state.open) return;
    var reels = state.open.client.reels;
    state.open.index = (state.open.index + dir + reels.length) % reels.length;
    loadReel();
  }

  function togglePlay() {
    if (!state.open) return;
    var video = viewer.querySelector('.reel-viewer__video');
    if (video.paused) {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } else {
      video.pause();
    }
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

  function closeViewer() {
    if (!viewer || viewer.hidden) return;
    var video = viewer.querySelector('.reel-viewer__video');
    video.pause();
    video.removeAttribute('src');
    try { video.load(); } catch (e) {}
    viewer.hidden = true;
    document.body.style.overflow = '';
    state.open = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (!viewer || viewer.hidden || !state.open) return;
    if (e.key === 'Escape') { closeViewer(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
    else if (e.key === 'm' || e.key === 'M') { toggleMute(); }
  });

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.body.classList.add('reels-ready');
  initPosterIO();
  renderFilters();
  DATA.forEach(function (c, ci) {
    clientsRoot.appendChild(buildClient(c, ci));
  });
  initReveal();
  if (DATA.length) posterQueue = [];

  if (reduced) {
    clientsRoot.querySelectorAll('.reel-client').forEach(function (s) {
      s.classList.add('is-in');
    });
  }
})();