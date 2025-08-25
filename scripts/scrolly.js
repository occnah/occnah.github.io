/* Centered anchors, robust image sizing, smooth beats (down→up),
   highlight & chunks modes, mobile-safe behavior, and solid navbar toggle. */
(function(){
  // ---------------- NAVBAR SOLID TOGGLE ----------------
  const nav = document.getElementById('site-nav');
  const hero = document.getElementById('hero-intro');
  const navObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      nav.classList.toggle('nav-solid', !e.isIntersecting);
    });
  }, { threshold: 0.01 });
  if (hero) navObs.observe(hero);

  // ---------------- CENTERED ANCHOR SCROLL ----------------
  const navHeight = () => document.getElementById('site-nav')?.offsetHeight || 0;

  function scrollToTarget(el){
    const rect = el.getBoundingClientRect();
    const y = window.pageYOffset + rect.top;
    const vh = window.innerHeight;
    const anchorMode = el.getAttribute('data-anchor') || 'top';

    let targetY;
    if (anchorMode === 'center') {
      // center the section body in viewport, minus nav
      const centerOffset = Math.max(0, (vh - Math.min(rect.height, vh*0.8)) / 2);
      targetY = y - (vh/2 - centerOffset) + navHeight();
    } else {
      // top anchor (just under nav)
      targetY = y - navHeight() - 8;
    }
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', id);
    });
  });

  // ---------------- IMAGE PRELOAD (prevents "missing second image") ----------------
  const toPreload = Array.from(document.querySelectorAll('.sb-media img, .fs-split-right img'));
  toPreload.forEach(img=>{ const i = new Image(); i.src = img.currentSrc || img.src; });

  // --------------- HELPERS ----------------
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function centerProgress(el){
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = vh * 0.5;
    const mid = r.top + r.height/2;
    const dist = Math.abs(mid - center);
    const max = vh * 0.6;
    return clamp(1 - dist / max, 0, 1);
  }

  // ---------------- BEAT MODE (scroll-driven; no IO glitches) ----------------
  const beatContainers = Array.from(document.querySelectorAll('.sb-steps[data-mode="beat"]'));
  const allBeats = beatContainers.flatMap(c => Array.from(c.querySelectorAll('.sb-beat')));

  function updateBeats(){
    beatContainers.forEach(container=>{
      const beats = Array.from(container.querySelectorAll('.sb-beat'));
      // find beat whose center is closest to viewport center
      let best = beats[0]; let bestDist = Infinity;
      const vhMid = (window.innerHeight||1) * 0.5;
      beats.forEach(b=>{
        const r = b.getBoundingClientRect();
        const mid = r.top + r.height/2;
        const d = Math.abs(mid - vhMid);
        if (d < bestDist){ bestDist = d; best = b; }
        // smooth drift (down→up) & opacity
        const p = centerProgress(b);
        const eased = p*p*(3 - 2*p);
        const opacity = lerp(0.14, 1, eased);
        const scale = lerp(0.982, 1, eased);
        const translate = lerp(18, -6, eased);
        b.style.opacity = opacity.toFixed(3);
        b.style.transform = `translateY(${translate}px) scale(${scale.toFixed(3)})`;
      });
      beats.forEach(b=>b.classList.toggle('is-active', b===best));
      const panel = container.closest('.sb-panel');
      if (panel){
        const panelMid = panel.getBoundingClientRect().top + panel.getBoundingClientRect().height/2;
        panel.classList.toggle('is-current', Math.abs(panelMid - vhMid) < (window.innerHeight*0.6));
      }
    });
  }

  // ---------------- HIGHLIGHT MODE (all visible; active line) ----------------
  const highlightContainers = Array.from(document.querySelectorAll('.sb-steps[data-mode="highlight"]'));
  function updateHighlight(){
    const vhMid = (window.innerHeight||1) * 0.5;
    highlightContainers.forEach(steps=>{
      const items = Array.from(steps.querySelectorAll('.sb-item'));
      // use markers if present, else compute from items
      const markers = Array.from(steps.querySelectorAll('.sb-marker'));
      let idx = 0; let best = Infinity;
      const sources = markers.length ? markers : items;
      sources.forEach((el,i)=>{
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height/2;
        const d = Math.abs(mid - vhMid);
        if (d < best){ best=d; idx=i; }
      });
      items.forEach((it,i)=>it.classList.toggle('is-active', i===idx));
      const panel = steps.closest('.sb-panel');
      if (panel){
        const panelMid = panel.getBoundingClientRect().top + panel.getBoundingClientRect().height/2;
        panel.classList.toggle('is-current', Math.abs(panelMid - vhMid) < (window.innerHeight*0.6));
      }
    });
  }

  // ---------------- CHUNKS MODE (one paragraph; span highlight) ----------------
  const chunkContainers = Array.from(document.querySelectorAll('.sb-steps[data-mode="chunks"]'));
  function updateChunks(){
    const vhMid = (window.innerHeight||1) * 0.5;
    chunkContainers.forEach(steps=>{
      const chunks = Array.from(steps.querySelectorAll('.sb-chunk'));
      const markers = Array.from(steps.querySelectorAll('.sb-marker'));
      const sources = markers.length ? markers : chunks;
      let idx = 0; let best = Infinity;
      sources.forEach((el,i)=>{
        const r = el.getBoundingClientRect(); const mid = r.top + r.height/2;
        const d = Math.abs(mid - vhMid); if (d<best){best=d; idx=i;}
      });
      chunks.forEach((c,i)=>c.classList.toggle('is-active', i===idx));
    });
  }

  // ---------------- SCROLL LOOP ----------------
  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      updateBeats();
      updateHighlight();
      updateChunks();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll(); // initial paint
})();
