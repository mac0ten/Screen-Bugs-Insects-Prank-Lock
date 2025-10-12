// Minimal, self-contained overlay engine that uses your GIFs

class GIFBugOverlay {
  constructor(options = {}) {
    this.root = document.getElementById('overlay-root') || this._ensureRoot();
    this.pool = new Set();
    this.maxAtOnce = options.maxAtOnce ?? 6;
    this.assets = {
      cockroach: 'cockroach.gif',
      caterpillar: 'caterpillar.gif',
      moth: 'moth.gif'
    };
    this.speed = options.speed ?? 110;  // px/sec baseline
    this.opacity = options.opacity ?? 0.98;
    this.wiggle = options.wiggle ?? 18;
    this.enabled = true;

    // TOP-DOWN: rotation alignment for sprite facing direction.
    // If your art faces UP by default, -90 keeps it aligned with motion.
    // Adjust per species if needed (e.g., 0 if art faces RIGHT).
    this.headingOffsetDeg = {
      cockroach: 90,
      caterpillar: 90,
      moth: 90
    };

    this._preload();
    this._bindPowerSaver();
  }

  _ensureRoot(){
    const r = document.createElement('div');
    r.id = 'overlay-root';
    r.setAttribute('aria-hidden','true');
    // Ensure it's the FIRST child for absolute certainty
    document.body.insertBefore(r, document.body.firstChild || null);
    return r;
  }

  _preload(){
    Object.values(this.assets).forEach(src => { const img = new Image(); img.src = src; });
  }

  _bindPowerSaver(){
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pauseAll();
      else this.resumeAll();
    });
    window.addEventListener('blur', () => this.pauseAll());
    window.addEventListener('focus', () => this.resumeAll());
  }

  setEnabled(on){
    this.enabled = !!on;
    this.root.style.display = on ? 'block' : 'none';
    if (!on) this.clear();
  }

  setOpacity(value){
    this.opacity = value;
    this.pool.forEach(el => el.style.opacity = value);
  }

  spawn(type){
    if (!this.enabled) return;
    if (this.pool.size >= this.maxAtOnce) return;
    const src = this.assets[type];
    if (!src) return;

    const el = document.createElement('img');
    el.src = src;
    el.alt = type;
    el.className = 'gif-bug';
    el.style.opacity = this.opacity;
    el._type = type; // keep a tiny reference
    this.root.appendChild(el);
    this.pool.add(el);

    // Click to squash
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._squash(el);
    });

    this._animate(el, type);

    el.addEventListener('error', () => this._despawn(el));
    return el;
  }

  clear(){ [...this.pool].forEach(el => this._despawn(el)); }

  pauseAll(){ this.pool.forEach(el => el._paused = true); }
  resumeAll(){
    this.pool.forEach(el => {
      el._paused = false;
      // Will resume on next RAF tick inside _animate loops
      if (el._raf == null) el._raf = requestAnimationFrame(() => {});
    });
  }

  _despawn(el){
    if (!el) return;
    cancelAnimationFrame(el._raf);
    el.remove();
    this.pool.delete(el);
  }

  _rand(min, max){ return Math.random() * (max - min) + min; }
  _choose(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  _degToRad(d){ return d * Math.PI / 180; }

  _startPose(){
    const w = window.innerWidth, h = window.innerHeight;
    const edges = ['left','right','top','bottom'];
    const edge = this._choose(edges);
    const pad = 40;

    let x, y;
    if (edge === 'left'){ x = -pad; y = this._rand(60, h-60); }
    if (edge === 'right'){ x = w + pad; y = this._rand(60, h-60); }
    if (edge === 'top'){ x = this._rand(30, w-30); y = -pad; }
    if (edge === 'bottom'){ x = this._rand(30, w-30); y = h + pad; }

    return { x, y, from: edge };
  }

  _endPose(from){
    const w = window.innerWidth, h = window.innerHeight;
    const pad = 60;
    const options = {
      left:   { x: w + pad, y: this._rand(60, h-60) },
      right:  { x: -pad,   y: this._rand(60, h-60) },
      top:    { x: this._rand(30, w-30), y: h + pad },
      bottom: { x: this._rand(30, w-30), y: -pad }
    };
    return options[from];
  }

  _animate(el, type){
    const start = this._startPose();
    const end = this._endPose(start.from);

    // Control points for a smooth curve with some randomness
    const cp1 = { x: (start.x*0.7 + end.x*0.3) + this._rand(-120,120), y: (start.y*0.7 + end.y*0.3) + this._rand(-90,90) };
    const cp2 = { x: (start.x*0.3 + end.x*0.7) + this._rand(-120,120), y: (start.y*0.3 + end.y*0.7) + this._rand(-90,90) };

    const pathLength = Math.hypot(end.x-start.x, end.y-start.y) * 1.2;
    const pxPerSec = (type === 'cockroach') ? this.speed*1.5
                    : (type === 'moth') ? this.speed*1.1
                    : (type === 'caterpillar') ? this.speed*0.55
                    : this.speed;
    const duration = Math.max(3.5, Math.min(18, pathLength / pxPerSec));

    const t0 = performance.now();
    const ease = (t)=> t<.5 ? 2*t*t : -1+(4-2*t)*t; // quad in/out

    // Place immediately (no flash at bottom/last) + TOP-DOWN heading offset
    const initAng =
      Math.atan2(end.y - start.y, end.x - start.x) +
      this._degToRad(this.headingOffsetDeg[type] ?? 0);
    el.style.setProperty('--nx', start.x + 'px');
    el.style.setProperty('--ny', start.y + 'px');
    el.style.setProperty('--ang', initAng + 'rad');
    el.style.transform = `translate3d(${start.x}px, ${start.y}px, 0) rotate(${initAng}rad)`;

    const step = (now)=>{
      if (el._paused){ el._raf = requestAnimationFrame(step); return; }

      let t = Math.min(1, (now - t0) / (duration*1000));
      const tt = ease(t);

      // cubic bezier position along the path
      const x = (1-tt)**3*start.x + 3*(1-tt)**2*tt*cp1.x + 3*(1-tt)*tt**2*cp2.x + tt**3*end.x;
      const y = (1-tt)**3*start.y + 3*(1-tt)**2*tt*cp1.y + 3*(1-tt)*tt**2*cp2.y + tt**3*end.y;

      // TOP-DOWN species behaviors
      const wiggle = this.wiggle;
      // Cockroach: sharper jitter for scurry feel
      const wX_roach = (Math.sin(now/55)+Math.sin(now/37))*4;
      const wY_roach = (Math.cos(now/67)+Math.cos(now/41))*3;
      // Moth: soft meander
      const wX_moth  = Math.sin(now/95)*wiggle*0.9;
      const wY_moth  = Math.cos(now/120)*wiggle*0.9;
      // Caterpillar: gentler wiggle
      const wX_cat   = Math.sin(now/280)*6;
      const wY_cat   = Math.cos(now/280)*4;

      let wX = 0, wY = 0;
      if (type === 'cockroach'){ wX = wX_roach; wY = wY_roach; }
      else if (type === 'moth'){ wX = wX_moth;  wY = wY_moth;  }
      else if (type === 'caterpillar'){ wX = wX_cat; wY = wY_cat; }

      // Caterpillar inching (subtle stop-go pulse)
      let moveScale = 1;
      if (type === 'caterpillar'){
        const phase = (now % 1200) / 1200; // 1.2s loop
        moveScale = phase < 0.5 ? 0.75 : 1.25;
      }

      const nx = x + wX * moveScale;
      const ny = y + wY * moveScale;

      // rotation toward motion + TOP-DOWN heading offset
      const travelAng =
        Math.atan2(end.y - ny, end.x - nx) +
        this._degToRad(this.headingOffsetDeg[type] ?? 0);

      // expose to CSS for squash animation to reuse last pose
      el.style.setProperty('--nx', nx + 'px');
      el.style.setProperty('--ny', ny + 'px');
      el.style.setProperty('--ang', travelAng + 'rad');

      el.style.transform = `translate3d(${nx}px, ${ny}px, 0) rotate(${travelAng}rad)`;

      if (t >= 1){
        // loop: new path
        this._animate(el, type);
        return;
      }
      el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  _squash(el){
    if (!el || el._squashing) return;
    el._squashing = true;
    el._paused = true;                 // pause movement
    el.style.zIndex = '2147483647';    // ensure on top
    el.classList.add('squashing');

    // Add tiny splat at current center
    const rect = el.getBoundingClientRect();
    const splat = document.createElement('div');
    splat.className = 'gif-splat';
    splat.style.left = (rect.left + rect.width/2) + 'px';
    splat.style.top  = (rect.top  + rect.height/2) + 'px';
    document.body.appendChild(splat);

    setTimeout(()=>{ splat.remove(); this._despawn(el); }, 280);
  }
}

/* --------- Boot: spawn 5 bugs instantly on load --------- */
(function boot(){
  const start = ()=>{
    if (!window.gifOverlay) {
      window.gifOverlay = new GIFBugOverlay({ maxAtOnce: 12, speed: 120, wiggle: 16 });
    }
    const types = ['cockroach','moth','caterpillar'];
    for (let i=0; i<5; i++){
      const t = types[Math.floor(Math.random()*types.length)];
      // small stagger to avoid all spawning at the exact same ms
      setTimeout(()=> window.gifOverlay.spawn(t), i*120);
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Run ASAP if DOM is already ready
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();
