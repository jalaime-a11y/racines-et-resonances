"""Jeu d'icônes Racines et Résonances : 28 pictogrammes au trait, 48×48, couleur libre.
Style « Sceau » : le pictogramme dans deux anneaux légèrement irréguliers, en écho aux ondes.
Usage : python3 v2/outils/generer-icones.py v2/assets/icones.svg"""
import math, random, os, json, html

ICI = os.path.dirname(os.path.abspath(__file__))

def cercle_de_femmes():
    pts = []
    for k in range(7):
        a = -math.pi / 2 + k * 2 * math.pi / 7
        pts.append(f'<circle cx="{24 + 15 * math.cos(a):.1f}" cy="{24 + 15 * math.sin(a):.1f}" r="2.6"/>')
    flamme = '<path d="M24 30c-2.6 0-4.2-1.8-4.2-4 0-2.6 2.4-4.2 3.2-7 1.8 1.6 5.2 4.2 5.2 7 0 2.2-1.6 4-4.2 4z"/>'
    return ''.join(pts) + flamme

def roue():
    s = ''
    for k in range(4):
        a0, a1 = math.radians(k * 90 + 12), math.radians(k * 90 + 78)
        x0, y0, x1, y1 = 24 + 17 * math.cos(a0), 24 + 17 * math.sin(a0), 24 + 17 * math.cos(a1), 24 + 17 * math.sin(a1)
        s += f'<path d="M{x0:.1f} {y0:.1f}A17 17 0 0 1 {x1:.1f} {y1:.1f}"/>'
        s += f'<circle cx="{24 + 17 * math.cos(math.radians(k * 90)):.1f}" cy="{24 + 17 * math.sin(math.radians(k * 90)):.1f}" r="1.3" class="pt"/>'
    s += '<circle cx="24" cy="24" r="4.6"/>'
    for k in range(8):
        a = math.radians(k * 45 + 22.5)
        s += f'<path d="M{24 + 7.4 * math.cos(a):.1f} {24 + 7.4 * math.sin(a):.1f}L{24 + 10 * math.cos(a):.1f} {24 + 10 * math.sin(a):.1f}"/>'
    return s

ICONES = [
    # ── les quatre éléments
    ('eau', 'Eau', 'Éléments',
     '<path d="M24 6s-10 11.5-10 18.5a10 10 0 0 0 20 0C34 17.5 24 6 24 6z"/>'
     '<ellipse cx="24" cy="42" rx="8" ry="1.8"/><ellipse cx="24" cy="42" rx="15" ry="3.4"/>'),
    ('feu', 'Feu', 'Éléments',
     '<path d="M24 42c-7 0-12-4.6-12-11 0-6.4 5-9.4 6.2-15.6 3 2.6 4.2 5.6 4.2 8.6 2-2.6 2.4-7.4 1.2-11.6 7.4 4 12.4 11 12.4 18.6 0 6.4-5 11-12 11z"/>'
     '<path d="M24 42c-3 0-5-2-5-4.8 0-3 2.8-4.6 3.8-7.6 2 1.8 6.2 4.6 6.2 7.6 0 2.8-2 4.8-5 4.8z"/>'),
    ('terre', 'Terre', 'Éléments',
     '<path d="M6 20h36"/><path d="M24 20v-8"/><path d="M24 15c-2.6-3.8-6.6-4.4-8.4-3.4 1 3.8 5 5.2 8.4 3.4z"/><path d="M24 13c2.6-3.8 6.6-4.4 8.4-3.4-1 3.8-5 5.2-8.4 3.4z"/>'
     '<path d="M24 20v7c0 4.4-3.6 7-6.4 11"/><path d="M24 25c1.8 3.4 5.8 4.6 7 10"/><path d="M24 22c-3.2 2-7.6 2-11.4 5.4"/><path d="M24 23c3.2 1 7.4 1.2 10.6 4.4"/><path d="M17.6 38c-.6 1.6-.8 2.8-.6 4"/>'),
    ('souffle', 'Souffle', 'Éléments',
     '<path d="M6 19h21a5 5 0 1 0-5-5"/><path d="M6 27h29a5.5 5.5 0 1 1-5.5 5.5"/><path d="M10 35h11"/>'),
    # ── pratiques et instruments
    ('bol', 'Bol chantant', 'Pratiques',
     '<path d="M8 25h32c0 8.6-7.2 14-16 14S8 33.6 8 25z"/><path d="M19 39.5h10"/>'
     '<path d="M16 19.5c5-3.6 11-3.6 16 0"/><path d="M12 14.5c7.4-5.4 16.6-5.4 24 0"/>'),
    ('gong', 'Gong', 'Pratiques',
     '<path d="M9 42V9h30v33"/><path d="M5 42h8M35 42h8"/><path d="M19 9v6M29 9v6"/>'
     '<circle cx="24" cy="26" r="10"/><circle cx="24" cy="26" r="3.4"/>'),
    ('tambour', 'Tambour', 'Pratiques',
     '<ellipse cx="22" cy="24" rx="16" ry="9.5"/><path d="M6 24v5.5c0 5.2 7.2 9.5 16 9.5s16-4.3 16-9.5V24"/>'
     '<ellipse cx="22" cy="24" rx="10" ry="5.6" stroke-dasharray="1.4 3"/><path d="M31.6 19.4L44 7"/><circle cx="30" cy="21" r="2.6"/>'),
    ('hochet', 'Hochet', 'Pratiques',
     '<path d="M24 26c-6 0-9.4-4.6-9.4-10.4S18.4 5 24 5s9.4 4.8 9.4 10.6S30 26 24 26z"/><path d="M22 26v17h4V26"/><path d="M22 31h4M22 35h4"/>'
     '<circle cx="21" cy="13" r="1.1" class="pt"/><circle cx="26.4" cy="15" r="1.1" class="pt"/><circle cx="22.6" cy="19.2" r="1.1" class="pt"/>'
     '<path d="M9.6 9.4c-1.8 3.6-1.8 8.8 0 12.4M38.4 9.4c1.8 3.6 1.8 8.8 0 12.4"/>'),
    ('pendule', 'Pendule', 'Pratiques',
     '<path d="M24 5v19"/><circle cx="24" cy="5" r="1.4" class="pt"/><path d="M24 24l-4.6 6.4L24 40l4.6-9.6z"/>'
     '<path d="M10 37.5c8 6 20 6 28 0" stroke-dasharray="1.5 3.2"/>'),
    ('plume', 'Plume', 'Pratiques',
     '<path d="M39 7C23 9 13 21 12.6 35.4L8 41"/><path d="M39 7c-1.8 14.6-12 24.6-26.4 28.4"/>'
     '<path d="M17.4 30.4l7.2-.8M21.4 24.2l8-1M25.6 18.2l7.8-1.2"/>'),
    # ── rencontres
    ('lune', 'Lune nouvelle', 'Rencontres',
     '<path d="M29 8a16.5 16.5 0 1 0 11 28.4A13.5 13.5 0 0 1 29 8z"/><path d="M38 9v4M36 11h4"/><circle cx="42" cy="20" r="1" class="pt"/>'),
    ('cercle', 'Cercle de femmes', 'Rencontres', cercle_de_femmes()),
    ('voix', 'Voix & chant', 'Rencontres',
     '<path d="M12 6c7 1 10 7 9 13l3 6-3 1v4c0 2-2 3-4 3h-2v7"/>'
     '<path d="M28.5 23.5a6 6 0 0 1 0 8"/><path d="M32.5 19.5a12 12 0 0 1 0 16"/><path d="M36.5 15.5a18 18 0 0 1 0 24"/>'),
    ('duo', 'Journée Duo', 'Rencontres',
     '<circle cx="18.5" cy="25" r="11"/><circle cx="29.5" cy="25" r="11"/><path d="M24 9v-4M18.5 10.5l-1.6-3M29.5 10.5l1.6-3"/>'),
    ('saisons', 'Roue de l\'année', 'Rencontres', roue()),
    # ── informations pratiques
    ('horaire', 'Horaires', 'Infos pratiques',
     '<path d="M5 36h38"/><path d="M10 36a14 14 0 0 1 28 0" stroke-dasharray="1.5 3.2"/><circle cx="31" cy="23.9" r="3.6"/>'
     '<path d="M31 16.6v-2.2M37.4 20.2l1.8-1.2M24.6 20.2l-1.8-1.2"/><path d="M14 41h20"/>'),
    ('lieu', 'Lieu', 'Infos pratiques',
     '<path d="M24 43s-12-11.6-12-21a12 12 0 0 1 24 0c0 9.4-12 21-12 21z"/>'
     '<path d="M24 28v-9"/><path d="M24 21.4c-2-3-5-3.4-6.4-2.6.8 3 3.8 4 6.4 2.6zM24 20c2-3 5-3.4 6.4-2.6-.8 3-3.8 4-6.4 2.6z"/>'),
    ('groupe', 'Groupe', 'Infos pratiques',
     '<circle cx="24" cy="15" r="4.4"/><path d="M15.6 31a8.4 8.4 0 0 1 16.8 0"/><circle cx="11" cy="21" r="3.4"/><path d="M4.4 34a6.6 6.6 0 0 1 11.6-4.2"/>'
     '<circle cx="37" cy="21" r="3.4"/><path d="M43.6 34A6.6 6.6 0 0 0 32 29.8"/><path d="M8 40c10.4 3 21.6 3 32 0"/>'),
    ('calendrier', 'Agenda', 'Infos pratiques',
     '<rect x="7" y="10" width="34" height="31" rx="3.5"/><path d="M7 18h34M16 6v8M32 6v8"/>'
     '<path d="M27 26.6a5 5 0 1 0 0 8.8 4 4 0 0 1 0-8.8z"/>'),
    ('ecoute', 'Écouter', 'Infos pratiques',
     '<circle cx="11" cy="24" r="3.2"/><path d="M18.5 17.5a9.5 9.5 0 0 1 0 13"/><path d="M24.5 12a17 17 0 0 1 0 24"/><path d="M30.5 6.6a24.5 24.5 0 0 1 0 34.8"/>'),
    ('cadeau', 'Carte cadeau', 'Infos pratiques',
     '<rect x="6" y="15" width="36" height="24" rx="3"/><path d="M18 15v24M6 23h36"/>'
     '<path d="M18 15c-1.8-5.4-8.4-6.4-8.4-2.4 0 3 6 3.2 8.4 2.4zM18 15c1.8-5.4 8.4-6.4 8.4-2.4 0 3-6 3.2-8.4 2.4z"/>'
     '<path d="M31 34v-5"/><path d="M31 30.4c-1.6-2.2-4-2.4-5-1.8.6 2.2 3 3 5 1.8zM31 29.4c1.6-2.2 4-2.4 5-1.8-.6 2.2-3 3-5 1.8z"/>'),
    ('duree', 'Durée', 'Infos pratiques',
     '<path d="M15 6h18M15 42h18"/><path d="M17 6c0 9 14 9 14 18s-14 9-14 18"/><path d="M31 6c0 9-14 9-14 18s14 9 14 18"/>'
     '<path d="M21 38c1-2 2.4-3 3-3s2 1 3 3"/>'),
    ('structure', 'En structure', 'Infos pratiques',
     '<path d="M7 22L24 8l17 14"/><path d="M11 19v22h26V19"/><path d="M20 41v-8a4 4 0 0 1 8 0v8"/>'
     '<path d="M24 25.6c-1.4-1.8-4-1-4 .9 0 1.8 4 4 4 4s4-2.2 4-4c0-1.9-2.6-2.7-4-.9z"/>'),
    ('contact', 'Écrire', 'Infos pratiques',
     '<rect x="5" y="13" width="34" height="23" rx="3"/><path d="M5.6 15l16.4 12 16.4-12"/>'
     '<path d="M44 6c-5 .6-9.4 4.4-10.4 10.6L32.4 19"/><path d="M44 6c-.6 5-4.4 8.8-10.4 10.6"/>'),
]

def anneau(r, seed, amp=.45):
    rnd = random.Random(seed)
    n = 64
    ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    pts = []
    for i in range(n + 1):
        a = i / n * 2 * math.pi
        rr = r + amp * (math.sin(3 * a + ph[0]) + .6 * math.sin(5 * a + ph[1]) + .4 * math.sin(7 * a + ph[2]))
        pts.append((24 + rr * math.cos(a), 24 + rr * math.sin(a)))
    return 'M' + 'L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + 'Z'

def spirale():
    pts = []
    for i in range(0, 181):
        t = i / 180 * 3 * 2 * math.pi
        r = 1.2 + 15.5 * i / 180
        pts.append((24 + r * math.cos(t), 24 + r * math.sin(t)))
    return '<path d="M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + '"/><circle cx="24" cy="24" r="1.2" class="pt"/>'

ICONES += [
    ('tarif', 'Tarif', 'Infos pratiques',
     '<path d="M17 18c-6 4.6-9.4 10.6-9.4 15.4 0 5.8 7.2 8.6 16.4 8.6s16.4-2.8 16.4-8.6c0-4.8-3.4-10.8-9.4-15.4"/>'
     '<path d="M16 18h16"/><path d="M18 18l-3.4-9c3.2 1.4 6.4 1.6 9.4-.4 3 2 6.2 1.8 9.4.4L30 18"/>'
     '<path d="M24 37v-8"/><path d="M24 31.4c-1.8-2.4-4.6-2.8-5.8-2 .6 2.4 3.4 3.4 5.8 2zM24 30.2c1.8-2.4 4.6-2.8 5.8-2-.6 2.4-3.4 3.4-5.8 2z"/>'),
    ('voyage', 'Voyage chamanique', 'Pratiques', spirale()),
    ('animal', 'Animal de pouvoir', 'Pratiques',
     '<path d="M24 42c-6.4 0-11-3-11-7.6 0-4.4 4.6-9.4 11-9.4s11 5 11 9.4c0 4.6-4.6 7.6-11 7.6z"/>'
     '<ellipse cx="11" cy="21" rx="3.4" ry="4.6" transform="rotate(-25 11 21)"/><ellipse cx="19" cy="12.6" rx="3.4" ry="4.8" transform="rotate(-8 19 12.6)"/>'
     '<ellipse cx="29" cy="12.6" rx="3.4" ry="4.8" transform="rotate(8 29 12.6)"/><ellipse cx="37" cy="21" rx="3.4" ry="4.6" transform="rotate(25 37 21)"/>'),
    ('kila', 'Kila', 'Pratiques',
     '<circle cx="24" cy="7.4" r="3"/><path d="M21.6 10.4h4.8v12h-4.8z"/><path d="M21.6 14.4h4.8M21.6 18.4h4.8"/>'
     '<path d="M16 22.4h16"/><path d="M16 22.4c-2.4 0-3.4-2.4-2-3.6M32 22.4c2.4 0 3.4-2.4 2-3.6"/>'
     '<path d="M19 22.4L24 43l5-20.6"/><path d="M24 22.4V43"/>'),
]

STYLE_TRAIT = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'

def svg_trait(corps):
    return f'<svg viewBox="0 0 48 48" {STYLE_TRAIT}>{corps}</svg>'

def svg_sceau(corps, k):
    return (f'<svg viewBox="0 0 48 48" {STYLE_TRAIT}>'
            f'<path d="{anneau(22.4, k)}" stroke-width="1.1"/><path d="{anneau(20, k + 99, .3)}" stroke-width=".7" opacity=".55"/>'
            f'<g transform="translate(24 24) scale(.6) translate(-24 -24)" stroke-width="2.4">{corps}</g></svg>')


def sprite():
    out = ['<svg xmlns="http://www.w3.org/2000/svg">']
    for k, (i, n, g, c) in enumerate(ICONES):
        c = c.replace(' class="pt"', ' fill="currentColor" stroke="none"')
        out.append(f'<symbol id="{i}" viewBox="0 0 48 48"><title>{html.escape(n)}</title><g {STYLE_TRAIT}>'
                   f'<path d="{anneau(22.4, k)}" stroke-width="1.1"/><path d="{anneau(20, k + 99, .3)}" stroke-width=".7" opacity=".55"/>'
                   f'<g transform="translate(24 24) scale(.6) translate(-24 -24)" stroke-width="2.4">{c}</g></g></symbol>')
    out.append('</svg>')
    return '\n'.join(out)

if __name__ == '__main__':
    import sys
    cible = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ICI, 'icones.svg')
    open(cible, 'w', encoding='utf-8').write(sprite())
    print(len(ICONES), 'icônes →', cible)
