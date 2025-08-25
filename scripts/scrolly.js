/* Apple/Margelo-style beats + highlight with smoother easing,
   and a solid-on-scroll navbar toggle. No libraries. */
(function(){
  // ---------------- NAVBAR SOLID TOGGLE ----------------
  const nav = document.getElementById('site-nav');
  const hero = document.getElementById('hero-intro');
  const navObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      // When hero is *not* intersecting (you've scrolled past it), make nav solid
      nav.classList.toggle('nav-solid', !e.isIntersecting);
    });
  }, { threshold: 0.01 });
  if (hero) navObs.observe(hero);

  // --------------- HELPERS ----------------
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Compute "progress to center" for a beat (0 far, 1 centered)
  function centerProgress(el){
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const center = vh * 0.5;
    const mid = r.top + r.height/2;
    const dist = Math.abs(mid - center);
    const max = vh * 0.55;   // area where we start/stop easing
    return clamp(1 - dist / max, 0, 1);
  }

  // ---------------- BEAT MODE ----------------
  const beatContainers = Array.from(document.querySelectorAll('.sb-steps[data-mode="beat"]'));
  const allBeats = beatContainers.flatMap(c => Array.from(c.querySelectorAll('.sb-beat')));

  // Observe which beat is in range (coarse), then refine with rAF easing
  const beatObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const beat = entry.target;
      const panel = beat.closest('.sb-panel');

      if (entry.isIntersecting){
        // mark panel current
        document.querySelectorAll('.sb-panel').forEach(p=>p.classList.toggle('is-current', p===panel));
        // activate this beat
        panel.querySelectorAll('.sb-beat').forEach(b=>b.classList.toggle('is-active', b===beat));
      }
    });
  }, { threshold: 0.6, rootMargin: '0px 0px -20% 0px' });
  allBeats.forEach(b => beatObserver.observe(b));

  // Smooth opacity/scale based on distance to center while scrolling
  let ticking = false;
  function onScrollSmooth(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      allBeats.forEach(b=>{
        const p = centerProgress(b); // 0..1
        const eased = p*p*(3 - 2*p); // smoothstep
        const opacity = lerp(0.15, 1, eased);
        const scale = lerp(0.985, 1, eased);
        const translate = lerp(14, 0, eased);
        b.style.opacity = opacity.toFixed(3);
        b.style.transform = `translateY(${translate}px) scale(${scale.toFixed(3)})`;
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScrollSmooth, { passive:true });
  window.addEventListener('resize', onScrollSmooth);

  // ---------------- HIGHLIGHT MODE ----------------
  document.querySelectorAll('.sb-steps[data-mode="highlight"]').forEach(steps => {
    const items = Array.from(steps.querySelectorAll('.sb-item'));
    const panel = steps.closest('.sb-panel');
    let markers = Array.from(steps.querySelectorAll('.sb-marker'));

    // if markers missing, synthesize
    if (markers.length === 0) {
      const mbox = document.createElement('div'); mbox.className = 'sb-markers';
      items.forEach((_,i)=>{ const m=document.createElement('div'); m.className='sb-marker'; m.dataset.index=i; mbox.appendChild(m); });
      steps.appendChild(mbox);
      markers = Array.from(steps.querySelectorAll('.sb-marker'));
    }

    const markerObs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        const idx = Number(entry.target.dataset.index || 0);
        items.forEach((it,i)=>it.classList.toggle('is-active', i===idx));
        document.querySelectorAll('.sb-panel').forEach(p=>p.classList.toggle('is-current', p===panel));
      });
    }, { threshold: 0.55, rootMargin: '0px 0px -25% 0px' });

    markers.forEach(m=>markerObs.observe(m));
  });
})();
