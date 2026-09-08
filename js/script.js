/* ==========================================================================
   ARRISE DIGITAL â€” INTERACTIONS ENGINE
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ------------------------------------------------------------------
     NAV
     ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  function initNav() {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
      updateActiveLink();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = 'home';
    const pos = window.scrollY + 140;
    sections.forEach((s) => {
      if (s.offsetTop <= pos) current = s.id;
    });
    document.querySelectorAll('.nav__link').forEach((l) => {
      const active = l.getAttribute('href') === '#' + current;
      l.classList.toggle('active', active);
    });
  }

  /* ------------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------------ */
  function initReveals() {
    const items = document.querySelectorAll('.reveal-up');
    items.forEach((i) => i.classList.add('in-view'));
  }

  /* ------------------------------------------------------------------
     COUNTERS
     ------------------------------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;
    if (prefersReduced) {
      counters.forEach((c) => { c.textContent = c.dataset.target; });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const dur = 1800;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => io.observe(c));
  }

  /* ------------------------------------------------------------------
     SKILL BARS
     ------------------------------------------------------------------ */
  function initSkills() {
    const fills = document.querySelectorAll('.skill__fill');
    const vals = document.querySelectorAll('.skill__val');
    if (!fills.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          const w = bar.dataset.w;
          bar.style.width = w + '%';
          io.unobserve(bar);
        });
      },
      { threshold: 0.4 }
    );
    fills.forEach((f) => io.observe(f));

    vals.forEach((v) => {
      const target = parseInt(v.dataset.count, 10);
      if (prefersReduced) { v.textContent = target + '%'; return; }
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          const dur = 1500;
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            v.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + '%';
            if (p < 1) requestAnimationFrame(tick);
            else v.textContent = target + '%';
          }
          requestAnimationFrame(tick);
          io2.unobserve(v);
        });
      }, { threshold: 0.5 });
      io2.observe(v);
    });
  }

  /* ------------------------------------------------------------------
     FORMS
     ------------------------------------------------------------------ */
  function initForms() {
    const contact = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (contact) {
      contact.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!contact.checkValidity()) {
          contact.reportValidity();
          return;
        }
        const data = new FormData(contact);
        const whatsappMessage = [
          'Hello ARRISE DIGITAL, I would like a quote.',
          '',
          `Name: ${data.get('name')}`,
          `Email: ${data.get('email')}`,
          `Phone: ${data.get('phone')}`,
          `Service: ${data.get('service')}`,
          '',
          `Message: ${data.get('message')}`
        ].join('\n');

        window.location.href = `https://wa.me/919363973591?text=${encodeURIComponent(whatsappMessage)}`;
      });
    }

    const news = document.getElementById('newsForm');
    if (news) {
      news.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = news.querySelector('input');
        const btn = news.querySelector('button');
        if (!input.value || !input.checkValidity()) return;
        btn.textContent = '✓';
        btn.style.background = 'var(--lime-2)';
        input.value = '';
        setTimeout(() => { btn.textContent = '→'; btn.style.background = ''; }, 4000);
      });
    }
  }

  /* ------------------------------------------------------------------
     FAQ ACCORDION
     ------------------------------------------------------------------ */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-item__q');
      q.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ------------------------------------------------------------------
     CLIENT STORIES SLIDER
     ------------------------------------------------------------------ */
  function initStoriesSlider() {
    const slider = document.getElementById('csSlider');
    const track = document.getElementById('csTrack');
    const dotsWrap = document.getElementById('csDots');
    const prev = document.getElementById('csPrev');
    const next = document.getElementById('csNext');
    if (!slider || !track || !dotsWrap || !prev || !next) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cs-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to story ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    const dots = dotsWrap.children;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      [...dots].forEach((d, j) => d.classList.toggle('active', j === index));
      restart();
    }

    function restart() {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 6500);
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('touchstart', () => clearInterval(timer));
    slider.addEventListener('touchend', restart);
    restart();
  }

  /* ------------------------------------------------------------------
     SERVICES
     ------------------------------------------------------------------ */
  function initServices() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => {
      const toggle = card.querySelector('.service-card__toggle');
      const panel = card.querySelector('.service-card__panel');
      if (!toggle || !panel) return;

      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', open);
        panel.hidden = !open;
        toggle.innerHTML = open ? 'Close <span>←</span>' : 'Explore Service <span>→</span>';
      });
    });
  }

  /* ------------------------------------------------------------------
     PORTFOLIO FILTER
     ------------------------------------------------------------------ */
  function initPortfolio() {
    const filters = document.querySelectorAll('.portfolio__filter');
    const cards = document.querySelectorAll('.portfolio-card');
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards.forEach((c) => {
          const cats = (c.dataset.category || 'all').split(',').map((s) => s.trim());
          const show = cat === 'all' || cats.indexOf(cat) !== -1;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn('ARRISE DIGITAL init error:', e); } }

  ready(function () {
    safe(initNav);
    safe(initFaq);
    safe(initStoriesSlider);
    safe(initCounters);
    safe(initSkills);
    safe(initForms);
    safe(initReveals);
    safe(initServices);
    safe(initPortfolio);
  });
})();
