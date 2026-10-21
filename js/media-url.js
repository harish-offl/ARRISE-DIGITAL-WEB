/* ==========================================================================
   ARRISE DIGITAL — MEDIA URL RESOLVER
   --------------------------------------------------------------------------
   Videos are stored with Git LFS. A plain repo-relative path such as
   "videos/smp/clip.mp4" resolves to the 133-byte LFS pointer text when the
   site is served from GitHub (raw.githubusercontent.com returns the pointer,
   not the media), so browsers cannot play them and the reel viewer shows
   "Unable to load this video."

   This resolver maps repo-relative media paths to GitHub's LFS media
   endpoint, which serves the real bytes, and leaves paths untouched on any
   other host (local development, other static hosts, CDN).

   Usage:  var src = window.ARRISE_MEDIA.url(reel.video);
   ========================================================================== */
(function () {
  'use strict';

  var REPO = 'harish-offl/ARRISE-DIGITAL-WEB';
  var REF = 'main';
  var LFS_BASE = 'https://media.githubusercontent.com/media/' + REPO + '/' + REF + '/';

  function isGitHubHost(host) {
    if (!host) return false;
    host = String(host).toLowerCase();
    return host === 'github.com' ||
           host === 'www.github.com' ||
           host === 'github.io' ||
           host === 'www.github.io' ||
           host.indexOf('.github.com') > -1 ||
           host.indexOf('.github.io') > -1;
  }

  /* Percent-encode each segment, keeping the "/" separators intact. */
  function encodePath(path) {
    return path.split('/').map(function (seg) {
      return encodeURIComponent(seg);
    }).join('/');
  }

  function url(path) {
    if (!path) return '';
    var p = String(path);

    /* Already absolute (http, https, //, data:, blob:) — leave as-is. */
    if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(p) ||
        /^(?:data|blob):/i.test(p)) {
      return p;
    }

    /* Not hosted on GitHub — relative path resolves correctly. */
    if (!isGitHubHost(window.location.hostname)) return p;

    /* Repo-relative path: drop leading "../" or "./" segments. */
    p = p.replace(/^(?:\.\.\/|\.\/)+/, '');
    return LFS_BASE + encodePath(p);
  }

  window.ARRISE_MEDIA = {
    url: url,
    isGitHubHost: isGitHubHost,
    LFS_BASE: LFS_BASE,
    REPO: REPO,
    REF: REF
  };
})();
