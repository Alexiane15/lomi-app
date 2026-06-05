/* ─────────────────────────────────────────────────
   orbs.js — Formes organiques animées Lomi  (v3)
   Blobs amoïdes qui morphent + flottent en continu
   ───────────────────────────────────────────────── */
(function () {

  /* ── Palette Lomi dark ── */
  var COLORS = [
    'rgba(90,  166, 255, 0.50)',
    'rgba(74,  176, 255, 0.42)',
    'rgba(13,  118, 242, 0.45)',
    'rgba(26,  255, 170, 0.28)',
    'rgba(90,  166, 255, 0.38)',
    'rgba(181, 228, 246, 0.32)',
  ];

  /* ── Formes de border-radius organiques ──
     Format CSS : "a% b% c% d% / e% f% g% h%"
     Chaque set donne un aspect différent au blob  */
  var SHAPES = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 40% 70% 30% 60%',
    '50% 50% 33% 67% / 55% 27% 73% 45%',
    '33% 67% 55% 45% / 40% 60% 40% 60%',
    '67% 33% 45% 55% / 30% 55% 45% 70%',
    '45% 55% 60% 40% / 70% 40% 60% 30%',
    '55% 45% 38% 62% / 48% 62% 38% 52%',
    '38% 62% 52% 48% / 65% 35% 55% 45%',
  ];

  /* ── Config ── */
  var CFG = {
    count:     6,
    minSize:   220,
    maxSize:   480,
    blur:      70,
    moveRange: 0.18,
    morphMin:  8,
    morphMax:  18,
    floatMin:  16,
    floatMax:  32,
    fadeMin:   10,
    fadeMax:   22,
    opLo:      0.45,
    opHi:      1.00,
    scaleMin:  0.85,
    scaleMax:  1.20,
  };

  var rand = function(a,b){ return a + Math.random()*(b-a); };
  var pick = function(arr){ return arr[Math.floor(Math.random()*arr.length)]; };
  var px   = function(n){ return n.toFixed(1)+'px'; };

  /* ── Styles globaux ── */
  function injectStyles() {
    if (document.getElementById('lomi-orbs-style')) return;

    /* On génère les @keyframes de morph dynamiquement
       pour que chaque blob ait son propre chemin de déformation */
    var morphKF = '';
    for (var i = 0; i < CFG.count; i++) {
      var s0 = pick(SHAPES), s1 = pick(SHAPES), s2 = pick(SHAPES), s3 = pick(SHAPES);
      morphKF += [
        '@keyframes lomi-morph-'+i+'{',
          '0%  {border-radius:'+s0+'}',
          '25% {border-radius:'+s1+'}',
          '50% {border-radius:'+s2+'}',
          '75% {border-radius:'+s3+'}',
          '100%{border-radius:'+s0+'}',
        '}',
      ].join('');
    }

    var s = document.createElement('style');
    s.id = 'lomi-orbs-style';
    s.textContent = [

      '#lomi-orbs{',
        'position:fixed;inset:0;',
        'z-index:0;',
        'pointer-events:none;',
        'overflow:hidden;',
      '}',

      '.lomi-orb{',
        'position:absolute;',
        'will-change:transform,opacity,border-radius;',
      '}',

      /* Rend les couches de l'app transparentes */
      '.app{background:transparent !important}',
      '.screens-wrap{background:transparent !important}',
      '#screen-carnet,#screen-suivi{background:transparent !important}',
      '.screen{background:transparent !important}',
      '.nav{',
        'background:rgba(30,30,35,0.60) !important;',
        'backdrop-filter:blur(14px);',
        '-webkit-backdrop-filter:blur(14px);',
      '}',

      /* Keyframes flottement */
      '@keyframes lomi-float{',
        '0%  {transform:translate(0,0)                    scale(1)        }',
        '25% {transform:translate(var(--tx1),var(--ty1))  scale(var(--s1))}',
        '50% {transform:translate(var(--tx2),var(--ty2))  scale(var(--s2))}',
        '75% {transform:translate(var(--tx1),var(--ty2))  scale(var(--s1))}',
        '100%{transform:translate(0,0)                    scale(1)        }',
      '}',

      /* Keyframes opacité */
      '@keyframes lomi-fade{',
        '0%,100%{opacity:var(--op-lo)}',
        '50%    {opacity:var(--op-hi)}',
      '}',

      morphKF,

    ].join('');
    document.head.appendChild(s);
  }

  /* ── Création des blobs ── */
  function buildOrbs() {
    if (document.getElementById('lomi-orbs')) return;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var wrap = document.createElement('div');
    wrap.id = 'lomi-orbs';

    for (var i = 0; i < CFG.count; i++) {
      var size = rand(CFG.minSize, CFG.maxSize);
      var cx   = rand(-size*0.25, W - size*0.75);
      var cy   = rand(-size*0.25, H - size*0.75);
      var mx   = W * CFG.moveRange;
      var my   = H * CFG.moveRange;

      var tx1  = px(rand(-mx, mx));
      var ty1  = px(rand(-my, my));
      var tx2  = px(rand(-mx, mx));
      var ty2  = px(rand(-my, my));
      var s1   = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var s2   = rand(CFG.scaleMin, CFG.scaleMax).toFixed(3);
      var opLo = rand(CFG.opLo, CFG.opHi - 0.2).toFixed(3);
      var opHi = Math.min(+opLo + rand(0.15, 0.35), CFG.opHi).toFixed(3);

      var fDur  = rand(CFG.floatMin, CFG.floatMax).toFixed(1);
      var aDur  = rand(CFG.fadeMin,  CFG.fadeMax).toFixed(1);
      var mDur  = rand(CFG.morphMin, CFG.morphMax).toFixed(1);
      var fDel  = rand(-parseFloat(fDur), 0).toFixed(1);
      var aDel  = rand(-parseFloat(aDur), 0).toFixed(1);
      var mDel  = rand(-parseFloat(mDur), 0).toFixed(1);

      var orb = document.createElement('div');
      orb.className = 'lomi-orb';
      orb.style.cssText = [
        'width:'  + px(size),
        'height:' + px(size),
        'left:'   + px(cx),
        'top:'    + px(cy),
        'background:' + pick(COLORS),
        'filter:blur(' + CFG.blur + 'px)',
        'border-radius:' + pick(SHAPES),
        '--tx1:'+tx1,'--ty1:'+ty1,
        '--tx2:'+tx2,'--ty2:'+ty2,
        '--s1:' +s1, '--s2:' +s2,
        '--op-lo:'+opLo,'--op-hi:'+opHi,
        /* 3 animations indépendantes : float + fade + morph */
        'animation:lomi-float '+fDur+'s linear '+fDel+'s infinite,'+
                   'lomi-fade ' +aDur+'s linear '+aDel+'s infinite,'+
                   'lomi-morph-'+i+' '+mDur+'s ease-in-out '+mDel+'s infinite',
      ].join(';');

      wrap.appendChild(orb);
    }

    document.body.insertBefore(wrap, document.body.firstChild);
  }

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
