# v2 — Médias : ce qui existe, ce qui manque, comment le produire

## 1. Les 11 photos existantes, réutilisées

Elles sont toutes dans `v2/media/`, converties en WebP. Le dossier passe de 1,9 Mo à 1,2 Mo.

| Fichier v2 | Origine | Où elle sert |
|---|---|---|
| `ponton.webp` | IMG_20231216_154457 | Fond du héros (assombri, zoom lent), Journée Duo, équinoxe |
| `bols-bougies.webp` | IMG_20211123_105521 | Porte Eau, page Bains sonores, bains collectifs |
| `bol.webp` | recadrage du précédent | « Pour vous si… » (bains) |
| `gong-venus.webp` | recadrage de IMG_20211123_105604 | **Gong interactif** de l'accueil |
| `gong.webp` | IMG_20211123_105604 | réserve |
| `tambour-hochet.webp` | IMG_20211123_105018 | Porte Feu, section tambour, stage voyage |
| `autel-tambour.webp` | IMG_20211123_105440 | Héros soins chamaniques, solstice |
| `espace-soin.webp` | IMG_20211123_103425 | Porte Terre, Journée Duo |
| `plumes-herbe.webp` | IMG_20230613_205625, **filigrane « Redmi » retiré** | Porte Souffle, cercles |
| `plume-terre.webp` | IMG_20230415_154911, **filigrane « Redmi » retiré** | Qui suis-je, « un lieu prend forme » |
| `fleur.webp` | IMG_20240403_143542 | Stage voix, contact, carte cadeau |
| `portrait-1.webp`, `portrait-2.webp` | IMG_20200402_* | Qui suis-je, accueil |

## 2. Le logo

À partir de l'image du logo fournie, deux fichiers vectoriels sont tracés dans `v2/media/logo/` : `embleme.svg` (les anneaux et l'arbre-racines) et `nom.svg` (le nom, dans sa typographie d'origine). Ils prennent la couleur du texte autour d'eux, ce qui permet de les afficher sans perte à toutes les tailles :
- en or sur fond sombre (navigation, héros, pied de page, filigrane de la phrase finale) ;
- dans la couleur de l'élément sur la carte cadeau ;
- dans le brun-rouge d'origine (`--brique`, `#6E2B11`) sur l'écran de confirmation.

Dans le héros, le logo est présenté en grand, à gauche, dans un **cartouche** : un cadre double à coins arrondis, qui reprend la forme du logo d'origine. Le cadre s'ouvre à l'arrivée, l'emblème éclot depuis son centre puis respire lentement, et les ondes dorées partent de lui pour traverser toute la page. Il vibre quand on fait sonner le gong ou qu'on entre en écoute. Le nom du cartouche est le titre principal de la page (pour les moteurs de recherche et les lecteurs d'écran).

- `icone-32.png` et `icone-180.png` : l'emblème seul, sur le fond crème du logo, pour l'onglet du navigateur et l'écran d'accueil des téléphones (le nom serait illisible à cette taille).
- `icone-512.png` : le logo complet, utilisé comme image d'aperçu lors d'un partage du lien.

Le nom s'écrit partout « Racines **et** Résonances », comme sur le logo.

## 3. Ce qui est créé par le code (aucun fichier à fournir)

- **Champ de résonance** du héros : ondes dorées concentriques et spores qui montent.
- **Racines** qui poussent au défilement derrière le manifeste. Elles sont générées autrement à chaque visite.
- Motifs des quatre portes : ondes (eau), braises (feu), souffle du sol (terre), lueur flottante (souffle).
- Grain argentique sur tout le site, arc du soleil de la Journée Duo, carte cadeau animée.
- **Sons**, synthétisés dans le navigateur : gong, bol (avec son battement caractéristique), tambour chamanique en boucle, ambiance (bourdon grave, vent, bols espacés). Le son n'est **jamais** lancé sans un geste du visiteur.

Ce choix allège le site et l'ancre dans une démarche artistique propre. Il comble aussi l'absence de vidéo et de son réels, mais il ne les remplace pas (point 3).

## 4. Ce qui manque, par ordre d’impact

### A. À produire soi-même : rien ne peut le remplacer

**1. Enregistrements sonores réels (le plus important).** Le site invite à *écouter*. Le jour où le gong de l'accueil fera entendre le vrai gong de Sandrine, l'expérience changera de nature.
- Le gong (1 frappe, 20 s de résonance), un bol chantant frotté (20 s), un bol frappé, 30 s de tambour chamanique, 30 s de chant.
- Un smartphone suffit : pièce calme, téléphone posé à environ 1 m, mode avion, pas de musique de fond.
- Format MP3 ou M4A. Je remplace ensuite la synthèse par ces fichiers.

**2. Sandrine en pratique.** Les photos actuelles montrent les instruments et les lieux, jamais le geste. Ce sont les images qui créent la confiance et l'envie de prendre rendez-vous. Elles **doivent être réelles** : une image générée de la praticienne ou d'une séance tromperait les futurs clients sur ce qu'ils vont vivre.
- Mains sur le tambour, en forêt, de dos ou de trois-quarts : le visage n'est pas nécessaire.
- Mains qui font chanter un bol, en gros plan.
- L'espace de soin préparé, en lumière de fin de journée, bougies allumées.
- Le cercle des coussins vu d'en haut, avant un cercle de femmes.
- Cadrages : horizontal 3:2 **et** vertical 4:5 pour chaque scène (ordinateur et mobile).

**3. Une vidéo courte en boucle pour le héros** (10 à 15 s, sans son, lente) : un bol rempli d'eau dont la surface vibre, la flamme d'une bougie, ou la main qui frappe le tambour au ralenti. Un smartphone en mode ralenti, sur un trépied ou posé, suffit.

**4. Le paysage local.** Le ponton est très beau. Deux ou trois photos de la forêt autour de Dourdan, à l'aube et en hiver, ancreraient le « Sud-Essonne » dans l'image.

### B. Peut être généré : textures d'ambiance, sans personne

On peut générer des **atmosphères** : brume, braises, eau, racines, ciel de lune. Elles ne montrent ni Sandrine, ni une séance, ni un lieu présenté comme le sien. Deux règles :
- pas de personne générée ;
- une mention « certaines images d'ambiance sont créées numériquement » dans les mentions.

Un générateur d'images et de vidéos (Higgsfield) est connecté à cette session. **Je ne lance rien sans votre accord**, car chaque génération consomme des crédits sur votre compte. Prompts prêts à l'emploi (en anglais, la langue que ces modèles suivent le mieux) :

| Usage | Type | Prompt |
|---|---|---|
| Héros (remplace la photo fixe) | vidéo 8 s, boucle | `Slow cinematic macro of a brass Tibetan singing bowl filled with water, the surface trembling in fine concentric ripples, warm candlelight, very dark background, shallow depth of field, seamless loop, no text, no people` |
| Section tambour | vidéo 6 s | `Macro of glowing embers and small sparks rising slowly from an outdoor fire at night, deep black background, warm orange light, soft bokeh, slow motion, no people` |
| Le seuil (derrière les racines) | image 16:9 | `Close-up of tree roots emerging from dark humus and moss on a forest floor, low raking golden light, rich earthy browns, mist, macro, film grain, no people` |
| Cercles de femmes | image 4:5 | `Thin crescent of a new moon above a misty deciduous forest silhouette, deep indigo night sky, faint stars, silver light, film grain, 35mm, no people` |
| Cérémonies de saison | image 16:9 | `Dawn mist drifting over a small forest pond in northern France in winter, bare trees, soft backlight, muted earthy palette, film grain, no people, no buildings` |
| Carte cadeau | image 3:2 | `Handmade seed paper card with visible wildflower seeds and natural fibers, flat lay on natural linen, soft window daylight, minimal, no text` |

Une fois les fichiers générés, je les intègre, avec le même traitement couleur que les photos (désaturation légère, assombrissement) pour que l'ensemble reste cohérent.

### C. Banques d'images libres (en dépannage)

Unsplash et Pexels proposent des photos sous licence gratuite, utilisables commercialement. Ce sont des recherches utiles pour les mêmes textures (`singing bowl water`, `forest mist dawn`, `embers night`, `tree roots moss`, `new moon forest`). Elles sont moins singulières que des images produites pour le site, et on les retrouve sur d'autres sites de bien-être. À réserver aux ambiances, jamais aux personnes.
