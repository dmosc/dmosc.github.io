(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shooters = [];
  const STAR_COUNT = 260;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function makeStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: randBetween(0.3, 1.6),
      alpha: randBetween(0.2, 1),
      speed: randBetween(0.003, 0.012),
      phase: Math.random() * Math.PI * 2,
    };
  }

  function makeShooter() {
    const angle = randBetween(0.1, 0.4);
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      vx: Math.cos(angle) * randBetween(6, 12),
      vy: Math.sin(angle) * randBetween(6, 12),
      len: randBetween(60, 140),
      alpha: 1,
      life: 1,
      decay: randBetween(0.012, 0.022),
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: STAR_COUNT }, makeStar);
    scheduleShooter();
  }

  function scheduleShooter() {
    setTimeout(function () {
      shooters.push(makeShooter());
      scheduleShooter();
    }, randBetween(2800, 6200));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle deep-space gradient
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.max(W, H) * 0.75);
    grad.addColorStop(0, 'rgba(14,20,40,0.55)');
    grad.addColorStop(1, 'rgba(6,10,16,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    t += 0.016;

    // stars
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,215,255,${a})`;
      ctx.fill();
    }

    // shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      s.alpha = s.life;
      if (s.life <= 0) { shooters.splice(i, 1); continue; }

      const tailX = s.x - s.vx / s.vx * s.len * Math.cos(Math.atan2(s.vy, s.vx));
      const tailY = s.y - s.vy / s.vy * s.len * Math.sin(Math.atan2(s.vy, s.vx));

      const lg = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      lg.addColorStop(0, `rgba(200,215,255,0)`);
      lg.addColorStop(1, `rgba(200,215,255,${s.alpha * 0.85})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();
