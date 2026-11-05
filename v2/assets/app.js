/* ═══════════════════════════════════════════════════════════════
   RACINES & RÉSONANCES — v2 · MOTEUR
   1. Outils          5. Pages intérieures
   2. Son (Web Audio) 6. Réservation (tiroir)
   3. Animations      7. Carte cadeau
   4. Accueil         8. Routeur & démarrage
═══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ═══ 1. OUTILS ═══════════════════════════════════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euros = n => n == null ? 'Sur devis' : (Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')) + ' €';
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dateDe = s => { const [y, m, j] = s.split('-').map(Number); return new Date(y, m - 1, j); };
const fmt = (d, o) => new Intl.DateTimeFormat('fr-FR', o).format(typeof d === 'string' ? dateDe(d) : d);
const dateLongue = d => fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const heure = h => h.replace(':', ' h ').replace(' h 00', ' h');
const attendre = ms => new Promise(r => setTimeout(r, ms));
const aujourdhui = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const img = n => `media/${n}.webp`;
// Icônes « sceau » : un seul fichier (assets/icones.svg), couleur héritée du texte (var(--el))
const ico = (id, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="assets/icones.svg#${id}"/></svg>`;
const ICO_INFO = { 'Durée': 'duree', 'Tarif': 'tarif', 'Lieu': 'lieu', 'Pour': 'groupe', 'Groupe': 'groupe', 'Horaires': 'horaire', 'Date': 'calendrier', 'Cadre': 'lieu' };
const modeMaquette = () => /VOTRE_ID/.test(CONFIG.formEndpoint);

// Événements : un événement avec `ref` hérite du contenu de l'événement de référence.
const EVTS = EVENEMENTS.map(e => e.ref ? { ...EVENEMENTS.find(x => x.id === e.ref), ...e } : e)
  .sort((a, b) => a.date.localeCompare(b.date));
const evtsAVenir = () => EVTS.filter(e => dateDe(e.date) >= aujourdhui());
const presta = id => PRESTATIONS.find(p => p.id === id);

async function envoyer(donnees) {
  if (modeMaquette()) { await attendre(1100); return { demo: true }; }
  const r = await fetch(CONFIG.formEndpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...donnees, _replyto: donnees.email, _subject: `Racines & Résonances — ${donnees.objet}` })
  });
  if (!r.ok) throw new Error('envoi');
  return { demo: false };
}

/* ═══ 2. SON — tout est synthétisé, rien n'est téléchargé ══════
   Bol : partiels inharmoniques (≈ 1 : 2,7 : 5,4 : 8,9) doublés
   d'un léger désaccord, ce qui produit le battement typique.
   Gong : spectre plus dense, attaque qui gonfle.
   Tambour : sinus grave qui chute + souffle de peau filtré.     */
const Son = {
  ctx: null, sortie: null, salle: null, sec: null, ambiance: null, boucle: null,
  pret() {
    if (!this.ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      const c = this.ctx = new C();
      this.sortie = c.createGain(); this.sortie.gain.value = .85;
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
      this.sortie.connect(comp).connect(c.destination);
      this.salle = this.reverb(4.2);
      const humide = c.createGain(); humide.gain.value = .5;
      this.salle.connect(humide).connect(this.sortie);
      this.sec = c.createGain(); this.sec.connect(this.sortie);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  },
  reverb(s) {
    const c = this.ctx, n = Math.floor(c.sampleRate * s), b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.8); }
    const v = c.createConvolver(); v.buffer = b; return v;
  },
  bus(vol = 1, humide = .7) {
    const g = this.ctx.createGain(); g.gain.value = vol;
    const s = this.ctx.createGain(); s.gain.value = 1 - humide * .5; g.connect(s).connect(this.sec);
    const h = this.ctx.createGain(); h.gain.value = humide; g.connect(h).connect(this.salle);
    return g;
  },
  partiel(dest, f, amp, attaque, duree, t) {
    const c = this.ctx;
    [1, 1.0032].forEach((dt, k) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f * dt;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp * (k ? .7 : 1), t + attaque);
      g.gain.exponentialRampToValueAtTime(.0001, t + duree);
      o.connect(g).connect(dest); o.start(t); o.stop(t + duree + .1);
    });
  },
  bol(f = 196, force = 1) {
    if (!this.pret()) return;
    const t = this.ctx.currentTime + .01, d = this.bus(.9, .65);
    [[1, .2, 9], [2.71, .085, 6.5], [5.4, .04, 4.2], [8.93, .018, 2.6]]
      .forEach(([r, a, dur]) => this.partiel(d, f * r, a * force, .006, dur, t));
  },
  gong(force = 1) {
    if (!this.pret()) return;
    const c = this.ctx, t = c.currentTime + .01, d = this.bus(.9, .8);
    [[1, .16, 10], [1.47, .09, 8], [2.09, .08, 7], [2.56, .05, 6], [3.14, .045, 5], [4.18, .03, 4], [5.43, .02, 3]]
      .forEach(([r, a, dur], i) => this.partiel(d, 98 * r, a * force, .02 + i * .03, dur, t));
    // frottement de la mailloche
    const n = this.bruit(.25), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .8;
    g.gain.setValueAtTime(.12 * force, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25);
    n.connect(f).connect(g).connect(d); n.start(t);
  },
  tambour(t, accent = false) {
    const c = this.ctx, d = this.bus(accent ? 1 : .75, .35);
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(accent ? 92 : 84, t); o.frequency.exponentialRampToValueAtTime(46, t + .28);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.85, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .6);
    o.connect(g).connect(d); o.start(t); o.stop(t + .65);
    const n = this.bruit(.15), f = c.createBiquadFilter(), gn = c.createGain();
    f.type = 'lowpass'; f.frequency.value = 650;
    gn.gain.setValueAtTime(.35, t); gn.gain.exponentialRampToValueAtTime(.0001, t + .12);
    n.connect(f).connect(gn).connect(d); n.start(t);
  },
  bruit(s, brun = false) {
    const c = this.ctx, n = Math.floor(c.sampleRate * s), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0);
    let dernier = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brun) { dernier = (dernier + .02 * w) / 1.02; x[i] = dernier * 3.5; } else x[i] = w; }
    const src = c.createBufferSource(); src.buffer = b; return src;
  },
  // Tambour chamanique : battement régulier ≈ 3,5 coups/s, un accent sur quatre.
  tambourOn() {
    if (!this.pret() || this.boucle) return;
    let prochain = this.ctx.currentTime + .05, n = 0;
    const pas = 60 / 210;
    this.boucle = setInterval(() => {
      while (prochain < this.ctx.currentTime + .12) { this.tambour(prochain, n % 4 === 0); prochain += pas; n++; }
    }, 25);
  },
  tambourOff() { clearInterval(this.boucle); this.boucle = null; },
  // Ambiance : bourdon grave, souffle de vent, un bol de temps en temps.
  ambianceOn() {
    if (!this.pret() || this.ambiance) return;
    const c = this.ctx, t = c.currentTime, maitre = c.createGain();
    maitre.gain.setValueAtTime(0, t); maitre.gain.linearRampToValueAtTime(1, t + 4);
    maitre.connect(this.sec); maitre.connect(this.salle);
    const sources = [];
    [[55, .05], [82.4, .035], [110, .025], [164.8, .012]].forEach(([f, a], i) => {
      const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.frequency.value = f; g.gain.value = a;
      lfo.frequency.value = .05 + i * .03; lg.gain.value = a * .6;
      lfo.connect(lg).connect(g.gain); o.connect(g).connect(maitre);
      o.start(); lfo.start(); sources.push(o, lfo);
    });
    const vent = this.bruit(8, true), fv = c.createBiquadFilter(), gv = c.createGain(), lv = c.createOscillator(), lvg = c.createGain();
    vent.loop = true; fv.type = 'lowpass'; fv.frequency.value = 420; gv.gain.value = .05;
    lv.frequency.value = .07; lvg.gain.value = 250; lv.connect(lvg).connect(fv.frequency);
    vent.connect(fv).connect(gv).connect(maitre); vent.start(); lv.start(); sources.push(vent, lv);
    const gamme = [196, 220, 261.63, 293.66, 329.63, 392];
    const bols = () => { this.bol(gamme[Math.floor(Math.random() * gamme.length)], .32); Champ.pulse(.5); this.minuteur = setTimeout(bols, 9000 + Math.random() * 9000); };
    this.minuteur = setTimeout(bols, 2500);
    this.ambiance = { maitre, sources };
  },
  ambianceOff() {
    if (!this.ambiance) return;
    clearTimeout(this.minuteur);
    const { maitre, sources } = this.ambiance, t = this.ctx.currentTime;
    maitre.gain.cancelScheduledValues(t); maitre.gain.setValueAtTime(maitre.gain.value, t); maitre.gain.linearRampToValueAtTime(0, t + 1.5);
    setTimeout(() => sources.forEach(s => { try { s.stop(); } catch (e) {} }), 1700);
    this.ambiance = null;
  }
};

function basculerAmbiance(force) {
  const b = $('#btn-son'), on = force ?? b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', on);
  on ? Son.ambianceOn() : Son.ambianceOff();
  try { localStorage.setItem('rr-son', on ? '1' : '0'); } catch (e) {}
}

/* ═══ 3. ANIMATIONS ════════════════════════════════════════════ */

// Champ de résonance du héros : ondes concentriques et spores dorées.
const Champ = {
  cv: null, c: null, ondes: [], spores: [], vis: true, px: 0, py: 0, raf: 0, dernier: 0,
  monter(cv) {
    this.cv = cv; this.c = cv.getContext('2d'); this.ondes = [];
    const n = innerWidth < 700 ? 40 : 80;
    this.spores = Array.from({ length: n }, () => this.spore(true));
    this.taille(); addEventListener('resize', () => this.taille());
    new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; }).observe(cv);
    cv.parentElement.addEventListener('pointermove', e => { this.px = e.clientX / innerWidth - .5; this.py = e.clientY / innerHeight - .5; });
    cancelAnimationFrame(this.raf);
    if (calme) { this.dessiner(0, true); return; }
    const boucle = t => { this.raf = requestAnimationFrame(boucle); if (this.vis && document.contains(cv)) this.dessiner(t); };
    this.raf = requestAnimationFrame(boucle);
  },
  spore(partout) { return { x: Math.random(), y: partout ? Math.random() : 1.05, r: .6 + Math.random() * 1.8, v: .00004 + Math.random() * .00012, d: (Math.random() - .5) * .00005, ph: Math.random() * 6.28 }; },
  taille() {
    if (!this.cv) return;
    const r = devicePixelRatio > 1 ? 2 : 1, b = this.cv.getBoundingClientRect();
    this.cv.width = b.width * r; this.cv.height = b.height * r; this.c.setTransform(r, 0, 0, r, 0, 0);
    this.w = b.width; this.h = b.height;
  },
  pulse(f = 1) { this.ondes.push({ r: 10, a: .55 * f, v: .11 + f * .05, w: 1 + f }); },
  dessiner(t, fixe) {
    const { c, w, h } = this, dt = Math.min(50, t - (this.dernier || t)); this.dernier = t;
    c.clearRect(0, 0, w, h);
    const cx = w / 2 + this.px * 30, cy = h * .56 + this.py * 20;
    if (!fixe && (!this.prochaine || t > this.prochaine)) { this.pulse(.45); this.prochaine = t + 2800; }
    if (fixe) [120, 220, 340, 480].forEach((r, i) => this.ondes.push({ r, a: .25 - i * .05, v: 0, w: 1 }));
    this.ondes = this.ondes.filter(o => o.a > .01);
    for (const o of this.ondes) {
      o.r += o.v * dt; o.a *= Math.pow(.9965, dt / 4);
      c.beginPath(); c.ellipse(cx, cy, o.r, o.r * .42, 0, 0, Math.PI * 2);
      c.strokeStyle = `rgba(217,174,74,${o.a})`; c.lineWidth = o.w; c.stroke();
    }
    for (const s of this.spores) {
      s.y -= s.v * dt; s.x += s.d * dt + Math.sin(t / 2000 + s.ph) * .00008;
      if (s.y < -.05) Object.assign(s, this.spore(false));
      const a = .25 + .35 * Math.sin(t / 700 + s.ph);
      c.beginPath(); c.arc(s.x * w + this.px * 40 * s.r, s.y * h, s.r, 0, 6.29);
      c.fillStyle = `rgba(239,220,170,${Math.max(0, a)})`; c.fill();
    }
  }
};

// Racines : générées à chaque visite (graine aléatoire), dessinées au défilement.
function racines(svg) {
  const W = 1000, H = 1000, chemins = [];
  let graine = Math.floor(Math.random() * 1e6);
  const alea = () => (graine = (graine * 16807) % 2147483647) / 2147483647;
  const pousser = (x, y, angle, long, ep, prof) => {
    const pts = [[x, y]]; let a = angle;
    const n = 8 + Math.floor(alea() * 6), pas = long / n;
    for (let i = 0; i < n; i++) { a += (alea() - .5) * .5; x += Math.cos(a) * pas; y += Math.sin(a) * pas; pts.push([x, y]); }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
    chemins.push({ d, ep, prof });
    if (prof < 4) {
      const enfants = 1 + Math.floor(alea() * 2.2);
      for (let k = 0; k < enfants; k++) {
        const j = 2 + Math.floor(alea() * (pts.length - 3));
        pousser(pts[j][0], pts[j][1], a + (alea() - .5) * 1.6, long * (.45 + alea() * .25), ep * .6, prof + 1);
      }
    }
  };
  for (let i = 0; i < 7; i++) pousser(140 + i * 120 + (alea() - .5) * 60, -10, Math.PI / 2 + (alea() - .5) * .5, 420 + alea() * 280, 3.2, 0);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = chemins.map(c => `<path d="${c.d}" pathLength="1" stroke-width="${c.ep.toFixed(2)}" stroke-dasharray="1" stroke-dashoffset="1" data-prof="${c.prof}"/>`).join('');
  return $$('path', svg);
}

// Apparitions au défilement
let obs;
function apparitions(racine = document) {
  obs?.disconnect();
  obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); obs.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv:not(.vu), .mots:not(.vu)', racine).forEach(el => obs.observe(el));
}
function decouperMots(racine) {
  $$('[data-mots]', racine).forEach(el => {
    let i = 0;
    const tr = n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(m => {
          if (!m) return;
          if (/^\s+$/.test(m)) { f.append(m); return; }
          const s = document.createElement('span'); s.className = 'm'; s.textContent = m;
          s.style.transitionDelay = (i++ * .09) + 's'; f.append(s);
        });
        n.replaceWith(f);
      } else [...n.childNodes].forEach(tr);
    };
    [...el.childNodes].forEach(tr);
  });
}

// Tâches liées au défilement (une seule boucle pour tout le site)
let defileurs = [];
function auDefilement() {
  const y = scrollY, vh = innerHeight;
  $('#nav').classList.toggle('plein', y > 40 || location.hash.replace(/^#\/?/, '') !== '');
  $('#barre-mobile').classList.toggle('vis', y > vh * .7);
  defileurs.forEach(f => f(y, vh));
}
let tic = false;
addEventListener('scroll', () => { if (!tic) { tic = true; requestAnimationFrame(() => { auDefilement(); tic = false; }); } }, { passive: true });
addEventListener('resize', auDefilement);

function parallaxe(racine) {
  if (calme) return;
  const els = $$('[data-px]', racine);
  defileurs.push((y, vh) => els.forEach(el => {
    const b = el.getBoundingClientRect(); if (b.bottom < -200 || b.top > vh + 200) return;
    el.style.transform = `translate3d(0,${((b.top + b.height / 2 - vh / 2) * parseFloat(el.dataset.px)).toFixed(1)}px,0)`;
  }));
}

function deroules(racine) {
  $$('.deroule', racine).forEach(dr => {
    const fil = $('.fil', dr), etapes = $$('.etape', dr);
    defileurs.push((y, vh) => {
      const b = dr.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .65 - b.top) / b.height));
      fil.style.setProperty('--p', (p * 100) + '%');
      etapes.forEach(e => e.classList.toggle('on', e.getBoundingClientRect().top < vh * .65));
    });
  });
}

function ondeClic(e) {
  if (calme || !e.target.closest('[data-onde]') || e.target.closest('input,textarea,select,.tiroir')) return;
  const o = document.createElement('span'); o.className = 'clic-onde';
  o.style.left = e.clientX + 'px'; o.style.top = e.clientY + 'px';
  document.body.append(o); setTimeout(() => o.remove(), 950);
}

function inclinaison(racine) {
  if (calme) return;
  $$('[data-tilt]', racine).forEach(c => {
    c.addEventListener('pointermove', e => {
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; c.style.setProperty('--reflet', `${x * 120}%`);
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; c.style.setProperty('--reflet', '-30%'); });
  });
}

function braises(racine) {
  $$('[data-braises]', racine).forEach(m => {
    m.innerHTML = Array.from({ length: 16 }, () => `<i style="left:${Math.random() * 100}%;--dx:${(Math.random() - .5) * 80}px;animation-duration:${5 + Math.random() * 6}s;animation-delay:${-Math.random() * 10}s"></i>`).join('');
  });
  // Terre : trois systèmes de racines qui poussent depuis le haut, en décalé
  $$('.motif-terre', racine).forEach(m => {
    const chemins = [];
    const pousser = (x, y, a, long, ep, prof, retard) => {
      const pts = [[x, y]], n = 7;
      for (let i = 0; i < n; i++) { a += (Math.random() - .5) * .55; x += Math.cos(a) * long / n; y += Math.sin(a) * long / n; pts.push([x, y]); }
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length - 1; i++) d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${((pts[i][0] + pts[i + 1][0]) / 2).toFixed(1)} ${((pts[i][1] + pts[i + 1][1]) / 2).toFixed(1)}`;
      chemins.push(`<path d="${d}" pathLength="1" stroke-width="${ep.toFixed(2)}" style="animation-delay:${(retard + prof * .7).toFixed(2)}s"/>`);
      if (prof < 3) for (let k = 0; k < 2; k++) { const j = 2 + Math.floor(Math.random() * 4); pousser(pts[j][0], pts[j][1], a + (Math.random() - .5) * 1.5, long * .55, ep * .62, prof + 1, retard); }
    };
    [[60, 0], [100, -3.3], [140, -6.6]].forEach(([x, r]) => pousser(x + (Math.random() - .5) * 20, -4, Math.PI / 2 + (Math.random() - .5) * .5, 170 + Math.random() * 60, 1.8, 0, r));
    m.innerHTML = `<svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${chemins.join('')}</svg>`;
  });
  // Souffle : rafales (traits qui filent et s'enroulent) et plumes emportées
  $$('.motif-air', racine).forEach(m => {
    const rafales = Array.from({ length: 7 }, (_, k) => {
      const y = 40 + k * 46 + Math.random() * 20, h = 10 + Math.random() * 14;
      return `<path class="rafale" pathLength="1" d="M-40 ${y} C 40 ${y - h}, 110 ${y + h}, 180 ${y} S 260 ${y - h} 300 ${y - 4} c 18 -3 24 -20 10 -26 c -10 -4 -18 6 -11 12" style="animation-duration:${6 + Math.random() * 3.5}s;animation-delay:${-Math.random() * 9}s"/>`;
    }).join('');
    const plume = '<svg viewBox="0 0 48 48"><path d="M39 7C23 9 13 21 12.6 35.4L8 41"/><path d="M39 7c-1.8 14.6-12 24.6-26.4 28.4"/><path d="M17.4 30.4l7.2-.8M21.4 24.2l8-1M25.6 18.2l7.8-1.2"/></svg>';
    const plumes = [0, 1, 2].map(k => `<span class="plume-vol" style="top:${18 + k * 24}%;animation-duration:${15 + k * 3.5}s;animation-delay:${-k * 6}s">${plume}</span>`).join('');
    m.innerHTML = `<svg class="vent" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">${rafales}</svg>${plumes}`;
    const maj = () => m.style.setProperty('--w', m.offsetWidth + 'px'); maj(); addEventListener('resize', maj);
  });
}

/* ═══ 4. ACCUEIL ═══════════════════════════════════════════════ */
function ligneEvt(e) {
  const t = TYPES_EVENEMENT[e.type];
  return `<a class="evt" data-el="${e.element}" href="#/stage/${e.id}">
    <div class="evt-date"><b>${fmt(e.date, { day: '2-digit' })}</b><span>${fmt(e.date, { month: 'short' }).replace('.', '')} · ${fmt(e.date, { weekday: 'short' }).replace('.', '')}</span></div>
    ${ico(e.icone || t.icone, 'evt-ico')}
    <div><div class="evt-type">${t.nom}</div><h3>${esc(e.titre)}</h3><div class="meta">${esc(e.sousTitre)} · ${heure(e.debut)} – ${heure(e.fin)}</div></div>
    <div class="evt-prix">${euros(e.prix)}<br><span class="lien">Réserver →</span></div>
  </a>`;
}

function temoignages() {
  return TEMOIGNAGES.map((t, i) => `<figure class="temoin rv${t.exemple ? ' exemple' : ''}" data-d="${i + 1}">
    ${t.exemple ? '<span class="etiquette">à recueillir</span>' : ''}
    <blockquote>« ${esc(t.texte)} »</blockquote><figcaption>${esc(t.auteur)} · ${esc(t.soin)}</figcaption></figure>`).join('');
}

function quiz(el) {
  const score = { eau: 0, feu: 0, terre: 0, air: 0 };
  let i = 0;
  const prog = () => `<div class="quiz-prog">${QUIZ.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>`;
  const etape = () => {
    if (i === 0) Object.keys(score).forEach(k => score[k] = 0);
    const q = QUIZ[i];
    el.innerHTML = `<div class="quiz-etape on">
      <span class="lbl" style="justify-content:center">Orientation · ${i + 1} / ${QUIZ.length}</span>${prog()}
      <h2 class="quiz-q">${i === 0 ? 'Quel soin <em style="color:var(--or)">pour vous</em>, maintenant ?<br><span style="font-size:.55em;color:var(--lin-2)">' + q.q + '</span>' : q.q}</h2>
      <div class="quiz-r">${q.r.map((r, k) => `<button data-k="${k}">${esc(r[0])}</button>`).join('')}</div></div>`;
    $$('button', el).forEach(b => b.onclick = () => {
      Object.entries(q.r[b.dataset.k][1]).forEach(([k, v]) => score[k] += v);
      Son.ctx && Son.bol([261.63, 293.66, 329.63][i], .25);
      i++; i < QUIZ.length ? etape() : resultat();
    });
  };
  const resultat = () => {
    const el2 = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0], r = QUIZ_RESULTATS[el2];
    el.innerHTML = `<div class="quiz-etape on"><div class="quiz-res" data-el="${el2}">
      ${ico(el2 === 'air' ? 'souffle' : el2, 'quiz-ico')}
      <span class="lbl" style="justify-content:center">Votre porte · ${ELEMENTS[el2].nom}</span>
      <h3>${r.titre}</h3><p>${r.texte}</p>
      <div class="ctas">${r.resa ? `<button class="btn btn-el" data-resa="${r.resa}">Réserver</button>` : ''}
      <a class="btn ${r.resa ? 'btn-ghost' : 'btn-el'}" href="#/${r.lien}">En savoir plus</a>
      <button class="btn btn-ghost" data-recommencer>Recommencer</button></div></div></div>`;
    $('[data-recommencer]', el).onclick = () => { i = 0; etape(); };
  };
  etape();
}

function pageAccueil() {
  const f = $('#tpl-accueil').content.cloneNode(true);
  const wrap = document.createElement('div'); wrap.append(f);
  $('#agenda-accueil', wrap).innerHTML = evtsAVenir().slice(0, 4).map(ligneEvt).join('');
  $('#temoins', wrap).innerHTML = temoignages();
  return wrap;
}
function apresAccueil(r) {
  Champ.monter($('#champ', r));
  // manifeste + racines
  const seuil = $('#seuil', r), lignes = $$('.ligne', seuil), chemins = racines($('#racines', r));
  defileurs.push((y, vh) => {
    const b = seuil.getBoundingClientRect(), p = Math.min(1, Math.max(0, -b.top / (b.height - vh)));
    lignes.forEach((l, k) => l.classList.toggle('on', calme || p > k / lignes.length * .85 + .02));
    chemins.forEach(c => { const pr = +c.dataset.prof; c.style.strokeDashoffset = calme ? 0 : Math.max(0, 1 - (p * 1.6 - pr * .18)); });
  });
  quiz($('#quiz', r));
  // gong
  const gong = $('#gong', r);
  gong.addEventListener('click', () => {
    Son.gong(1); Champ.pulse(1);
    gong.classList.remove('frappe'); void gong.offsetWidth; gong.classList.add('frappe');
    const o = document.createElement('span'); o.className = 'gong-onde'; gong.parentElement.append(o); setTimeout(() => o.remove(), 3300);
  });
  // tambour
  const bt = $('#btn-tambour', r), sect = $('#tambour', r);
  const stop = () => { Son.tambourOff(); bt.setAttribute('aria-pressed', 'false'); bt.textContent = 'Écouter le tambour'; };
  bt.onclick = () => {
    if (bt.getAttribute('aria-pressed') === 'true') return stop();
    Son.tambourOn(); bt.setAttribute('aria-pressed', 'true'); bt.textContent = 'Arrêter le tambour';
  };
  new IntersectionObserver(([e]) => { sect.classList.toggle('au-repos', !e.isIntersecting); if (!e.isIntersecting && bt.getAttribute('aria-pressed') === 'true') stop(); }, { threshold: .15 }).observe(sect);
  // entrée en écoute
  $('[data-son-entree]', r).onclick = () => { basculerAmbiance(true); Son.bol(196, .8); Champ.pulse(1.2); };
}

/* ═══ 5. PAGES INTÉRIEURES ═════════════════════════════════════ */
const heros = ({ el, fond, lbl, titre, chapo, infos = [], ctas = '' }) => `
  <section class="page-heros" data-el="${el}" data-onde>
    <div class="fond" style="background-image:url(${img(fond)})" data-px=".18"></div>
    <div class="wrap">
      <span class="lbl rv">${lbl}</span>
      <h1 class="mots" data-mots>${titre}</h1>
      ${chapo ? `<p class="chapo rv" data-d="2">${chapo}</p>` : ''}
      ${infos.length ? `<div class="infos rv" data-d="3">${infos.map(([k, v]) => `<div class="info">${ICO_INFO[k] ? ico(ICO_INFO[k]) : ''}<div><b>${k}</b>${v}</div></div>`).join('')}</div>` : ''}
      ${ctas ? `<div class="ctas rv" data-d="4">${ctas}</div>` : ''}
    </div>
  </section>`;

const pourVous = (titre, items, image, alt) => `
  <section class="sect"><div class="wrap deux deux-c">
    <div><span class="lbl rv">Pour vous si…</span><h2 class="rv" data-d="1">${titre}</h2>
      <ul class="liste-pour rv" data-d="2">${items.map(i => `<li>${i}</li>`).join('')}</ul></div>
    <figure class="rv" data-d="1" style="border-radius:4px;overflow:hidden;aspect-ratio:4/5"><img src="${img(image)}" alt="${alt}" loading="lazy" style="width:100%;height:115%;object-fit:cover" data-px="-.06"></figure>
  </div></section>`;

const deroule = (titre, etapes) => `
  <section class="sect" style="background:var(--humus)"><div class="wrap deux">
    <div style="position:sticky;top:calc(var(--nav-h) + 3rem)"><span class="lbl rv">Déroulé</span><h2 class="rv" data-d="1">${titre}</h2></div>
    <div class="deroule"><span class="fil"></span>${etapes.map(([t, p], k) => `
      <div class="etape"><span class="pt">${String(k + 1).padStart(2, '0')}</span><div><h4>${t}</h4><p>${p}</p></div></div>`).join('')}</div>
  </div></section>`;

const formuleCarte = ({ nom, det, prix, unite = '', texte, resa, vedette, cadeau }) => `
  <article class="formule${vedette ? ' vedette' : ''}">
    <span class="f-det">${det}</span><h3 class="f-nom">${nom}</h3>
    <div class="f-prix">${prix}<small>${unite}</small></div><p>${texte}</p>
    ${resa ? `<button class="btn btn-sm" data-resa="${resa}"${vedette ? '' : ''}>Réserver</button>` : ''}
    ${cadeau ? `<a class="btn btn-sm" href="#/carte-cadeau/${cadeau}">Offrir</a>` : ''}
  </article>`;

const faq = liste => `<div class="faq">${liste.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('')}</div>`;

const bandeau = (el, titre, ctas) => `<section class="sect-sm"><div class="wrap"><div class="bandeau-cta rv" data-el="${el}"><h2>${titre}</h2><div style="display:flex;gap:.8rem;flex-wrap:wrap">${ctas}</div></div></div></section>`;

const croise = sauf => {
  const portes = [['eau', 'soins-sonores', 'Bains sonores', 'bols-bougies'], ['feu', 'soins-chamaniques', 'Soins chamaniques', 'tambour-hochet'], ['terre', 'journee-duo', 'Journée Duo', 'espace-soin'], ['air', 'stages', 'Cercles & stages', 'plumes-herbe']].filter(p => p[1] !== sauf);
  return `<section class="sect-sm"><div class="wrap"><span class="lbl rv">Les autres portes</span><div class="croise rv" data-d="1">${portes.map(([el, h, t, f]) => `
    <a href="#/${h}" data-el="${el}"><div class="fond" style="background-image:url(${img(f)})"></div><span class="elnom mono" style="color:var(--el)">${ELEMENTS[el].nom}</span><h3>${t}</h3></a>`).join('')}</div></div></section>`;
};

const galerie = items => `<section class="sect-sm"><div class="wrap galerie">${items.map(([f, cap, col, h]) => `
  <figure class="rv" style="grid-column:span ${col};height:${h}px"><img src="${img(f)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`).join('')}</div></section>`;

const agendaFiltre = (types, titre) => {
  const l = evtsAVenir().filter(e => types.includes(e.type));
  if (!l.length) return '';
  return `<section class="sect clair"><div class="wrap"><span class="lbl rv">Agenda</span><h2 class="rv" data-d="1" style="margin-bottom:2rem">${titre}</h2><div class="agenda rv" data-d="2">${l.map(ligneEvt).join('')}</div></div></section>`;
};

function pageSonores() {
  return heros({ el: 'eau', fond: 'bols-bougies', lbl: '01 · Élément Eau', titre: 'Se laisser <em>porter</em> par la vibration',
    chapo: 'Bols tibétains, bols de cristal, gongs. Allongé·e, couvert·e, vous n\'avez rien à faire qu\'écouter et recevoir. Le corps se détend, l\'esprit se pose.',
    infos: [['Durée', '1 h 15'], ['Tarif', 'dès 25 €'], ['Lieu', 'Sud-Essonne'], ['Pour', 'Tout le monde']],
    ctas: '<button class="btn btn-el" data-resa="bain-individuel">Réserver un bain sonore</button><a class="btn btn-ghost" href="#/carte-cadeau/bain">Offrir</a>' })
  + pourVous('Le corps sait <em>déposer</em>, si on lui en laisse le temps.', [
      'Vous avez du mal à lâcher prise, même quand vous vous arrêtez.',
      'Votre mental tourne en boucle, votre sommeil est léger.',
      'Vous traversez une période de fatigue ou de tension.',
      'Vous voulez simplement vous offrir un vrai moment de repos.',
      'Vous êtes curieux·se du son et de ses effets sur le corps.'], 'bol', 'Grand bol tibétain et sa mailloche')
  + deroule('Une séance, <em>pas à pas</em>', [
      ['Accueil', 'Installation confortable : vous êtes allongé·e, couvert·e, en sécurité. Nous échangeons un moment sur ce qui vous amène.'],
      ['Intention', 'Quelques respirations pour poser une intention, aussi simple soit-elle.'],
      ['Le bain', 'Les bols sont disposés autour de vous et sur vous pour le massage. Les ondes se répondent ; vous n\'avez qu\'à recevoir.'],
      ['Retour', 'Un temps de silence, puis un partage libre de vos ressentis, autour d\'une tisane.']])
  + `<section class="sect"><div class="wrap" style="text-align:center"><blockquote class="citation rv" style="max-width:26ch;margin:0 auto">« Il y a toujours une possibilité d'évolution et de solution : les obstacles sont aussi des apprentissages de la vie. »<cite>Sandrine</cite></blockquote></div></section>`
  + galerie([['bols-bougies', 'Le cercle des bols', 7, 420], ['gong-venus', 'Gong planétaire', 5, 420], ['espace-soin', 'L\'espace de soin', 5, 360], ['bol', 'Bol tibétain', 7, 360]])
  + `<section class="sect clair" data-el="eau"><div class="wrap"><span class="lbl rv">Formules & tarifs</span><h2 class="rv" data-d="1" style="margin-bottom:2.5rem">Choisir <em>sa vibration</em></h2><div class="formules rv" data-d="2">
      ${formuleCarte({ nom: 'Bain sonore individuel', det: '1 h 15 · chez moi', prix: '80 €', texte: 'Bols tibétains, cristal et gong disposés autour de vous.', resa: 'bain-individuel' })}
      ${formuleCarte({ nom: 'Massage sonore', det: '1 h 15 · chez moi', prix: '80 €', texte: 'Les bols posés sur le corps : une vibration ressentie de l\'intérieur.', resa: 'massage-sonore' })}
      ${formuleCarte({ nom: 'Carte 3 séances', det: 'bain ou massage · 6 mois', prix: '225 €', texte: 'Pour installer un vrai rythme de détente. Soit 75 € la séance.', resa: 'bain-individuel', vedette: true })}
      ${formuleCarte({ nom: 'Bain entre proches', det: '2 h · 2 à 6 personnes', prix: '25 €', unite: '/pers.', texte: 'Un bain collectif privatisé pour votre groupe, chez moi.', resa: 'bain-collectif-prive' })}
    </div></div></section>`
  + agendaFiltre(['bain'], 'Les prochains <em>bains collectifs</em>')
  + `<section class="sect"><div class="wrap deux"><div><span class="lbl rv">Questions</span><h2 class="rv" data-d="1">Avant de <em>venir</em></h2></div><div class="rv" data-d="2">${faq([...FAQ.sonore, ...FAQ.general.slice(0, 4)])}</div></div></section>`
  + bandeau('eau', 'Prêt·e à vous laisser porter ?', '<button class="btn btn-el" data-resa="bain-individuel">Réserver</button><a class="btn btn-ghost" href="#/contact">Poser une question</a>')
  + croise('soins-sonores');
}

function pageChamaniques() {
  const outils = [['tambour', 'Tambour', 'Il ouvre toujours la porte. Son battement régulier apaise le mental et soutient le voyage.'],
    ['voyage', 'Voyage chamanique', 'Au son du tambour, je voyage pour vous à la rencontre de ce qui demande à être vu.'],
    ['animal', 'Animal de pouvoir', 'Un allié se présente parfois. Vous apprendrez à le retrouver seul·e.'],
    ['pendule', 'Pendule', 'Pour sentir où l\'énergie circule, et où elle se retient.'],
    ['kila', 'Kila', 'Le poignard rituel himalayen, pour trancher les liens qui ne vous servent plus.'],
    ['voix', 'Chant', 'La voix porte ce que les mots ne savent pas dire.']];
  return heros({ el: 'feu', fond: 'autel-tambour', lbl: '02 · Élément Feu', titre: 'Voyager vers ce qui <em>demande à guérir</em>',
    chapo: 'Tambour, voyage chamanique, animal de pouvoir. Il n\'y a pas de déroulé écrit d\'avance : chaque soin se construit dans l\'instant, guidé par ce qui se présente pour vous.',
    infos: [['Durée', '1 h 15'], ['Tarif', '80 €'], ['Lieu', 'Sud-Essonne'], ['Pour', 'Les passages de vie']],
    ctas: '<button class="btn btn-el" data-resa="soin-chamanique">Réserver un soin</button><a class="btn btn-ghost" href="#/carte-cadeau/soin">Offrir</a>' })
  + pourVous('Quand quelque chose <em>demande</em> à être traversé.', [
      'Vous traversez un passage difficile : deuil, séparation, transition.',
      'Vous vous sentez bloqué·e, comme si quelque chose vous retenait.',
      'Des schémas se répètent dans votre vie, et vous voulez vous en libérer.',
      'Vous ressentez l\'appel de vous reconnecter à votre spiritualité, à votre créativité.',
      'Vous cherchez un accompagnement respectueux, sans emprise.'], 'tambour-hochet', 'Tambour chamanique, hochet et plume')
  + `<section class="sect" data-el="feu" style="background:linear-gradient(var(--nuit),var(--feu-n),var(--nuit))"><div class="wrap">
      <span class="lbl rv">Les outils du soin</span><h2 class="rv" data-d="1" style="margin-bottom:3rem">Six présences, <em>une écoute.</em></h2>
      <div class="grille-outils">
      ${outils.map(([i, t, p], k) => `<div class="rv" data-d="${k % 3 + 1}" style="background:var(--nuit);padding:2rem">${ico(i, 'carte-ico')}<h3 style="margin:.8rem 0 .6rem">${t}</h3><p style="font-size:.95rem">${p}</p></div>`).join('')}
      </div></div></section>`
  + deroule('Un soin, <em>pas à pas</em>', [
      ['Une tisane, une parole', 'Nous prenons le temps d\'échanger : ce qui vous amène, votre intention pour la séance.'],
      ['Le soin', 'Sur table ou au sol, guidé par le tambour et les instruments. Vous restez habillé·e.'],
      ['Le partage', 'Je vous raconte ce que j\'ai perçu ; vous partagez vos ressentis. Parfois, un petit rituel à poursuivre chez vous.'],
      ['L\'objet symbolique', 'Vous repartez avec un objet pour ancrer ce qui s\'est ouvert.']])
  + `<section class="sect"><div class="wrap deux deux-c">
      <div><span class="lbl rv" style="color:var(--feu)">Éthique</span><h2 class="rv" data-d="1">Vous restez <em style="color:var(--feu)">la seule autorité</em> de votre vie.</h2></div>
      <div><blockquote class="citation rv" data-d="2">« Je ne me rendrai jamais responsable de son travail personnel. Je souhaite transmettre, faciliter — en aucun cas avoir une relation d'emprise sur la personne. »<cite>Sandrine</cite></blockquote>
      <p class="rv" data-d="3" style="margin-top:1.5rem">Éviter toute forme d'emprise est pour moi une exigence non négociable. Je ne prends jamais le pouvoir sur le processus de quelqu'un : je le facilite.</p></div>
    </div></section>`
  + `<section class="sect clair" data-el="feu"><div class="wrap"><span class="lbl rv">Formules & tarifs</span><h2 class="rv" data-d="1" style="margin-bottom:2.5rem">Prendre <em>rendez-vous</em></h2><div class="formules rv" data-d="2">
      ${formuleCarte({ nom: 'Soin chamanique & énergétique', det: '1 h 15 · chez moi', prix: '80 €', texte: 'Tambour, voyage, pendule, kila, chant — selon ce qui se présente.', resa: 'soin-chamanique' })}
      ${formuleCarte({ nom: 'Carte 3 soins', det: '6 mois', prix: '225 €', texte: 'Pour accompagner un passage dans la durée. Soit 75 € le soin.', resa: 'soin-chamanique', vedette: true })}
      ${formuleCarte({ nom: 'Carte cadeau', det: 'valable 12 mois', prix: '80 €', texte: 'Offrir un soin à quelqu\'un qui traverse un moment difficile.', cadeau: 'soin' })}
    </div></div></section>`
  + agendaFiltre(['stage', 'ceremonie'], 'Pour aller plus loin : <em>stages & cérémonies</em>')
  + `<section class="sect"><div class="wrap deux"><div><span class="lbl rv">Questions</span><h2 class="rv" data-d="1">Avant de <em>venir</em></h2></div><div class="rv" data-d="2">${faq([...FAQ.chamanique, ...FAQ.general])}</div></div></section>`
  + bandeau('feu', 'Le tambour vous attend.', '<button class="btn btn-el" data-resa="soin-chamanique">Réserver un soin</button><a class="btn btn-ghost" href="#/contact">En parler d\'abord</a>')
  + croise('soins-chamaniques');
}

function pageDuo() {
  const jour = [['10:00', 'Accueil', 'Tisane, ouverture au tambour, chacune pose son intention pour la journée.'],
    ['11:00', 'Bain sonore à deux', 'Allongées côte à côte, au milieu des bols et du gong.'],
    ['12:30', 'Déjeuner de saison', 'Un repas simple et partagé, sans se presser.'],
    ['14:00', 'Marche & rituel au bord de l\'eau', 'En forêt toute proche : se relier au vivant, déposer, confier à l\'eau.'],
    ['15:30', 'Soin au tambour', 'Chacune reçoit un soin, l\'autre en est témoin et soutien.'],
    ['16:30', 'Cercle de clôture', 'Chant, parole, et un objet symbolique pour chacune.']];
  return heros({ el: 'terre', fond: 'espace-soin', lbl: '03 · Élément Terre · prestation signature', titre: 'La Journée <em>Duo</em>',
    chapo: 'Ma proposition préférée : une journée entière à deux, entre amies, pour se retrouver et se reconnecter dans un cadre hors du temps.',
    infos: [['Horaires', '10 h – 17 h'], ['Pour', '2 personnes'], ['Tarif', '350 € le duo'], ['Cadre', 'Chez moi ou en forêt']],
    ctas: '<button class="btn btn-el" data-resa="journee-duo">Choisir notre date</button><a class="btn btn-ghost" href="#/carte-cadeau/duo">L\'offrir à une amie</a>' })
  + `<section class="sect" data-el="terre"><div class="wrap">
      <span class="lbl rv">Le fil de la journée</span><h2 class="rv" data-d="1" style="margin-bottom:2rem">Du premier battement<br>à la <em>dernière note.</em></h2>
      <div class="rv" data-d="2" style="max-width:900px;margin:0 auto 2rem"><svg class="soleil-arc" id="soleil" viewBox="0 0 900 260" aria-hidden="true">
        <path class="arc" d="M40 240 Q450 -60 860 240"/><path class="arc-on" id="arc-on" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="M40 240 Q450 -60 860 240"/>
        <circle class="astre" id="astre" r="10" cx="40" cy="240"/>
        <text x="40" y="258" text-anchor="middle">10 H</text><text x="860" y="258" text-anchor="middle">17 H</text></svg></div>
      <div class="deroule" id="duo-deroule" style="max-width:720px;margin:0 auto"><span class="fil"></span>${jour.map(([h, t, p]) => `
        <div class="etape"><span class="pt">${h.slice(0, 2)}h</span><div><h4>${t}</h4><p>${p}</p></div></div>`).join('')}</div>
      <p class="rv" style="max-width:720px;margin:2rem auto 0;font-size:.88rem;color:var(--lin-3)">Ce fil est une trame : les rituels se construisent dans l'instant, selon vos énergies et la météo.</p>
    </div></section>`
  + `<section class="sect" style="background:var(--humus)"><div class="wrap deux deux-c">
      <figure class="rv" style="border-radius:999px 999px 4px 4px;overflow:hidden;aspect-ratio:4/5"><img src="${img('ponton')}" alt="Ponton au bord de l'étang, lumière d'hiver" loading="lazy" style="width:100%;height:115%;object-fit:cover" data-px="-.06"></figure>
      <div><span class="lbl rv">Pour qui</span><h2 class="rv" data-d="1">Deux femmes qui se <em>connaissent déjà.</em></h2>
      <p class="rv" data-d="2" style="margin:1.5rem 0">Amies, sœurs, mère et fille, proches : celles qui souhaitent vivre ensemble une expérience de reconnexion profonde, et repartir avec un souvenir commun qui ne ressemble à aucun autre.</p>
      <ul class="liste-pour rv" data-d="3"><li>Tous les soins et rituels de la journée</li><li>Le déjeuner et les tisanes</li><li>Un objet symbolique pour chacune</li><li>Le déplacement en Sud-Essonne</li></ul></div>
    </div></section>`
  + `<section class="sect clair" data-el="terre"><div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;align-items:stretch">
      ${formuleCarte({ nom: 'Journée Duo', det: '10 h – 17 h · pour 2', prix: '350 €', unite: ' le duo', texte: 'Soit 175 € par personne pour une journée complète, soins et repas compris.', resa: 'journee-duo', vedette: true })}
      ${formuleCarte({ nom: 'L\'offrir', det: 'carte cadeau · 12 mois', prix: '350 €', texte: 'Offrez la journée à une amie… et venez avec elle. Elle choisira la date.', cadeau: 'duo' })}
    </div></section>`
  + `<section class="sect"><div class="wrap" style="text-align:center"><blockquote class="citation rv" style="max-width:28ch;margin:0 auto">« La libération de la voix, c'est un retour à la voix de son âme. »<cite>Sandrine</cite></blockquote></div></section>`
  + bandeau('terre', 'Choisissez votre date à deux.', '<button class="btn btn-el" data-resa="journee-duo">Réserver la Journée Duo</button>')
  + croise('journee-duo');
}
function apresDuo(r) {
  const arc = $('#arc-on', r), astre = $('#astre', r), ref = $('.arc', r), dr = $('#duo-deroule', r);
  if (!arc) return;
  const L = ref.getTotalLength();
  defileurs.push((y, vh) => {
    const b = dr.getBoundingClientRect(), p = Math.min(1, Math.max(0, (vh * .65 - b.top) / b.height));
    arc.style.strokeDashoffset = 1 - p;
    const pt = ref.getPointAtLength(p * L); astre.setAttribute('cx', pt.x); astre.setAttribute('cy', pt.y);
  });
}

function pageStages() {
  const types = Object.entries(TYPES_EVENEMENT);
  return heros({ el: 'air', fond: 'plumes-herbe', lbl: '04 · Souffle', titre: 'Cercles, cérémonies <em>& stages</em>',
    chapo: '« Le rassemblement des femmes en cercle de chant, c\'est pour moi la plus belle des pratiques. » Se retrouver ensemble, au rythme des lunes et des saisons.',
    ctas: '<button class="btn btn-el" data-scroll="agenda">Voir les dates</button><a class="btn btn-ghost" href="#/contact">Organiser un stage pour votre groupe</a>' })
  + `<section class="sect clair" id="agenda"><div class="wrap">
      <span class="lbl rv">Agenda</span><h2 class="rv" data-d="1" style="margin-bottom:2rem">Les prochaines <em style="color:var(--or-sombre)">dates</em></h2>
      <div class="filtres rv" data-d="2" id="filtres"><button aria-pressed="true" data-t="">Tout</button>${types.map(([k, t]) => `<button aria-pressed="false" data-t="${k}">${t.pluriel}</button>`).join('')}</div>
      <div class="agenda" id="agenda-liste">${evtsAVenir().map(ligneEvt).join('')}</div>
    </div></section>`
  + `<section class="sect"><div class="wrap">
      <span class="lbl rv">La roue de l'année</span><h2 class="rv" data-d="1" style="margin-bottom:3rem">Quatre <em>formats</em> pour se rassembler</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
      ${[['air', 'lune', 'Cercles de femmes', 'Chaque lune nouvelle', 'Parole, chant et tambour, pour déposer ce qui s\'achève et semer une intention. 2 h 30, 30 €.'],
         ['feu', 'saisons', 'Cérémonies des saisons', 'Solstices & équinoxes', 'Quatre fois par an, un rituel collectif pour accompagner le passage d\'une saison à l\'autre.'],
         ['terre', 'voix', 'Stages d\'une journée', 'Voix · voyage au tambour', 'Pour apprendre, expérimenter et repartir avec une pratique à poursuivre chez soi.'],
         ['eau', 'bol', 'Bains collectifs', 'Un samedi par mois', 'Deux heures allongé·e, en petit groupe de 6, au milieu des bols et du gong. 25 €.']]
        .map(([el, i, t, q, p], k) => `<div class="rv" data-d="${k + 1}" data-el="${el}" style="padding:2rem;border:1px solid var(--trait);border-radius:4px;background:radial-gradient(ellipse at 100% 0%,color-mix(in srgb,var(--el) 14%,transparent),transparent 60%)">${ico(i, 'carte-ico')}<span class="mono" style="color:var(--el)">${q}</span><h3 style="margin:.8rem 0">${t}</h3><p style="font-size:.95rem">${p}</p></div>`).join('')}
      </div></div></section>`
  + `<section class="sect" style="background:var(--humus)"><div class="wrap deux deux-c">
      <div><span class="lbl rv">Bientôt</span><h2 class="rv" data-d="1">Un lieu d'accueil <em>prend forme.</em></h2>
      <p class="rv" data-d="2" style="margin-top:1.5rem">Un lieu de retraite, pour des week-ends en immersion, est en train de naître. La Lettre des saisons sera la première à en annoncer l'ouverture.</p>
      <form class="lettre rv" data-d="3" data-lettre style="margin:2rem 0 0"><label class="sr" for="l2">Votre email</label><input id="l2" type="email" required placeholder="Votre email"><button class="btn btn-ghost" type="submit">Être prévenu·e</button></form></div>
      <figure class="rv" style="border-radius:4px;overflow:hidden;aspect-ratio:1"><img src="${img('plume-terre')}" alt="Plume blanche posée sur la terre" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>
    </div></section>`
  + croise('stages');
}
function apresStages(r) {
  const f = $('#filtres', r), liste = $('#agenda-liste', r);
  f?.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', f).forEach(x => x.setAttribute('aria-pressed', x === b));
    const l = evtsAVenir().filter(ev => !b.dataset.t || ev.type === b.dataset.t);
    liste.innerHTML = l.length ? l.map(ligneEvt).join('') : '<p style="padding:2rem 0">Pas de date pour le moment — inscrivez-vous à la Lettre des saisons pour être prévenu·e.</p>';
  });
}

function pageStage(id) {
  const e = EVTS.find(x => x.id === id);
  if (!e) return pageStages();
  const t = TYPES_EVENEMENT[e.type], passe = dateDe(e.date) < aujourdhui();
  const autres = evtsAVenir().filter(x => x.id !== e.id).slice(0, 3);
  return heros({ el: e.element, fond: e.image, lbl: t.nom, titre: e.titre.replace(/(\S+)$/, '<em>$1</em>'),
    chapo: e.sousTitre,
    infos: [['Date', fmt(e.date, { weekday: 'long', day: 'numeric', month: 'long' })], ['Horaires', `${heure(e.debut)} – ${heure(e.fin)}`], ['Groupe', `${e.places} personnes max.`], ['Tarif', euros(e.prix)]],
    ctas: passe ? '<a class="btn btn-ghost" href="#/stages">Voir les prochaines dates</a>' : `<button class="btn btn-el" data-resa-evt="${e.id}">Je réserve ma place</button>` })
  + `<section class="sect" data-el="${e.element}"><div class="wrap fiche">
      <div>
        <span class="lbl rv">L'intention</span>
        <p class="citation rv" data-d="1" style="font-size:clamp(1.3rem,2.4vw,1.9rem);max-width:none">${e.intention}</p>
        <h3 class="rv" style="margin-top:4rem">Le programme</h3>
        <ol class="programme rv" data-d="1">${e.programme.map(([h, p]) => `<li><time>${heure(h)}</time><span>${p}</span></li>`).join('')}</ol>
        <div class="deux" style="margin-top:4rem;gap:2rem">
          <div class="rv"><h3>Inclus</h3><ul class="puces">${e.inclus.map(i => `<li>${i}</li>`).join('')}</ul></div>
          <div class="rv" data-d="1"><h3>À apporter</h3><ul class="puces">${e.apporter.map(i => `<li>${i}</li>`).join('')}</ul></div>
        </div>
        <h3 class="rv" style="margin-top:4rem">Pour qui</h3><p class="rv" style="margin-top:1rem">${e.pourQui}</p>
      </div>
      <aside class="encart rv" data-d="2">
        <span class="mono" style="color:var(--el)">${t.nom}</span>
        <div class="e-prix" style="margin-top:1rem">${euros(e.prix)}</div>
        ${e.acompte ? `<p style="font-size:.88rem;margin-top:.4rem">Acompte de ${euros(e.acompte)} à la réservation</p>` : ''}
        <dl class="dl-ico">${[['calendrier', 'Date', dateLongue(e.date)], ['horaire', 'Horaires', `${heure(e.debut)} – ${heure(e.fin)}`], ['lieu', 'Lieu', e.lieu], ['groupe', 'Groupe', `${e.places} personnes maximum`]].map(([i, k, v]) => `${ico(i)}<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        ${passe ? '<p>Cette date est passée.</p>' : `<button class="btn btn-el btn-block" data-resa-evt="${e.id}">Je réserve ma place</button>`}
        <a class="btn btn-ghost btn-block" style="margin-top:.6rem" href="#/carte-cadeau/libre">Offrir ce moment</a>
        <p style="font-size:.8rem;margin-top:1rem;color:var(--lin-3)">Une question avant de vous inscrire ? <a href="#/contact" style="color:var(--el)">Écrivez-moi</a>.</p>
      </aside>
    </div></section>`
  + (autres.length ? `<section class="sect clair"><div class="wrap"><span class="lbl rv">Aussi à l'agenda</span><div class="agenda rv" data-d="1" style="margin-top:1.5rem">${autres.map(ligneEvt).join('')}</div></div></section>` : '');
}

function pageQui() {
  const fil = [['Un tambour', 'celui d\'une chamane nord-américaine, qui réveille tout'], ['Une guérisseuse', 'péruvienne'], ['Une chamane', 'népalaise'], ['Une chamane', 'mongole'], ['Ma propre guidance', 'aujourd\'hui']];
  return heros({ el: 'terre', fond: 'plume-terre', lbl: 'Qui suis-je', titre: 'Un parcours <em>tissé</em> de transmissions',
    chapo: '« Ça a réveillé quelque chose chez moi, comme une connaissance profonde, déjà là. »' })
  + `<section class="sect"><div class="wrap sandrine">
      <div class="portrait rv"><img src="${img('portrait-1')}" alt="Portrait de Sandrine" loading="lazy" data-px="-.05"></div>
      <div><span class="lbl rv">Le déclencheur</span><h2 class="rv" data-d="1">Tout a commencé <em>par un tambour.</em></h2>
      <p class="rv" data-d="2" style="margin-top:1.5rem">Un jour, j'ai entendu celui d'une chamane nord-américaine, et quelque chose s'est réveillé en moi. Je me suis mise en quête de comprendre les effets du son et de la vibration sur le corps. J'ai cherché mon propre tambour, puis j'ai appris à voyager avec lui. Peu à peu, d'autres instruments sont venus — bols tibétains, bols de cristal, gongs, chant, pendule.</p>
      <div class="mots-cles rv" data-d="3"><span>Chaleureuse</span><span>À l'écoute</span><span>Résiliente</span></div></div>
    </div></section>`
  + `<section class="sect" style="background:var(--humus)"><div class="wrap">
      <span class="lbl rv">Le fil des transmissions</span><h2 class="rv" data-d="1" style="margin-bottom:3rem">Aucune école. <em>Plusieurs femmes-médecine.</em></h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0;border-top:1px solid var(--or)">
      ${fil.map(([t, p], k) => `<div class="rv" data-d="${k % 4 + 1}" style="padding:1.6rem 1.2rem 0 0;position:relative"><span style="position:absolute;top:-5px;left:0;width:9px;height:9px;border-radius:50%;background:var(--or)"></span><h3 style="font-size:1.4rem">${t}</h3><p style="font-size:.92rem;margin-top:.3rem">${p}</p></div>`).join('')}
      </div></div></section>`
  + `<section class="sect"><div class="wrap deux">
      <div><span class="lbl rv">Ma posture</span><h3 class="rv" data-d="1" style="font-size:clamp(1.6rem,3vw,2.4rem)">Créer, pour chaque personne, <em>les rituels qui lui correspondent.</em></h3>
      <p class="rv" data-d="2" style="margin-top:1.2rem">Je ne me rattache à aucune école ni tradition unique. J'ai reçu des transmissions de plusieurs femmes-médecine, mais je préfère aujourd'hui écouter ma propre guidance.</p></div>
      <div><span class="lbl rv">Accompagner</span><h3 class="rv" data-d="1" style="font-size:clamp(1.6rem,3vw,2.4rem)">Un cadre sécurisé de <em>reconnexion à soi.</em></h3>
      <p class="rv" data-d="2" style="margin-top:1.2rem">Pour me libérer des schémas reçus au fil de la vie. Vous restez seul·e responsable de votre chemin : je ne prends jamais le pouvoir sur le processus de quelqu'un, je le facilite.</p></div>
    </div></section>`
  + `<section class="finale"><div class="wrap"><span class="lbl rv" style="justify-content:center">Vision à venir</span>
      <blockquote class="citation rv" data-d="1" style="max-width:30ch;margin:0 auto 2.5rem;position:relative">« Souvent la souffrance vient avec une aspiration de l'âme à se reconnecter profondément à sa spiritualité et à sa créativité. »<cite>Sandrine</cite></blockquote>
      <div class="rv" data-d="2" style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;position:relative"><button class="btn" data-resa>Réserver un soin</button><a class="btn btn-ghost" href="#/contact">M'écrire</a></div>
    </div></section>`;
}

function pageContact(sujet) {
  const sujets = [['', 'Choisir…'], ['question', 'Une question avant de réserver'], ['structure', 'Intervention en structure (devis)'], ['stage-groupe', 'Organiser un stage pour un groupe'], ['cadeau', 'Une carte cadeau'], ['autre', 'Autre chose']];
  return heros({ el: 'air', fond: 'fleur', lbl: 'Contact', titre: 'Prenons le temps <em>de vous écouter</em>',
    chapo: 'Je vous réponds personnellement, ' + CONFIG.reponse + '. Pas de robot, pas de file d\'attente : un échange humain, au rythme qui vous convient.' })
  + `<section class="sect clair" data-el="air"><div class="wrap deux">
      <div>
        <span class="lbl rv">Écrire</span>
        <form class="rv" data-d="1" id="f-contact" novalidate>
          <div class="rangee"><div class="champ"><label for="c-prenom">Prénom</label><input id="c-prenom" name="prenom" required autocomplete="given-name"><span class="err">Votre prénom, s'il vous plaît.</span></div>
          <div class="champ"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"><span class="err">Un email valide, pour que je puisse vous répondre.</span></div></div>
          <div class="champ"><label for="c-tel">Téléphone (facultatif)</label><input id="c-tel" name="tel" type="tel" autocomplete="tel"></div>
          <div class="champ"><label for="c-sujet">Votre demande</label><select id="c-sujet" name="sujet">${sujets.map(([v, t]) => `<option value="${v}"${v === sujet ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="champ" id="c-structure" ${sujet === 'structure' ? '' : 'hidden'}><label for="c-org">Structure · public · nombre de participants</label><input id="c-org" name="structure" placeholder="ex. EHPAD Les Tilleuls · résidents · 12 personnes"></div>
          <div class="champ"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea><span class="err">Quelques mots sur votre demande.</span></div>
          <label class="coche"><input type="checkbox" name="rappel"> Je préfère être rappelé·e par téléphone</label>
          <button class="btn btn-block" type="submit" style="--b:var(--encre);color:var(--parchemin);margin-top:1rem">Envoyer mon message</button>
          <p style="font-size:.8rem;margin-top:1rem">Vos informations servent uniquement à vous répondre et ne sont jamais transmises.</p>
        </form>
      </div>
      <div>
        <span class="lbl rv">Où & quand</span>
        <dl class="rv" data-d="1" style="display:grid;gap:1.5rem;margin-bottom:3rem">
          <div class="contact-info">${ico('lieu')}<dt class="mono" style="color:var(--encre-2)">Lieu</dt><dd style="font-family:var(--f-titre);font-size:1.5rem;font-weight:300">${CONFIG.lieu}</dd></div>
          <div class="contact-info">${ico('contact')}<dt class="mono" style="color:var(--encre-2)">Réponse</dt><dd style="font-family:var(--f-titre);font-size:1.5rem;font-weight:300">${CONFIG.reponse}</dd></div>
          ${CONFIG.telephone ? `<div><dt class="mono" style="color:var(--encre-2)">Téléphone</dt><dd style="font-family:var(--f-titre);font-size:1.5rem;font-weight:300"><a href="tel:${CONFIG.telephone.replace(/\s/g, '')}">${CONFIG.telephone}</a></dd></div>` : ''}
          ${CONFIG.email ? `<div><dt class="mono" style="color:var(--encre-2)">Email</dt><dd style="font-family:var(--f-titre);font-size:1.5rem;font-weight:300"><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></dd></div>` : ''}
        </dl>
        <div class="rv" data-d="2" style="padding:2rem;background:var(--parchemin-2);border-radius:6px">
          <span class="lbl">En structure</span>
          <h3 style="color:var(--encre)">Associations, crèches, EHPAD</h3>
          <p style="margin:.8rem 0 0">Des bains sonores adaptés à tous les publics, des tout-petits aux aînés : séances au sol ou assises, durée et volume ajustés. Devis sur demande, selon le public, le nombre de participants et la fréquence.</p>
        </div>
        <blockquote class="citation rv" data-d="3" style="color:var(--encre);margin-top:3rem;font-size:1.4rem">« Chaque chemin est unique. Je suis là pour vous accompagner avec bienveillance, au rythme qui vous appartient. »<cite style="color:var(--encre-2)">Sandrine</cite></blockquote>
      </div>
    </div></section>`;
}
function apresContact(r) {
  const f = $('#f-contact', r); if (!f) return;
  f.sujet.onchange = () => { $('#c-structure', r).hidden = f.sujet.value !== 'structure'; };
  f.onsubmit = async ev => {
    ev.preventDefault();
    if (!valider(f, ['prenom', 'email', 'message'])) return;
    const b = $('button[type=submit]', f); b.disabled = true; b.textContent = 'Envoi…';
    try {
      const res = await envoyer({ objet: 'Message — ' + (f.sujet.selectedOptions[0].text), ...Object.fromEntries(new FormData(f)) });
      f.innerHTML = merciHTML('Message reçu', `Merci ${esc(f.prenom?.value || '')}. Je vous réponds personnellement ${CONFIG.reponse}.`, res.demo);
    } catch (e) { b.disabled = false; b.textContent = 'Erreur — réessayer'; }
  };
}

function pageMentions() {
  const blocs = [['Éditrice du site', 'Sandrine — Racines et Résonances. Auto-entrepreneuse · Sud-Essonne, Dourdan (91).'],
    ['Nature de l\'activité', 'Les pratiques proposées (bains sonores, massages sonores, soins chamaniques et énergétiques, cercles, cérémonies et stages) sont des pratiques de bien-être et d\'accompagnement personnel. Elles ne constituent pas des soins médicaux et ne remplacent pas un avis médical. En cas de problème de santé, consultez un professionnel qualifié.'],
    ['Consentement éclairé', 'Un temps d\'échange préalable à chaque soin permet de recueillir votre consentement éclairé. Vous pouvez interrompre une séance à tout moment.'],
    ['Contre-indications (bains sonores)', 'Par précaution, les bains sonores sont déconseillés en cas de grossesse (1er trimestre), port de pacemaker, troubles cardiaques graves, épilepsie, opération récente. En cas de doute, consultez votre médecin avant de réserver.'],
    ['Réservations, annulations, cartes cadeaux', 'Chaque demande de réservation est confirmée personnellement. Report ou annulation sans frais jusqu\'à 48 h avant la séance. Acompte des stages remboursé jusqu\'à 7 jours avant. Cartes cadeaux valables 12 mois. (Conditions à valider.)'],
    ['Données personnelles', 'Les informations recueillies via les formulaires sont utilisées uniquement pour répondre à votre demande et ne sont jamais transmises à des tiers.'],
    ['Sons & images', 'Les sons de démonstration sont synthétisés dans votre navigateur. Les photographies sont celles de Sandrine.'],
    ['Hébergement', 'Prototype statique (v2). Les informations d\'hébergement définitif seront complétées lors de la mise en ligne.']];
  return heros({ el: 'terre', fond: 'fleur', lbl: 'Informations', titre: 'Mentions <em>& précautions</em>' })
  + `<section class="sect clair"><div class="wrap" style="max-width:820px">${blocs.map(([t, p]) => `<div class="rv" style="padding:2rem 0;border-bottom:1px solid rgba(26,21,16,.12)"><h3 style="color:var(--encre);margin-bottom:.8rem">${t}</h3><p>${p}</p></div>`).join('')}</div></section>`;
}

/* ═══ 6. RÉSERVATION (tiroir) ══════════════════════════════════ */
const T = { etat: null, etapes: [], i: 0 };

function creneauxDuJour(d, mode) {
  const dj = DISPONIBILITES;
  const min = aujourdhui(); min.setDate(min.getDate() + dj.delaiMinJours);
  const max = aujourdhui(); max.setDate(max.getDate() + dj.horizonJours);
  if (d < min || d > max || dj.fermetures.includes(iso(d))) return [];
  if (mode === 'creneau') return dj.creneaux[d.getDay()] || [];
  return dj.joursDuo.includes(d.getDay()) ? [mode === 'groupe' ? '17:00' : '10:00'] : [];
}

function ouvrirResa({ prestaId, evtId } = {}) {
  const p = prestaId && presta(prestaId);
  if (p && p.mode === 'devis') { location.hash = '#/contact/structure'; return; }
  T.etat = { prestaId: p?.id || null, evtId: evtId || null, formule: 'unite', date: null, heure: null, nb: p?.min || 1, mois: 0 };
  T.etapes = evtId ? ['places', 'coord', 'recap'] : ['soin', 'quand', 'coord', 'recap'];
  T.i = (p && !evtId) ? 1 : 0;
  $('#t-titre').textContent = evtId ? 'Réserver ma place' : 'Réserver un soin';
  afficherEtape();
  $('#tiroir').classList.add('on'); $('#voile').classList.add('on');
  $('#tiroir').setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
  setTimeout(() => $('#t-fermer').focus(), 400);
}
function fermerTiroir() {
  $('#tiroir').classList.remove('on'); $('#voile').classList.remove('on');
  $('#tiroir').setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
}

function totalResa() {
  const s = T.etat;
  if (s.evtId) { const e = EVTS.find(x => x.id === s.evtId); return e.prix * s.nb; }
  const p = presta(s.prestaId); if (!p) return null;
  if (p.mode === 'groupe') return p.prix * s.nb;
  if (p.prix === 80) return FORMULES.find(f => f.id === s.formule).prix;
  return p.prix;
}

function afficherEtape() {
  const s = T.etat, nom = T.etapes[T.i], corps = $('#t-corps'), pied = $('#t-pied');
  $('#t-prog').innerHTML = T.etapes.map((_, k) => `<i class="${k <= T.i ? 'on' : ''}"></i>`).join('');
  const p = presta(s.prestaId), e = s.evtId && EVTS.find(x => x.id === s.evtId);
  let ok = false, html = '';

  if (nom === 'soin') {
    html = `<h2>Quel soin <em>vous appelle ?</em></h2><p class="sous">Choisissez, puis votre créneau. Je confirme personnellement chaque rendez-vous.</p>
      <div class="choix">${PRESTATIONS.filter(x => x.mode !== 'devis').map(x => `
        <button class="opt" data-el="${x.element}" data-p="${x.id}" aria-pressed="${x.id === s.prestaId}">
          ${ico(x.icone, 'opt-ico')}<span><b>${x.nom}</b><small>${x.duree} · ${x.accroche}</small></span><span class="o-prix">${euros(x.prix)}${x.unite || ''}</span></button>`).join('')}
        <button class="opt opt-simple" data-p="structure"><span><b>Intervention en structure</b><small>Associations, crèches, EHPAD — sur devis</small></span></button></div>
      ${p && p.prix === 80 ? `<div class="cal-mois">Formule</div><div class="choix choix-2">${FORMULES.map(f => `<button class="opt opt-simple" data-f="${f.id}" aria-pressed="${f.id === s.formule}"><span><b>${f.nom} · ${euros(f.prix)}</b><small>${f.detail || 'une séance'}</small></span></button>`).join('')}</div>` : ''}
      <p class="note">Pas sûr·e ? <a href="#/" data-scroll-accueil="orientation">Le questionnaire d'orientation</a> vous aide à choisir en trois questions.</p>`;
    ok = !!p;
  }

  if (nom === 'quand') {
    const mode = p.mode, base = aujourdhui(); base.setDate(1); base.setMonth(base.getMonth() + s.mois);
    const premier = (base.getDay() + 6) % 7, nbJ = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    let cases = '<span class="js">lun</span><span class="js">mar</span><span class="js">mer</span><span class="js">jeu</span><span class="js">ven</span><span class="js">sam</span><span class="js">dim</span>' + '<span></span>'.repeat(premier);
    for (let j = 1; j <= nbJ; j++) {
      const d = new Date(base.getFullYear(), base.getMonth(), j), dispo = creneauxDuJour(d, mode).length > 0, k = iso(d);
      cases += `<button class="jour" data-j="${k}" ${dispo ? '' : 'disabled'} aria-pressed="${k === s.date}" aria-label="${dateLongue(d)}${dispo ? '' : ' — indisponible'}">${j}</button>`;
    }
    const heures = s.date ? creneauxDuJour(dateDe(s.date), mode) : [];
    html = `<h2>${mode === 'creneau' ? 'Quand <em>venir ?</em>' : 'Quelle <em>date ?</em>'}</h2>
      <p class="sous">${p.nom} · ${p.duree}${mode === 'jour' ? ' · journée entière' : ''}</p>
      <div style="display:flex;justify-content:space-between;align-items:center"><div class="cal-mois">${fmt(base, { month: 'long', year: 'numeric' })}</div>
        <div style="display:flex;gap:.4rem"><button class="t-fermer" data-mois="-1" ${s.mois <= 0 ? 'disabled style="opacity:.3"' : ''} aria-label="Mois précédent">‹</button><button class="t-fermer" data-mois="1" ${s.mois >= 1 ? 'disabled style="opacity:.3"' : ''} aria-label="Mois suivant">›</button></div></div>
      <div class="cal">${cases}</div>
      ${mode === 'creneau' && s.date ? `<div class="cal-mois">${dateLongue(s.date)}</div><div class="heures">${heures.map(h => `<button data-h="${h}" aria-pressed="${h === s.heure}">${heure(h)}</button>`).join('')}</div>` : ''}
      ${mode === 'groupe' ? `<div class="cal-mois">Nombre de personnes (${p.min} à ${p.max})</div><div class="compteur"><button data-nb="-1" aria-label="Moins">−</button><output>${s.nb}</output><button data-nb="1" aria-label="Plus">+</button></div>` : ''}
      <p class="note">Les jours marqués d'un point sont ouverts à la demande. Je vous confirme le rendez-vous ${CONFIG.reponse} — rien n'est débité à cette étape.</p>`;
    ok = !!s.date && (mode !== 'creneau' || !!s.heure);
  }

  if (nom === 'places') {
    html = `<h2>${esc(e.titre)}</h2><p class="sous">${dateLongue(e.date)} · ${heure(e.debut)} – ${heure(e.fin)}<br>${e.lieu}</p>
      <div class="cal-mois">Nombre de places</div><div class="compteur"><button data-nb="-1" aria-label="Moins">−</button><output>${s.nb}</output><button data-nb="1" aria-label="Plus">+</button></div>
      <p class="note">${e.places} personnes maximum, pour que chacun·e trouve sa place dans le cercle.${e.acompte ? ` Un acompte de ${euros(e.acompte)} par personne confirme l'inscription.` : ''}</p>`;
    ok = true;
  }

  if (nom === 'coord') {
    const v = s.coord || {};
    html = `<h2>Faisons <em>connaissance</em></h2><p class="sous">Pour que je puisse vous confirmer ${e ? 'votre place' : 'le rendez-vous'} et préparer notre rencontre.</p>
      <form id="t-form" novalidate>
        <div class="rangee"><div class="champ"><label for="t-prenom">Prénom</label><input id="t-prenom" name="prenom" required autocomplete="given-name" value="${esc(v.prenom)}"><span class="err">Votre prénom.</span></div>
        <div class="champ"><label for="t-nom">Nom</label><input id="t-nom" name="nom" autocomplete="family-name" value="${esc(v.nom)}"></div></div>
        <div class="champ"><label for="t-email">Email</label><input id="t-email" name="email" type="email" required autocomplete="email" value="${esc(v.email)}"><span class="err">Un email valide.</span></div>
        <div class="champ"><label for="t-tel">Téléphone</label><input id="t-tel" name="tel" type="tel" autocomplete="tel" value="${esc(v.tel)}"></div>
        ${p?.id === 'journee-duo' ? `<div class="champ"><label for="t-amie">Prénom de la personne qui vous accompagne</label><input id="t-amie" name="accompagnante" value="${esc(v.accompagnante)}"></div>` : ''}
        <div class="champ"><label for="t-int">Ce qui vous amène (facultatif)</label><textarea id="t-int" name="intention" placeholder="Quelques mots, si vous le souhaitez. Vous pourrez aussi m'en parler de vive voix.">${esc(v.intention)}</textarea></div>
        ${p?.element === 'eau' || e?.type === 'bain' ? `<label class="coche"><input type="checkbox" name="precautions" ${v.precautions ? 'checked' : ''}> J'ai lu les <a href="#/mentions" target="_blank">précautions</a> : je ne suis pas concerné·e par une contre-indication, ou j'en parlerai avant la séance.</label>` : ''}
        <label class="coche"><input type="checkbox" name="lettre" ${v.lettre ? 'checked' : ''}> Je souhaite recevoir la Lettre des saisons</label>
      </form>`;
    ok = true;
  }

  if (nom === 'recap') {
    const c = s.coord, tot = totalResa();
    const lignes = e
      ? [['Rencontre', e.titre], ['Date', dateLongue(e.date)], ['Horaires', `${heure(e.debut)} – ${heure(e.fin)}`], ['Places', s.nb]]
      : [['Soin', p.nom + (p.prix === 80 && s.formule === 'carte3' ? ' · carte 3 séances' : '')], ['Date', dateLongue(s.date)], ...(s.heure ? [['Heure', heure(s.heure)]] : []), ...(p.mode === 'groupe' ? [['Personnes', s.nb]] : [])];
    html = `<h2>Tout est <em>prêt</em></h2><p class="sous">Relisez votre demande. Je la reçois, je vous confirme ${CONFIG.reponse}, et vous ne réglez qu'à ce moment-là${e?.acompte ? ' (acompte)' : ''}.</p>
      <dl class="recap">${lignes.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        <div><dt>Pour</dt><dd>${esc(c.prenom)} ${esc(c.nom || '')}<br>${esc(c.email)}</dd></div>
        <div class="tot"><dt>Total</dt><dd>${euros(tot)}</dd></div>
        ${e?.acompte ? `<div><dt>Acompte à la confirmation</dt><dd>${euros(e.acompte * s.nb)}</dd></div>` : ''}</dl>
      <p class="note">Report ou annulation sans frais jusqu'à 48 h avant${e ? ' (7 jours pour les stages)' : ''}.</p>`;
    ok = true;
  }

  corps.innerHTML = html; corps.scrollTop = 0;
  const dernier = T.i === T.etapes.length - 1;
  const tot = (nom !== 'soin' || p) ? totalResa() : null;
  pied.innerHTML = `${T.i > 0 && !(T.i === 1 && T.etapes[0] === 'soin' && false) ? '<button class="btn btn-ghost" data-ret>Retour</button>' : ''}
    ${tot != null ? `<span class="t-total"><small>Total</small>${euros(tot)}</span>` : ''}
    <button class="btn" data-suiv ${ok ? '' : 'disabled'}>${dernier ? 'Envoyer ma demande' : 'Continuer'}</button>`;
}

function clicTiroir(ev) {
  const b = ev.target.closest('button, a'); if (!b) return;
  const s = T.etat, nom = T.etapes[T.i];
  if (b.dataset.scrollAccueil) { fermerTiroir(); return; }
  if (b.dataset.p) {
    if (b.dataset.p === 'structure') { fermerTiroir(); location.hash = '#/contact/structure'; return; }
    if (s.prestaId !== b.dataset.p) { s.date = null; s.heure = null; s.nb = presta(b.dataset.p).min || 1; }
    s.prestaId = b.dataset.p; return afficherEtape();
  }
  if (b.dataset.f) { s.formule = b.dataset.f; return afficherEtape(); }
  if (b.dataset.mois) { s.mois = Math.max(0, Math.min(1, s.mois + +b.dataset.mois)); return afficherEtape(); }
  if (b.dataset.j) { s.date = b.dataset.j; s.heure = null; Son.ctx && Son.bol(392, .12); return afficherEtape(); }
  if (b.dataset.h) { s.heure = b.dataset.h; return afficherEtape(); }
  if (b.dataset.nb) {
    const e = s.evtId && EVTS.find(x => x.id === s.evtId), p = presta(s.prestaId);
    const min = e ? 1 : p.min, max = e ? Math.min(4, e.places) : p.max;
    s.nb = Math.max(min, Math.min(max, s.nb + +b.dataset.nb)); return afficherEtape();
  }
  if ('ret' in b.dataset) { if (nom === 'coord') lireCoord(); T.i--; return afficherEtape(); }
  if ('suiv' in b.dataset) {
    if (nom === 'coord') { const f = $('#t-form'); if (!valider(f, ['prenom', 'email'])) return; lireCoord(); }
    if (T.i < T.etapes.length - 1) { T.i++; return afficherEtape(); }
    return envoyerResa(b);
  }
}
function lireCoord() {
  const f = $('#t-form'); if (!f) return;
  const d = Object.fromEntries(new FormData(f));
  T.etat.coord = { ...d, precautions: !!d.precautions, lettre: !!d.lettre };
}
async function envoyerResa(b) {
  const s = T.etat, p = presta(s.prestaId), e = s.evtId && EVTS.find(x => x.id === s.evtId);
  b.disabled = true; b.textContent = 'Envoi…';
  try {
    const res = await envoyer({
      objet: e ? `Inscription — ${e.titre} (${e.date})` : `Demande de rendez-vous — ${p.nom}`,
      prestation: e ? e.titre : p.nom, formule: s.formule, date: e ? e.date : s.date, heure: e ? e.debut : s.heure,
      personnes: s.nb, total: totalResa(), ...s.coord
    });
    $('#t-prog').innerHTML = '';
    $('#t-corps').innerHTML = merciHTML('Votre demande est partie', `Merci ${esc(s.coord.prenom)}. Je reviens vers vous ${CONFIG.reponse} pour confirmer ${e ? 'votre place' : 'notre rendez-vous'}. D'ici là, prenez soin de vous.`, res.demo);
    $('#t-pied').innerHTML = '<button class="btn btn-block" id="t-ok">Fermer</button>';
    $('#t-ok').onclick = fermerTiroir;
    Son.ctx && Son.bol(261.63, .5);
  } catch (err) { b.disabled = false; b.textContent = 'Erreur — réessayer'; }
}

function merciHTML(titre, texte, demo) {
  return `<div class="merci"><div class="anneau"><i></i><i></i><i></i><b></b></div><h2>${titre}</h2><p>${texte}</p>
    ${demo ? '<div class="demo">Mode maquette — aucune donnée n\'a été envoyée.<br>Brancher un formulaire (CONFIG.formEndpoint dans data.js) pour recevoir les demandes.</div>' : ''}</div>`;
}

function valider(f, champs) {
  let ok = true;
  champs.forEach(n => {
    const i = f.elements[n]; if (!i) return;
    const bon = i.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim()) : i.value.trim().length > 0;
    i.closest('.champ').classList.toggle('invalide', !bon);
    if (!bon && ok) { i.focus(); ok = false; }
  });
  return ok;
}

/* ═══ 7. CARTE CADEAU ══════════════════════════════════════════ */
function pageCadeau(pre) {
  const exp = CADEAU.experiences.find(x => x.id === pre) || CADEAU.experiences[0];
  return heros({ el: exp.element, fond: 'fleur', lbl: 'Carte cadeau', titre: 'Offrir <em>une résonance</em>',
    chapo: 'Un moment hors du temps, à offrir à quelqu\'un qui compte. Valable ' + CADEAU.validiteMois + ' mois, la personne choisit sa date.' })
  + `<section class="sect clair"><div class="wrap config">
      <div class="config-apercu rv">
        <div class="carte" id="cc-carte" data-el="${exp.element}" data-tilt>
          <div class="c-haut"><span class="c-logo">Racines <i>&</i> Résonances</span><span class="c-tag">Carte cadeau</span></div>
          <div><div class="c-titre" id="cc-titre"></div><div class="c-msg" id="cc-msg"></div></div>
          <div class="c-bas"><span id="cc-noms"></span><b id="cc-prix"></b></div>
        </div>
        <p style="font-size:.85rem;margin-top:1.5rem;text-align:center">Aperçu de votre carte · valable ${CADEAU.validiteMois} mois · code unique</p>
      </div>
      <form class="config-form" id="cc-form" novalidate>
        <div class="bloc"><h3><span>01</span>Ce que vous offrez</h3><div class="choix" id="cc-exp">${CADEAU.experiences.map(x => `
          <button type="button" class="opt" data-el="${x.element}" data-exp="${x.id}" aria-pressed="${x.id === exp.id}">${ico(x.icone, 'opt-ico')}<span><b>${x.nom}</b></span><span class="o-prix">${x.prix ? euros(x.prix) : '—'}</span></button>`).join('')}</div>
          <div class="champ" id="cc-libre" style="margin-top:1rem" ${exp.id === 'libre' ? '' : 'hidden'}><label for="cc-montant">Montant (dès 30 €)</label><input id="cc-montant" name="montant" type="number" min="30" step="5" value="50"></div></div>
        <div class="bloc"><h3><span>02</span>L'élément de la carte</h3><div class="theme-choix" id="cc-theme">${Object.entries(ELEMENTS).map(([k, v]) => `<button type="button" data-el="${k}" data-th="${k}" aria-pressed="${k === exp.element}" aria-label="${v.nom}" title="${v.nom}"></button>`).join('')}</div></div>
        <div class="bloc"><h3><span>03</span>Les mots</h3>
          <div class="rangee"><div class="champ"><label for="cc-pour">Pour</label><input id="cc-pour" name="pour" maxlength="30" placeholder="Claire"></div>
          <div class="champ"><label for="cc-de">De la part de</label><input id="cc-de" name="de" maxlength="30" placeholder="Léa"></div></div>
          <div class="champ"><label for="cc-mot">Votre message (facultatif)</label><textarea id="cc-mot" name="message" maxlength="140" placeholder="Pour que tu prennes enfin le temps de te poser."></textarea></div></div>
        <div class="bloc"><h3><span>04</span>La remise</h3><div class="choix" id="cc-liv">${CADEAU.livraisons.map((l, k) => `
          <button type="button" class="opt" data-liv="${l.id}" aria-pressed="${k === 0}"><span></span><span><b>${l.nom}</b><small>${l.detail}</small></span><span class="o-prix">${l.prix ? '+ ' + euros(l.prix) : 'offert'}</span></button>`).join('')}</div>
          <div class="champ" id="cc-adr" style="margin-top:1rem" hidden><label for="cc-adresse">Adresse d'envoi</label><textarea id="cc-adresse" name="adresse" style="min-height:80px"></textarea></div></div>
        <div class="bloc"><h3><span>05</span>Vous</h3>
          <div class="rangee"><div class="champ"><label for="cc-prenom">Votre prénom</label><input id="cc-prenom" name="prenom" required><span class="err">Votre prénom.</span></div>
          <div class="champ"><label for="cc-email">Votre email</label><input id="cc-email" name="email" type="email" required><span class="err">Un email valide.</span></div></div></div>
        <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;border-top:1px solid rgba(26,21,16,.12);padding-top:1.5rem">
          <span class="t-total" id="cc-total"></span>
          <button type="submit" class="btn" style="--b:var(--encre);color:var(--parchemin);flex:1">Commander la carte</button>
        </div>
        <p style="font-size:.82rem;margin-top:1rem">${CONFIG.paiement.carteCadeau ? 'Vous serez redirigé·e vers un paiement sécurisé.' : 'Je vous envoie un lien de paiement sécurisé, puis la carte dès réception.'}</p>
      </form>
    </div></section>`
  + `<section class="sect"><div class="wrap deux"><div><span class="lbl rv">Questions</span><h2 class="rv" data-d="1">Offrir, <em>simplement</em></h2></div><div class="rv" data-d="2">${faq([
      ['Combien de temps la carte est-elle valable ?', `${CADEAU.validiteMois} mois à partir de l'achat. La personne choisit sa date en me contactant, avec le code de la carte.`],
      ['Et si la personne préfère un autre soin ?', 'La carte peut être échangée contre un autre soin de même valeur, ou servir d\'avoir sur un soin plus long.'],
      ['Qu\'est-ce que le papier ensemencé ?', 'Un papier artisanal qui contient des graines de fleurs sauvages. Une fois la carte utilisée, on la plante en terre : elle fleurit.']])}</div></div></section>`;
}
function apresCadeau(r) {
  const f = $('#cc-form', r); if (!f) return;
  const s = { exp: $('[data-exp][aria-pressed="true"]', r).dataset.exp, th: $('[data-th][aria-pressed="true"]', r).dataset.th, liv: 'email' };
  const maj = () => {
    const x = CADEAU.experiences.find(e => e.id === s.exp), l = CADEAU.livraisons.find(e => e.id === s.liv);
    const prix = x.prix ?? Math.max(30, +f.montant.value || 0);
    const carte = $('#cc-carte', r); carte.dataset.el = s.th;
    $('#cc-titre', r).textContent = x.id === 'libre' ? 'Un moment\nrien que pour toi' : x.nom;
    $('#cc-titre', r).style.whiteSpace = 'pre-line';
    $('#cc-msg', r).textContent = f.message.value ? `« ${f.message.value} »` : '';
    const pour = f.pour.value.trim(), de = f.de.value.trim();
    $('#cc-noms', r).innerHTML = `${pour ? 'Pour ' + esc(pour) : 'Pour …'}<br>${de ? 'de la part de ' + esc(de) : ''}`;
    $('#cc-prix', r).textContent = euros(prix);
    $('#cc-total', r).innerHTML = `<small>Total</small>${euros(prix + l.prix)}`;
    $('#cc-libre', r).hidden = x.id !== 'libre';
    $('#cc-adr', r).hidden = s.liv !== 'poste';
    s.prix = prix + l.prix;
  };
  r.addEventListener('click', e => {
    const b = e.target.closest('button[type=button]'); if (!b) return;
    if (b.dataset.exp) { s.exp = b.dataset.exp; const x = CADEAU.experiences.find(z => z.id === s.exp); s.th = x.element; $$('[data-th]', r).forEach(t => t.setAttribute('aria-pressed', t.dataset.th === s.th)); $$('[data-exp]', r).forEach(t => t.setAttribute('aria-pressed', t === b)); }
    if (b.dataset.th) { s.th = b.dataset.th; $$('[data-th]', r).forEach(t => t.setAttribute('aria-pressed', t === b)); }
    if (b.dataset.liv) { s.liv = b.dataset.liv; $$('[data-liv]', r).forEach(t => t.setAttribute('aria-pressed', t === b)); }
    maj();
  });
  f.addEventListener('input', maj);
  f.onsubmit = async ev => {
    ev.preventDefault();
    if (!valider(f, ['prenom', 'email'])) return;
    const b = $('button[type=submit]', f); b.disabled = true; b.textContent = 'Envoi…';
    const x = CADEAU.experiences.find(e => e.id === s.exp);
    try {
      const res = await envoyer({ objet: `Commande carte cadeau — ${x.nom}`, experience: x.nom, element: s.th, livraison: s.liv, total: s.prix, ...Object.fromEntries(new FormData(f)) });
      if (CONFIG.paiement.carteCadeau && !res.demo) { location.href = CONFIG.paiement.carteCadeau; return; }
      f.innerHTML = merciHTML('Votre carte est en préparation', `Merci ${esc(f.prenom.value)}. Je vous envoie le lien de paiement sécurisé ${CONFIG.reponse}, puis la carte dès réception.`, res.demo);
    } catch (e) { b.disabled = false; b.textContent = 'Erreur — réessayer'; }
  };
  maj();
}

/* ═══ 8. ROUTEUR & DÉMARRAGE ═══════════════════════════════════ */
const ROUTES = {
  '':                  [pageAccueil, apresAccueil, 'Racines & Résonances — Sandrine · Soins sonores & chamaniques'],
  'soins-sonores':     [pageSonores, null, 'Bains & massages sonores'],
  'soins-chamaniques': [pageChamaniques, null, 'Soins chamaniques & énergétiques'],
  'journee-duo':       [pageDuo, apresDuo, 'La Journée Duo'],
  'stages':            [pageStages, apresStages, 'Cercles, cérémonies & stages'],
  'stage':             [pageStage, null, null],
  'carte-cadeau':      [pageCadeau, apresCadeau, 'Carte cadeau'],
  'qui':               [pageQui, null, 'Qui suis-je'],
  'contact':           [pageContact, apresContact, 'Contact'],
  'mentions':          [pageMentions, null, 'Mentions & précautions']
};

function router() {
  const [nom = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  if (nom === 'reserver') { history.replaceState(null, '', '#/'); router(); ouvrirResa({ prestaId: arg }); return; }
  const [vue, apres, titre] = ROUTES[nom] || ROUTES[''];
  const main = $('#contenu');
  defileurs = [];
  Son.tambourOff();
  const contenu = vue(arg);
  main.innerHTML = '';
  typeof contenu === 'string' ? main.insertAdjacentHTML('beforeend', contenu) : main.append(contenu);
  decouperMots(main); braises(main); apparitions(main); parallaxe(main); deroules(main); inclinaison(main);
  apres?.(main);
  const ev = nom === 'stage' && EVTS.find(e => e.id === arg);
  document.title = ev ? `${ev.titre} — Racines & Résonances` : (nom ? `${titre} — Racines & Résonances` : titre);
  $$('.nav-liens a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#/' + nom));
  fermerMenu(); fermerTiroir();
  scrollTo({ top: 0, behavior: 'instant' });
  auDefilement();
  if (sessionStorage.getItem('rr-cible')) { const c = $('#' + sessionStorage.getItem('rr-cible')); sessionStorage.removeItem('rr-cible'); c && setTimeout(() => c.scrollIntoView({ behavior: 'smooth' }), 300); }
}

function fermerMenu() { $('#menu').classList.remove('ouvert'); $('#burger').setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); }

document.addEventListener('click', ev => {
  const resa = ev.target.closest('[data-resa]');
  if (resa) { ev.preventDefault(); fermerMenu(); ouvrirResa({ prestaId: resa.dataset.resa || null }); return; }
  const re = ev.target.closest('[data-resa-evt]');
  if (re) { ev.preventDefault(); ouvrirResa({ evtId: re.dataset.resaEvt }); return; }
  const sc = ev.target.closest('[data-scroll], [data-scroll-accueil]');
  if (sc) {
    ev.preventDefault();
    const id = sc.dataset.scroll || sc.dataset.scrollAccueil, cible = document.getElementById(id);
    if (cible) cible.scrollIntoView({ behavior: 'smooth' });
    else { sessionStorage.setItem('rr-cible', id); location.hash = '#/'; }
  }
});
document.addEventListener('pointerdown', ondeClic);
document.addEventListener('pointermove', e => { const b = e.target.closest?.('.btn'); if (!b) return; const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
document.addEventListener('submit', async ev => {
  const f = ev.target.closest('[data-lettre]'); if (!f) return;
  ev.preventDefault();
  const i = $('input', f); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)) { i.focus(); return; }
  const b = $('button', f); b.disabled = true;
  const res = await envoyer({ objet: 'Inscription — Lettre des saisons', email: i.value }).catch(() => null);
  b.textContent = res ? 'Inscrit·e ✓' : 'Erreur'; i.value = ''; i.placeholder = res?.demo ? 'Merci ! (mode maquette)' : 'Merci, à la prochaine saison.';
});

$('#btn-son').onclick = () => basculerAmbiance();
$('#burger').onclick = () => { const o = !$('#menu').classList.contains('ouvert'); $('#menu').classList.toggle('ouvert', o); $('#burger').setAttribute('aria-expanded', o); document.body.classList.toggle('lock', o); };
$('#t-fermer').onclick = fermerTiroir;
$('#voile').onclick = fermerTiroir;
$('#tiroir').addEventListener('click', clicTiroir);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { fermerTiroir(); fermerMenu(); } });

if (CONFIG.maquette) document.body.insertAdjacentHTML('beforeend', '<a class="ruban" href="../" title="Voir la version actuelle du site"><b>v2</b><span> · maquette · version actuelle ↗</span></a>');

addEventListener('hashchange', router);
router();
})();
