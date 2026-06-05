/* ─────────────────────────────────────────────────
   orbs.js — Fond animé ambiant Lomi  (v2)
   Orbes en position:fixed sur body,
   les écrans deviennent transparents pour les laisser passer.
   ───────────────────────────────────────────────── */
(function () {

  /* ── Palette Lomi dark ── */
  var COLORS = [
    'rgba(90,  166, 255, 0.55)',   /* #5aa6ff bleu principal   */
    'rgba(74,  176, 255, 0.45)',   /* #4ab0ff bleu clair       */
    'rgba(13,  118, 242, 0.50)',   /* #0d76f2 bleu profond     */
    'rgba(26,  255, 170, 0.30)',   /* #1affaa vert accent      */
    'rgba(90,  166, 255, 0.40)',   /* bleu doux                */
    'rgba(181, 228, 246, 0.30)',   /* bleu glacier             */
  ];

  /* ── Config ── */
  var CFG = {
    count:      6,
    minSize:    250,
    maxSize:    520,
    blur:       110,
    moveRange:  0.20,
    floatMin:   14,
    floatMax:   28,
    fadeMin:    8,
    fadeMax:    18,
    opLo:       0.50,
    opHi:       1.00,
    scaleMin:   0.88,
    scaleMax:   1.18,
  };

  /* ── Utils ── */
  var rand = function(a,b){ return a + Math.random()*(b-a); };
  var pick = function(arr){ return arr[Math.floor(Math.random()*arr.length)]; };
  var px   = function(n){ return n.toFixed(1)+'px'; };

  /* ── Styles globaux (injectés une seule fois) ── */
  function injectStyles() {
    if (document.getElementById('lomi-orbs-style')) return;
    var s = document.createElement('style');
    s.id = 'lomi-orbs-style';
    s.textContent = [

      /* Conteneur fixed sur tout l'écran */
      '#lomi-orbs{',
        'position:fixed;inset:0;',
        'z-index:0;',
        'pointer-events:none;',
        'overflow:hidden;',
      '}',

      /* Chaque orbe */
      '.lomi-orb{',
        'position:absolute;',
        'border-radius:50%;',
        'will-change:transform,opacity;',
        'animation:lomi-float linear infinite,lomi-fade linear infinite;',
      '}',

      /* Rendre l'app et ses couches transparentes
         pour que les orbes passent à travers        */
      '.app{background:transparent !important}',
      '.screens-wrap{background:transparent !important}',
      '#screen-carnet,#screen-suivi{background:transparent !important}',
      '.screen{background:transparent !important}',
      '.nav{background:rgba(45,45,45,0.75) !important;',
        'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}',

      /* Keyframes */
      '@keyframes lomi-float{',
        '0%  {transform:translate(0,0)                       scale(1)       }',
        '25% {transform:translate(var(--tx1),var(--ty1))     scale(var(--s1))}',
        '50% {transform:translate(var(--tx2),var(--ty2))     scale(var(--s2))}',
        '75% {transform:translate(var(--tx1),var(--ty2))     scale(var(--s1))}',
        '100%{transform:translate(0,0)                       scale(1)       }',
      '}',
      '@keyframes lomi-fade{',
        '0%,100%{opacity:var(--op-lo)}',
        '50%    {opacity:var(--op-hi)}',
      '}',

    ].join('');
    document.head.appendChild(s);
  }

  /* ── Création des orbes ── */
  function buildOrbs() {
    if (document.getElementById('lomi-orbs')) return;

    var W = window.innerWidth;
    var H = window.innerHeight;

    var wrap = document.createElement('div');
    wrap.id = 'lomi-orbs';

    for (var i = 0; i < CFG.count; i++) {
      var size = rand(CFG.minSize, CFG.maxSize);
      var cx   = rand(-size*0.3, W - size*0.7);
      var cy   = rand(-size*0.3, H - size*0.7);
      var mx   = W * CFG.moveRange;
      var my   = H * CFG.moveRange;

      var tx1  = px(rand(-mx, mx));
      var ty1  = px(rand(-my, my));
      var tx2  = px(rand(-mx, mx));
      var ty2  = px(rand(-my, my));
      var s1   = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var s2   = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var opLo = rand(CFG.opLo, CFG.opHi - 0.15).toFixed(3);
      var opHi = Math.min(+opLo + rand(0.1, 0.3), CFG.opHi).toFixed(3);

      var fDur = rand(CFG.floatMin, CFG.floatMax).toFixed(1);
      var aDur = rand(CFG.fadeMin,  CFG.fadeMax).toFixed(1);
      var fDel = rand(-parseFloat(fDur), 0).toFixed(1);
      var aDel = rand(-parseFloat(aDur), 0).toFixed(1);

      var orb = document.createElement('div');
      orb.className = 'lomi-orb';
      orb.style.cssText = [
        'width:'  + px(size),
        'height:' + px(size),
        'left:'   + px(cx),
        'top:'    + px(cy),
        'background:' + pick(COLORS),
        'filter:blur(' + CFG.blur + 'px)',
        '--tx1:'+tx1,'--ty1:'+ty1,
        '--tx2:'+tx2,'--ty2:'+ty2,
        '--s1:' +s1, '--s2:' +s2,
        '--op-lo:'+opLo,'--op-hi:'+opHi,
        'animation-duration:'+fDur+'s,'+aDur+'s',
        'animation-delay:'  +fDel+'s,'+aDel+'s',
      ].join(';');

      wrap.appendChild(orb);
    }

    document.body.insertBefore(wrap, document.body.firstChild);
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    buildOrbs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
