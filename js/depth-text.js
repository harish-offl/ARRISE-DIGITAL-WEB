/* DepthText — Vanilla JS port */
(function () {
  'use strict';

  const MAX_LAYERS = 64;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const getLayerColor = (face, depth, i, total) => {
    const p = total <= 1 ? 1 : i / total;
    const eased = p * p;
    const mix = Math.round((1 - eased) * 72 + 4);
    return `color-mix(in srgb, ${face} ${mix}%, ${depth})`;
  };

  function initDepthText(el) {
    const text       = el.dataset.text       || 'Elevate';
    const layers     = clamp(Math.round(Number(el.dataset.layers) || 34), 2, MAX_LAYERS);
    const depth      = clamp(Number(el.dataset.depth) || 2.4, 0, 12);
    const faceColor  = el.dataset.faceColor  || '#f8fafc';
    const depthColor = el.dataset.depthColor || '#7c3aed';
    const tilt       = clamp(Number(el.dataset.tilt) || 7.5, 0, 12);
    const smoothing  = clamp(Number(el.dataset.smoothing) || 0.14, 0.02, 0.35);
    const perspective= clamp(Number(el.dataset.perspective) || 900, 300, 2000);
    const autoOrbit  = el.dataset.autoOrbit  !== 'false';
    const orbitSpeed = clamp(Number(el.dataset.orbitSpeed) || 0.35, 0, 2);
    const fontSize   = el.dataset.fontSize   || 'clamp(3rem, 12vw, 7rem)';
    const fontWeight = el.dataset.fontWeight || 900;
    const shadow     = el.dataset.shadow     !== 'false';

    const baseRotation = { x: -tilt * 0.32, y: tilt * 0.42 };

    el.style.setProperty('--depth-text-perspective', perspective + 'px');
    el.style.setProperty('--depth-text-font-size', fontSize);
    el.style.setProperty('--depth-text-font-weight', fontWeight);
    el.style.setProperty('--depth-text-face-color', faceColor);
    el.style.setProperty('--depth-text-depth-color', depthColor);
    el.style.setProperty('--depth-text-shadow',
      shadow
        ? `0 22px 34px color-mix(in srgb, ${depthColor} 36%, transparent), 0 4px 8px rgba(0,0,0,0.28)`
        : 'none'
    );

    const stage = document.createElement('span');
    stage.className = 'depth-text__stage';

    for (let i = layers; i >= 1; i--) {
      const layer = document.createElement('span');
      layer.className = 'depth-text__layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.color     = getLayerColor(faceColor, depthColor, i, layers);
      layer.style.transform = `translateZ(${-i * depth}px)`;
      layer.textContent     = text;
      stage.appendChild(layer);
    }

    const face = document.createElement('span');
    face.className = 'depth-text__face';
    face.textContent = text;
    stage.appendChild(face);

    el.innerHTML = '';
    el.appendChild(stage);

    /* animation loop */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (reducedMotion) {
      stage.style.transform = `rotateX(${baseRotation.x}deg) rotateY(${baseRotation.y}deg)`;
      return;
    }

    let frameId = 0;
    let activePointer = false;
    let startTime = performance.now();
    const current = { ...baseRotation };
    const target  = { ...baseRotation };

    const applyTransform = () => {
      stage.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
    };

    const handlePointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      activePointer = true;
      const x = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);
      target.x = baseRotation.x - y * tilt;
      target.y = baseRotation.y + x * tilt;
    };

    const handlePointerLeave = () => {
      activePointer = false;
      target.x = baseRotation.x;
      target.y = baseRotation.y;
    };

    if (finePointer) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);
    }

    const tick = (now) => {
      if (!activePointer && autoOrbit) {
        const elapsed = (now - startTime) / 1000;
        const orbit   = elapsed * orbitSpeed * Math.PI * 2;
        const amt     = finePointer ? 0.18 : 0.55;
        target.x = baseRotation.x + Math.sin(orbit) * tilt * amt;
        target.y = baseRotation.y + Math.cos(orbit * 0.85) * tilt * amt;
      }
      current.x += (target.x - current.x) * smoothing;
      current.y += (target.y - current.y) * smoothing;
      applyTransform();
      frameId = requestAnimationFrame(tick);
    };

    applyTransform();
    frameId = requestAnimationFrame(tick);

    el._depthCleanup = () => {
      if (finePointer) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('blur', handlePointerLeave);
      }
      cancelAnimationFrame(frameId);
    };
  }

  /* auto-init all <div data-depth-text> */
  function initAll() {
    document.querySelectorAll('[data-depth-text]').forEach(initDepthText);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.DepthText = { init: initDepthText, initAll };
})();
