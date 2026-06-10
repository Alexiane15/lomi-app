/* ─────────────────────────────────────────────────
   orbs.js — Blobs électriques + liserets Lomi  (v5)
   Inspiré du moodboard : bleus profonds, centres
   blancs lumineux, fins liserets qui traversent
   ───────────────────────────────────────────────── */
(function () {

  /* ── Palette moodboard : bleu profond / électrique ── */
  var BLOB_COLORS = [
    /* centre blanc lumineux → bleu électrique → transparent */
    'radial-gradient(ellipse at 38% 38%, rgba(255,255,255,0.90) 0%, rgba(90,166,255,0.85) 18%, rgba(13,118,242,0.70) 38%, rgba(10,22,80,0.40) 65%, transparent 100%)',
    'radial-gradient(ellipse at 55% 45%, rgba(255,255,255,0.80) 0%, rgba(74,176,255,0.80) 20%, rgba(0,80,200,0.65) 42%, rgba(5,15,60,0.35) 68%, transparent 100%)',
    'radial-gradient(ellipse at 45% 55%, rgba(220,240,255,0.70) 0%, rgba(50,140,255,0.75) 22%, rgba(13,60,180,0.60) 45%, rgba(8,18,70,0.30) 70%, transparent 100%)',
    'radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.85) 0%, rgba(120,190,255,0.75) 15%, rgba(30,100,230,0.60) 35%, transparent 80%)',
    'radial-gradient(ellipse at 35% 60%, rgba(200,230,255,0.60) 0%, rgba(74,176,255,0.65) 25%, rgba(13,118,242,0.50) 50%, transparent 85%)',
  ];

  var SHAPES = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 40% 70% 30% 60%',
    '50% 50% 33% 67% / 55% 27% 73% 45%',
    '67% 33% 45% 55% / 30% 55% 45% 70%',
    '45% 55% 60% 40% / 70% 40% 60% 30%',
    '55% 45% 38% 62% / 48% 62% 38% 52%',
    '38% 62% 52% 48% / 65% 35% 55% 45%',
  ];

  var rand = function(a,b){ return a + Math.random()*(b-a); };
  var pick = function(arr){ return arr[Math.floor(Math.random()*arr.length)]; };
  var rnd  = function(n){ return Math.round(n); };

  /* ══════════════════════════════════════════
     GÉNÉRATION
  ══════════════════════════════════════════ */
  function init() {
    if (document.getElementById('lomi-orbs')) return;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var AX = W * 0.38;
    var AY = H * 0.38;

    var css = [
      /* Conteneur fixe */
      '#lomi-orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}',

      /* Blobs */
      '.lomi-orb{position:absolute;will-change:transform,border-radius;}',

      /* Liserets */
      '.lomi-streak{',
        'position:absolute;',
        'pointer-events:none;',
        'will-change:transform,opacity;',
        'border-radius:100px;',
      '}',

      /* Rend les couches de l'app transparentes */
      '.app{background:transparent !important}',
      '.screens-wrap{background:transparent !important}',
      '#screen-carnet,#screen-suivi{background:transparent !important}',
      '.screen{background:transparent !important}',
      '.nav{background:transparent!important;backdrop-filter:none;-webkit-backdrop-filter:none}',

      /* Fond body : bleu très sombre */
      'body{background:#080f2d !important}',
    ];

    var wrap = document.createElement('div');
    wrap.id  = 'lomi-orbs';

    /* ── 1. BLOBS organiques ── */
    var BLOB_COUNT = 5;
    for (var i = 0; i < BLOB_COUNT; i++) {
      var size = rand(200, 440);
      var sx   = rand(-size*0.2, W - size*0.8);
      var sy   = rand(-size*0.2, H - size*0.8);

      /* Waypoints */
      var pcts = [0,20,40,60,80,100];
      var pts  = [];
      var x0   = rnd(rand(-AX*0.5, AX*0.5));
      var y0   = rnd(rand(-AY*0.5, AY*0.5));
      pts.push([x0,y0]);
      for (var k=1; k<5; k++) pts.push([rnd(rand(-AX,AX)), rnd(rand(-AY,AY))]);
      pts.push([x0,y0]);

      var fDur = rand(70,120).toFixed(1);
      var mDur = rand(50,90).toFixed(1);
      var oDur = rand(40,75).toFixed(1);
      var fDel = rand(-parseFloat(fDur),0).toFixed(1);
      var mDel = rand(-parseFloat(mDur),0).toFixed(1);
      var oDel = rand(-parseFloat(oDur),0).toFixed(1);

      var kfName = 'bf'+i;
      var kf = '@keyframes '+kfName+'{';
      for (var k=0; k<=5; k++) {
        var sc = rand(0.90,1.15).toFixed(3);
        kf += pcts[k]+'%{transform:translate('+pts[k][0]+'px,'+pts[k][1]+'px) scale('+sc+')}';
      }
      kf += '}';

      var kmName = 'bm'+i;
      var km = '@keyframes '+kmName+'{0%,100%{border-radius:'+pick(SHAPES)+'}33%{border-radius:'+pick(SHAPES)+'}66%{border-radius:'+pick(SHAPES)+'}}';

      var koName = 'bo'+i;
      var opLo = rand(0.55,0.75).toFixed(2);
      var opHi = rand(0.85,1.00).toFixed(2);
      var ko = '@keyframes '+koName+'{0%,100%{opacity:'+opLo+'}50%{opacity:'+opHi+'}}';

      css.push(kf, km, ko);

      var orb = document.createElement('div');
      orb.className = 'lomi-orb';
      orb.style.cssText = [
        'width:'+rnd(size)+'px',
        'height:'+rnd(size*rand(0.75,1.1))+'px',
        'left:'+rnd(sx)+'px',
        'top:'+rnd(sy)+'px',
        'background:'+pick(BLOB_COLORS),
        'filter:blur(28px)',
        'border-radius:'+pick(SHAPES),
        'animation:'+
          kfName+' '+fDur+'s ease-in-out '+fDel+'s infinite,'+
          kmName+' '+mDur+'s ease-in-out '+mDel+'s infinite,'+
          koName+' '+oDur+'s ease-in-out '+oDel+'s infinite',
      ].join(';');

      wrap.appendChild(orb);
    }

    /* ── 2. LISERETS blancs ── */
    var STREAK_COUNT = 6;
    for (var j = 0; j < STREAK_COUNT; j++) {
      /* Longueur aléatoire, très fins */
      var len   = rand(80, 280);
      var thick = rand(0.6, 1.8);
      /* Angle entre -60° et +60° */
      var angle = rand(-60, 60);
      /* Position de départ hors écran à gauche ou en haut */
      var startX = rand(-len, W + len);
      var startY = rand(-len, H + len);
      /* Distance de traversée */
      var travX  = rnd(rand(W * 0.4, W * 1.2) * (Math.random() > 0.5 ? 1 : -1));
      var travY  = rnd(rand(H * 0.3, H * 0.8) * (Math.random() > 0.5 ? 1 : -1));

      var sDur = rand(35, 80).toFixed(1);
      var sDel = rand(-parseFloat(sDur), 0).toFixed(1);

      var skName = 'sk'+j;
      /* Opacité : apparaît, brille, disparaît */
      var sk = '@keyframes '+skName+'{'+
        '0%  {transform:translate(0,0);opacity:0}'+
        '10% {opacity:'+rand(0.6,1.0).toFixed(2)+'}'+
        '50% {transform:translate('+rnd(travX*0.5)+'px,'+rnd(travY*0.5)+'px);opacity:'+rand(0.3,0.7).toFixed(2)+'}'+
        '90% {opacity:0.1}'+
        '100%{transform:translate('+travX+'px,'+travY+'px);opacity:0}'+
      '}';
      css.push(sk);

      var streak = document.createElement('div');
      streak.className = 'lomi-streak';
      streak.style.cssText = [
        'width:'+rnd(len)+'px',
        'height:'+thick.toFixed(1)+'px',
        'left:'+rnd(startX)+'px',
        'top:' +rnd(startY)+'px',
        'transform:rotate('+angle.toFixed(1)+'deg)',
        'background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(200,230,255,0.6) 70%, transparent 100%)',
        'opacity:0',
        'animation:'+skName+' '+sDur+'s ease-in-out '+sDel+'s infinite',
      ].join(';');

      wrap.appendChild(streak);
    }

    /* ── Injection ── */
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
