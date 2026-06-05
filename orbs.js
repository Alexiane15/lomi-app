/* ─────────────────────────────────────────────
   orbs.js — Fond animé ambiant Lomi
   Injecte automatiquement les orbes dans .app
   ───────────────────────────────────────────── */
(function () {

  /* ── Palette Lomi (fond sombre #2d2d2d) ── */
  var COLORS = [
    'rgba(90, 166, 255, 0.18)',   /* #5aa6ff — bleu principal  */
    'rgba(74, 176, 255, 0.14)',   /* #4ab0ff — bleu clair      */
    'rgba(13,  118, 242, 0.16)',  /* #0d76f2 — bleu profond    */
    'rgba(26, 255, 170, 0.10)',   /* #1affaa — vert accent     */
    'rgba(90, 166, 255, 0.12)',   /* bleu doux supplémentaire  */
    'rgba(181, 228, 246, 0.10)',  /* bleu glacier très doux    */
  ];

  /* ── Config ── */
  var CFG = {
    count:        6,
    minSize:      220,
    maxSize:      500,
    blur:         90,     /* px */
    moveRange:    0.18,   /* % de la fenêtre */
    floatMin:     16,
    floatMax:     30,
    fadeMin:      10,
    fadeMax:      20,
    opLo:         0.55,
    opHi:         0.95,
    scaleMin:     0.88,
    scaleMax:     1.18,
  };

  /* ── Utilitaires ── */
  function rand(a, b)  { return a + Math.random() * (b - a); }
  function pick(arr)   { return arr[Math.floor(Math.random() * arr.length)]; }
  function px(n)       { return n.toFixed(1) + 'px'; }

  /* ── Keyframes (injectés une seule fois) ── */
  function injectStyles() {
    if (document.getElementById('orbs-style')) return;
    var s = document.createElement('style');
    s.id = 'orbs-style';
    s.textContent = [
      '.lomi-orb{',
        'position:absolute;',
        'border-radius:50%;',
        'pointer-events:none;',
        'will-change:transform,opacity;',
        'animation:lomi-float linear infinite,lomi-fade linear infinite;',
      '}',
      '@keyframes lomi-float{',
        '0%  {transform:translate(0,0)           scale(1)}',
        '25% {transform:translate(var(--tx1),var(--ty1)) scale(var(--s1))}',
        '50% {transform:translate(var(--tx2),var(--ty2)) scale(var(--s2))}',
        '75% {transform:translate(var(--tx1),var(--ty2)) scale(var(--s1))}',
        '100%{transform:translate(0,0)           scale(1)}',
      '}',
      '@keyframes lomi-fade{',
        '0%,100%{opacity:var(--op-lo)}',
        '50%    {opacity:var(--op-hi)}',
      '}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Création du conteneur + orbes ── */
  function buildOrbs(target) {
    var W = target.offsetWidth  || window.innerWidth;
    var H = target.offsetHeight || window.innerHeight;

    var wrap = document.createElement('div');
    wrap.id = 'lomi-orbs';
    wrap.style.cssText = [
      'position:absolute',
      'inset:0',
      'z-index:0',
      'pointer-events:none',
      'overflow:hidden',
    ].join(';');

    for (var i = 0; i < CFG.count; i++) {
      var size = rand(CFG.minSize, CFG.maxSize);
      var cx   = rand(-size * 0.3, W - size * 0.7);
      var cy   = rand(-size * 0.3, H - size * 0.7);
      var mx   = W * CFG.moveRange;
      var my   = H * CFG.moveRange;

      var tx1 = px(rand(-mx, mx));
      var ty1 = px(rand(-my, my));
      var tx2 = px(rand(-mx, mx));
      var ty2 = px(rand(-my, my));
      var s1  = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var s2  = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var opLo = rand(CFG.opLo, CFG.opHi - 0.1).toFixed(3);
      var opHi = Math.min(+opLo + rand(0.05, 0.2), CFG.opHi).toFixed(3);

      var fDur = rand(CFG.floatMin, CFG.floatMax).toFixed(1);
      var aDur = rand(CFG.fadeMin,  CFG.fadeMax).toFixed(1);
      var fDel = (rand(0, -parseFloat(fDur))).toFixed(1);
      var aDel = (rand(0, -parseFloat(aDur))).toFixed(1);

      var orb = document.createElement('div');
      orb.className = 'lomi-orb';
      orb.style.cssText = [
        'width:'  + px(size),
        'height:' + px(size),
        'left:'   + px(cx),
        'top:'    + px(cy),
        'background:' + pick(COLORS),
        'filter:blur(' + CFG.blur + 'px)',
        '--tx1:' + tx1, '--ty1:' + ty1,
        '--tx2:' + tx2, '--ty2:' + ty2,
        '--s1:'  + s1,  '--s2:'  + s2,
        '--op-lo:' + opLo, '--op-hi:' + opHi,
        'animation-duration:' + fDur + 's,' + aDur + 's',
        'animation-delay:'    + fDel + 's,' + aDel + 's',
      ].join(';');

      wrap.appendChild(orb);
    }

    /* Insère en premier enfant de .app */
    target.insertBefore(wrap, target.firstChild);
  }

  /* ── Init après chargement du DOM ── */
  function init() {
    /* Évite les doublons si rechargement partiel */
    if (document.getElementById('lomi-orbs')) return;

    var app = document.querySelector('.app');
    if (!app) return;

    /* .app doit être en position relative ou absolute */
    var pos = getComputedStyle(app).position;
    if (pos === 'static') app.style.position = 'relative';

    injectStyles();
    buildOrbs(app);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
