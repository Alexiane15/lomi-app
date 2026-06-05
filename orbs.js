/* ─────────────────────────────────────────────────
   orbs.js — Blobs organiques animés Lomi  (v4)
   Keyframes uniques par blob avec vrais pixels
   ───────────────────────────────────────────────── */
(function () {

  var COLORS = [
    'rgba(90,  166, 255, 0.55)',
    'rgba(74,  176, 255, 0.48)',
    'rgba(13,  118, 242, 0.52)',
    'rgba(26,  255, 170, 0.32)',
    'rgba(90,  166, 255, 0.44)',
    'rgba(181, 228, 246, 0.36)',
  ];

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

  var CFG = {
    count:    6,
    minSize:  240,
    maxSize:  460,
    blur:     65,
  };

  var rand = function(a,b){ return a + Math.random()*(b-a); };
  var pick = function(arr){ return arr[Math.floor(Math.random()*arr.length)]; };
  var rnd  = function(n){ return Math.round(n); };

  function init() {
    if (document.getElementById('lomi-orbs')) return;

    var W = window.innerWidth;
    var H = window.innerHeight;
    /* Amplitude de mouvement : ~40% de la largeur/hauteur */
    var AX = W * 0.40;
    var AY = H * 0.40;

    var css = [
      '#lomi-orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}',
      '.lomi-orb{position:absolute;will-change:transform,border-radius;}',
      '.app{background:transparent !important}',
      '.screens-wrap{background:transparent !important}',
      '#screen-carnet,#screen-suivi{background:transparent !important}',
      '.screen{background:transparent !important}',
      '.nav{background:rgba(30,30,35,0.65)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}',
    ];

    var wrap = document.createElement('div');
    wrap.id  = 'lomi-orbs';

    for (var i = 0; i < CFG.count; i++) {
      var size = rand(CFG.minSize, CFG.maxSize);
      /* Position de départ centrée sur l'écran, décalée aléatoirement */
      var sx = rand(0, W - size);
      var sy = rand(0, H - size);

      /* 5 waypoints de déplacement différents (vrais pixels) */
      var kf = [];
      var pcts = [0, 20, 40, 60, 80, 100];
      var pts  = [];
      /* Point 0 et 100 identiques pour la boucle */
      var x0 = rnd(rand(-AX*0.5, AX*0.5));
      var y0 = rnd(rand(-AY*0.5, AY*0.5));
      pts.push([x0, y0]);
      for (var k = 1; k < 5; k++) {
        pts.push([rnd(rand(-AX, AX)), rnd(rand(-AY, AY))]);
      }
      pts.push([x0, y0]); /* ferme la boucle */

      /* Durées et forms uniques par blob */
      var fDur  = rand(12, 22).toFixed(1);  /* flottement */
      var mDur  = rand(8,  16).toFixed(1);  /* morph shape */
      var oDur  = rand(6,  14).toFixed(1);  /* opacité */
      var fDel  = rand(-parseFloat(fDur), 0).toFixed(1);
      var mDel  = rand(-parseFloat(mDur), 0).toFixed(1);
      var oDel  = rand(-parseFloat(oDur), 0).toFixed(1);
      var opLo  = rand(0.4, 0.7).toFixed(2);
      var opHi  = rand(0.8, 1.0).toFixed(2);

      /* Génère le @keyframes de float avec vraies valeurs */
      var kfName = 'lomi-f'+i;
      var kfStr  = '@keyframes '+kfName+'{';
      for (var k = 0; k <= 5; k++) {
        var sc = rand(0.88, 1.18).toFixed(3);
        kfStr += pcts[k]+'%{transform:translate('+pts[k][0]+'px,'+pts[k][1]+'px) scale('+sc+')}';
      }
      kfStr += '}';

      /* Génère le @keyframes de morph */
      var kmName = 'lomi-m'+i;
      var kmStr  = '@keyframes '+kmName+'{';
      var steps  = [0,25,50,75,100];
      for (var k = 0; k < steps.length; k++) {
        kmStr += steps[k]+'%{border-radius:'+pick(SHAPES)+'}';
      }
      kmStr += '}';

      /* Génère le @keyframes d'opacité */
      var koName = 'lomi-o'+i;
      var koStr  = '@keyframes '+koName+'{0%,100%{opacity:'+opLo+'}50%{opacity:'+opHi+'}}';

      css.push(kfStr, kmStr, koStr);

      /* Crée le div */
      var orb = document.createElement('div');
      orb.className = 'lomi-orb';
      orb.style.cssText = [
        'width:'+rnd(size)+'px',
        'height:'+rnd(size)+'px',
        'left:'+rnd(sx)+'px',
        'top:'+rnd(sy)+'px',
        'background:'+pick(COLORS),
        'filter:blur('+CFG.blur+'px)',
        'border-radius:'+pick(SHAPES),
        'animation:'+
          kfName+' '+fDur+'s ease-in-out '+fDel+'s infinite,'+
          kmName+' '+mDur+'s ease-in-out '+mDel+'s infinite,'+
          koName+' '+oDur+'s ease-in-out '+oDel+'s infinite',
      ].join(';');

      wrap.appendChild(orb);
    }

    /* Injecte les styles et le DOM */
    var style = document.createElement('style');
    style.id  = 'lomi-orbs-style';
    style.textContent = css.join('');
    document.head.appendChild(style);
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
