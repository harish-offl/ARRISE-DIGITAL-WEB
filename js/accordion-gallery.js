(function() {
  'use strict';

  const DEFAULT_ITEMS = [
    { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
    { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
    { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
    { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' }
  ];

  function initAccordionGallery(container, items, options = {}) {
    const defaultIndex = options.defaultIndex || 2;
    const expandRatio = options.expandRatio || 0.52;
    const trigger = options.trigger || 'hover';
    const orientation = options.orientation || 'horizontal';
    const tilt = options.tilt || 8;
    const grayscale = options.grayscale !== false;

    const vertical = orientation === 'vertical';
    const count = items.length;
    let active = Math.min(Math.max(defaultIndex, 0), count - 1);

    const panels = [];
    const mediaEls = [];
    const overlayEls = [];

    function build() {
      container.innerHTML = '';
      container.className = vertical ? 'accordion-gallery accordion-gallery--vertical' : 'accordion-gallery';

      items.forEach((item, i) => {
        const panel = document.createElement('a');
        panel.href = item.link || '#';
        panel.className = 'ag-panel';
        panel.setAttribute('role', 'listitem');
        panel.setAttribute('tabindex', '0');
        panel.setAttribute('aria-label', item.label);
        panel.setAttribute('aria-current', i === active ? 'true' : undefined);

        const frame = document.createElement('span');
        frame.className = 'ag-panel__frame';

        const media = document.createElement('span');
        media.className = 'ag-panel__media';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.alt || item.label || '';
        img.draggable = false;
        media.appendChild(img);

        const overlay = document.createElement('span');
        overlay.className = 'ag-panel__overlay';

        frame.appendChild(media);
        frame.appendChild(overlay);

        const label = document.createElement('span');
        label.className = 'ag-panel__label';
        label.setAttribute('aria-hidden', 'true');

        const bar = document.createElement('span');
        bar.className = 'ag-panel__bar';

        const text = document.createElement('span');
        text.className = 'ag-panel__text';
        text.textContent = item.label;

        label.appendChild(bar);
        label.appendChild(text);

        panel.appendChild(frame);
        panel.appendChild(label);

        panel.addEventListener('mouseenter', () => handleEnter(i));
        panel.addEventListener('focus', () => handleEnter(i));
        panel.addEventListener('click', (e) => handleClick(i, e));
        panel.addEventListener('keydown', (e) => handleKeyDown(i, e));

        container.appendChild(panel);
        panels.push(panel);
        mediaEls.push(media);
        overlayEls.push(overlay);
      });

      applyLayout(false);
    }

    function handleEnter(i) {
      if (trigger === 'hover') setActive(i);
    }

    function handleClick(i, e) {
      if (i !== active) {
        e.preventDefault();
        setActive(i);
      }
    }

    function handleKeyDown(i, e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i + 1) % count);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i - 1 + count) % count);
      }
    }

    function setActive(i) {
      active = i;
      applyLayout(true);
    }

    function applyLayout(animate) {
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

      panels.forEach((panel, i) => {
        const isActive = i === active;
        const media = mediaEls[i];
        const overlay = overlayEls[i];

        panel.style.flexGrow = isActive ? grow : 1;
        panel.classList.toggle('ag-panel--active', isActive);
        panel.setAttribute('aria-current', isActive ? 'true' : undefined);

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        panel.style.transform = vertical ? `rotateX(${-rot}deg)` : `rotateY(${rot}deg)`;

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const mediaSize = getMediaSize();
          const shift = drift * 0.5 * mediaSize * 0.06;
          media.style.setProperty('--ag-gray', grayscale ? (isActive ? 0 : 1) : 0);
          media.style.setProperty('--ag-dim', isActive ? 0 : 0.35);
          if (vertical) {
            media.style.transform = `translate(-50%, -50%) translateY(${isActive ? 0 : shift}px)`;
          } else {
            media.style.transform = `translate(-50%, -50%) translateX(${isActive ? 0 : shift}px)`;
          }
        }

        if (overlay) {
          overlay.style.opacity = isActive ? 1 : 0.35;
        }
      });
    }

    function getMediaSize() {
      const rect = container.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const gap = 10;
      const usable = Math.max(total - gap * (count - 1), 120);
      return Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
    }

    function measure() {
      const mediaSize = getMediaSize();
      container.style.setProperty('--ag-media-size', `${mediaSize}px`);
      applyLayout(false);
    }

    build();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
  }

  window.AccordionGallery = { initAccordionGallery };
})();
