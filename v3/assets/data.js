/* ═══════════════════════════════════════════════════════════════
   RACINES & RÉSONANCES — v2 · CONTENUS
   Tout le contenu éditable du site est ici : prestations, agenda,
   stages, disponibilités, carte cadeau, questionnaire, FAQ.
   Les éléments marqués « À VALIDER » sont des propositions de
   premier jet (voir v2/CONTENUS-A-VALIDER.md).
═══════════════════════════════════════════════════════════════ */

const CONFIG = {
  // Point d'envoi des formulaires (Formspree, Getform, Basin…).
  // Tant qu'il contient "VOTRE_ID", le site fonctionne en mode maquette :
  // les parcours vont jusqu'au bout mais rien n'est envoyé.
  formEndpoint: 'https://formspree.io/f/VOTRE_ID_FORMSPREE',
  email: '',            // À VALIDER : adresse affichée sur la page contact
  telephone: '',        // À VALIDER : laissé vide = non affiché
  lieu: 'Sud-Essonne · Dourdan et alentours',
  reponse: 'sous 48 h en semaine',
  // Liens de paiement (Stripe Payment Links, SumUp, HelloAsso…).
  // Vides = la commande devient une demande, Sandrine envoie le lien.
  paiement: { carteCadeau: '', acompteStage: '' },
  maquette: true        // affiche le bandeau « maquette v2 »
};

/* ── LES QUATRE PORTES (éléments) ───────────────────────────────── */
const ELEMENTS = {
  eau:   { nom: 'Eau',   verbe: 'Se laisser porter', couleur: 'var(--eau)' },
  feu:   { nom: 'Feu',   verbe: 'Traverser',         couleur: 'var(--feu)' },
  terre: { nom: 'Terre', verbe: 'S\'enraciner',      couleur: 'var(--terre)' },
  air:   { nom: 'Souffle', verbe: 'Faire entendre sa voix', couleur: 'var(--air)' }
};

/* ── PRESTATIONS RÉSERVABLES ────────────────────────────────────
   mode : 'creneau' (heure précise) · 'jour' (journée entière)
          'groupe' (date + nombre de personnes) · 'devis'          */
const PRESTATIONS = [
  { id: 'bain-individuel', element: 'eau', icone: 'bol', page: 'soins-sonores', mode: 'creneau',
    nom: 'Bain sonore individuel', duree: '1 h 15', prix: 80,
    accroche: 'Allongé·e, couvert·e, vous n\'avez rien à faire qu\'écouter.' },
  { id: 'massage-sonore', element: 'eau', icone: 'eau', page: 'soins-sonores', mode: 'creneau',
    nom: 'Massage sonore', duree: '1 h 15', prix: 80,
    accroche: 'Les bols posés sur le corps : la vibration devient sensation.' },
  { id: 'bain-collectif-prive', element: 'eau', icone: 'gong', page: 'soins-sonores', mode: 'groupe',
    nom: 'Bain sonore entre proches', duree: '2 h', prix: 25, unite: '/pers.', min: 2, max: 6,
    accroche: 'De 2 à 6 personnes, chez moi : un bain rien que pour votre groupe.' },
  { id: 'soin-chamanique', element: 'feu', icone: 'tambour', page: 'soins-chamaniques', mode: 'creneau',
    nom: 'Soin chamanique & énergétique', duree: '1 h 15', prix: 80,
    accroche: 'Le tambour ouvre la porte. Le soin se construit dans l\'instant.' },
  { id: 'journee-duo', element: 'terre', icone: 'duo', page: 'journee-duo', mode: 'jour',
    nom: 'Journée Duo', duree: '10 h – 17 h', prix: 350, unite: ' le duo',
    accroche: 'Une journée entière à deux, entre amies, hors du temps.' },
  { id: 'structure', element: 'air', icone: 'structure', page: 'contact', mode: 'devis',
    nom: 'Intervention en structure', duree: 'Sur mesure', prix: null,
    accroche: 'Associations, crèches, EHPAD : des bains sonores adaptés à tous les publics.' }
];

/* Formules proposées à l'étape 1 de la réservation (séances 80 €) */
const FORMULES = [
  { id: 'unite',  nom: 'Séance à l\'unité',  prix: 80,  detail: '' },
  // À VALIDER : prix de la carte (aujourd'hui « tarif préférentiel sur demande »)
  { id: 'carte3', nom: 'Carte 3 séances', prix: 225, detail: 'soit 75 € la séance · valable 6 mois' }
];

/* ── DISPONIBILITÉS (modèle hebdomadaire) ───────────────────────
   0 = dimanche … 6 = samedi. Les créneaux affichés sont des
   demandes : Sandrine confirme chaque rendez-vous.
   Pour un agenda en temps réel : brancher Cal.com ou Calendly.   */
const DISPONIBILITES = {   // À VALIDER
  horizonJours: 28,
  delaiMinJours: 2,
  creneaux: { 2: ['10:00', '14:00', '17:30'], 4: ['10:00', '14:00', '17:30'], 6: ['10:00', '14:00'] },
  joursDuo: [3, 6, 0],        // mercredi, samedi, dimanche
  fermetures: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01']
};

/* ── AGENDA : CERCLES, CÉRÉMONIES, STAGES, BAINS COLLECTIFS ────── */
const EVENEMENTS = [   // À VALIDER : dates, horaires, prix, jauges
  {
    id: 'cercle-lune-novembre', type: 'cercle', element: 'air', image: 'plumes-herbe',
    titre: 'Cercle de la Lune Nouvelle', sousTitre: 'Cercle de femmes · chant & tambour',
    date: '2026-11-13', debut: '19:30', fin: '22:00', prix: 30, places: 10,
    lieu: 'Chez Sandrine · Sud-Essonne',
    intention: 'À la nouvelle lune, tout recommence dans l\'obscurité. Nous nous asseyons en cercle pour déposer ce qui s\'achève et semer une intention pour le cycle qui vient.',
    programme: [
      ['19:30', 'Accueil, tisane, ouverture du cercle au tambour'],
      ['19:50', 'Parole en cercle : ce que je laisse derrière moi'],
      ['20:30', 'Chants simples, transmis à l\'oreille — aucune technique requise'],
      ['21:15', 'Rituel d\'intention de lune'],
      ['21:45', 'Fermeture du cercle, partage d\'un en-cas']
    ],
    inclus: ['Tisane et en-cas', 'Carnet de chants', 'Bougie d\'intention à emporter'],
    apporter: ['Une tenue confortable', 'Un châle ou un plaid', 'Si vous le souhaitez, un objet qui compte pour vous'],
    pourQui: 'Toutes les femmes, quel que soit leur chemin. Venir une fois ou chaque lune.'
  },
  {
    id: 'bain-collectif-novembre', type: 'bain', element: 'eau', image: 'bols-bougies',
    titre: 'Bain sonore collectif', sousTitre: 'Bols tibétains, cristal & gong',
    date: '2026-11-21', debut: '17:00', fin: '19:00', prix: 25, places: 6,
    lieu: 'Chez Sandrine · Sud-Essonne',
    intention: 'La nuit tombe tôt. Venez vous allonger et laisser les vibrations des bols et du gong dénouer ce que la saison a resserré.',
    programme: [
      ['17:00', 'Accueil, installation sur les matelas, couvertures'],
      ['17:15', 'Respirations et intention'],
      ['17:30', 'Bain sonore — bols, cristal, gong planétaire'],
      ['18:30', 'Retour en douceur, tisane et partage libre']
    ],
    inclus: ['Matelas, coussins et couvertures', 'Tisane'],
    apporter: ['Des chaussettes chaudes', 'Une tenue souple'],
    pourQui: 'Tout le monde, dès 12 ans. Aucune expérience nécessaire.'
  },
  {
    id: 'cercle-lune-decembre', type: 'cercle', element: 'air', image: 'plumes-herbe',
    titre: 'Cercle de la Lune Nouvelle', sousTitre: 'Cercle de femmes · chant & tambour',
    date: '2026-12-11', debut: '19:30', fin: '22:00', prix: 30, places: 10,
    lieu: 'Chez Sandrine · Sud-Essonne', ref: 'cercle-lune-novembre'
  },
  {
    id: 'solstice-hiver', type: 'ceremonie', element: 'feu', image: 'autel-tambour',
    titre: 'Le retour de la lumière', sousTitre: 'Cérémonie du solstice d\'hiver',
    date: '2026-12-21', debut: '19:00', fin: '21:30', prix: 40, places: 12,
    lieu: 'Chez Sandrine · Sud-Essonne (repli au chaud si pluie)',
    intention: 'La nuit la plus longue de l\'année. Au cœur de l\'obscurité, nous allumons ensemble le feu qui annonce le retour de la lumière : on y confie ce que l\'on ne veut pas emporter dans l\'année qui vient.',
    programme: [
      ['19:00', 'Accueil autour du feu, ouverture au tambour'],
      ['19:30', 'Voyage au tambour : ce qui demande à être déposé'],
      ['20:15', 'Rituel du feu — écrire, confier, brûler'],
      ['20:45', 'Chant collectif et premier geste de lumière'],
      ['21:15', 'Soupe chaude partagée']
    ],
    inclus: ['Soupe et boisson chaude', 'Bougie de solstice à emporter'],
    apporter: ['Des vêtements très chauds', 'Une lampe frontale'],
    pourQui: 'Femmes et hommes, à partir de 16 ans. Une première expérience de cérémonie est bienvenue mais pas nécessaire.'
  },
  {
    id: 'cercle-lune-janvier', type: 'cercle', element: 'air', image: 'plumes-herbe',
    titre: 'Cercle de la Lune Nouvelle', sousTitre: 'Cercle de femmes · chant & tambour',
    date: '2027-01-08', debut: '19:30', fin: '22:00', prix: 30, places: 10,
    lieu: 'Chez Sandrine · Sud-Essonne', ref: 'cercle-lune-novembre'
  },
  {
    id: 'bain-collectif-janvier', type: 'bain', element: 'eau', image: 'bols-bougies',
    titre: 'Bain sonore collectif', sousTitre: 'Bols tibétains, cristal & gong',
    date: '2027-01-16', debut: '17:00', fin: '19:00', prix: 25, places: 6,
    lieu: 'Chez Sandrine · Sud-Essonne', ref: 'bain-collectif-novembre'
  },
  {
    id: 'stage-voix', type: 'stage', element: 'air', icone: 'voix', image: 'fleur',
    titre: 'Éveiller sa voix', sousTitre: 'Stage d\'une journée · libération de la voix',
    date: '2027-01-24', debut: '10:00', fin: '17:00', prix: 110, acompte: 40, places: 8,
    lieu: 'Chez Sandrine · Sud-Essonne',
    intention: 'La voix est souvent la première chose que l\'on retient. Pendant une journée, sans jugement et sans technique vocale, nous allons la chercher là où elle s\'est tue — pour retrouver la voix de son âme.',
    programme: [
      ['10:00', 'Cercle d\'ouverture, intention de la journée'],
      ['10:30', 'Corps et souffle : délier ce qui retient le son'],
      ['11:30', 'Sons premiers — bourdonnements, voyelles, résonances'],
      ['12:30', 'Repas partagé'],
      ['14:00', 'Bain sonore : recevoir avant de donner'],
      ['15:00', 'Chants du monde transmis à l\'oreille, chant en cercle'],
      ['16:30', 'Sa propre mélodie : un chant de pouvoir personnel'],
      ['16:50', 'Clôture du cercle']
    ],
    inclus: ['Bain sonore', 'Livret des chants', 'Enregistrement audio du chant collectif'],
    apporter: ['Un plat à partager', 'Une gourde', 'Une tenue souple et des chaussettes'],
    pourQui: 'Celles et ceux qui « ne savent pas chanter », qu\'on a fait taire, ou qui sentent que leur voix a quelque chose à dire. Aucune expérience requise.'
  },
  {
    id: 'stage-voyage', type: 'stage', element: 'feu', icone: 'tambour', image: 'tambour-hochet',
    titre: 'Voyage au tambour', sousTitre: 'Stage d\'initiation · rencontrer son animal de pouvoir',
    date: '2027-03-13', debut: '10:00', fin: '17:00', prix: 120, acompte: 40, places: 8,
    lieu: 'Chez Sandrine et en forêt proche · Sud-Essonne',
    intention: 'Le battement régulier du tambour ouvre un état de conscience où l\'on voyage vers ses propres ressources. Une journée pour apprendre ce chemin, en sécurité, et revenir avec un allié.',
    programme: [
      ['10:00', 'Ouverture du cercle, cadre et sécurité du voyage'],
      ['10:30', 'Le tambour : écouter, battre, se laisser porter'],
      ['11:15', 'Premier voyage guidé vers le monde d\'en bas'],
      ['12:30', 'Repas partagé'],
      ['14:00', 'Marche en forêt : se relier au vivant'],
      ['15:00', 'Voyage à la rencontre de son animal de pouvoir'],
      ['16:00', 'Partage, ancrage, comment poursuivre seul·e'],
      ['16:45', 'Clôture']
    ],
    inclus: ['Prêt d\'un tambour pour la journée', 'Enregistrement de tambour pour voyager chez soi', 'Fiche « voyager en sécurité »'],
    apporter: ['Un foulard pour couvrir les yeux', 'Un plat à partager', 'Des chaussures de marche'],
    pourQui: 'Toute personne curieuse du chamanisme, sans prérequis. Déconseillé en cas de fragilité psychique non accompagnée.'
  },
  {
    id: 'equinoxe-printemps', type: 'ceremonie', element: 'terre', image: 'ponton',
    titre: 'Ce qui germe', sousTitre: 'Cérémonie de l\'équinoxe de printemps',
    date: '2027-03-20', debut: '15:00', fin: '18:00', prix: 40, places: 12,
    lieu: 'En forêt, près de Dourdan (lieu précis communiqué à l\'inscription)',
    intention: 'Le jour et la nuit s\'équilibrent. Nous marchons jusqu\'à l\'eau, nous plantons une graine et nous chantons pour ce qui veut naître.',
    programme: [
      ['15:00', 'Rendez-vous à l\'orée du bois, marche silencieuse'],
      ['15:45', 'Ouverture au tambour au bord de l\'eau'],
      ['16:15', 'Rituel de la graine : ce que je fais naître'],
      ['17:00', 'Chant d\'équinoxe, offrande à la terre'],
      ['17:30', 'Goûter partagé']
    ],
    inclus: ['Graine et pot en terre à emporter', 'Goûter'],
    apporter: ['Des chaussures de marche', 'Un vêtement de pluie'],
    pourQui: 'Toutes et tous, enfants bienvenus à partir de 8 ans accompagnés.'
  }
];

const TYPES_EVENEMENT = {
  cercle:    { nom: 'Cercle de femmes', pluriel: 'Cercles', icone: 'lune' },
  ceremonie: { nom: 'Cérémonie',        pluriel: 'Cérémonies', icone: 'saisons' },
  stage:     { nom: 'Stage',            pluriel: 'Stages', icone: 'plume' },
  bain:      { nom: 'Bain collectif',   pluriel: 'Bains collectifs', icone: 'bol' }
};

/* ── CARTE CADEAU ─────────────────────────────────────────────── */
const CADEAU = {
  validiteMois: 12,          // À VALIDER
  experiences: [
    { id: 'bain',   nom: 'Bain sonore individuel',          prix: 80,  element: 'eau', icone: 'bol' },
    { id: 'massage',nom: 'Massage sonore',                  prix: 80,  element: 'eau', icone: 'eau' },
    { id: 'soin',   nom: 'Soin chamanique & énergétique',   prix: 80,  element: 'feu', icone: 'tambour' },
    { id: 'carte3', nom: 'Carte 3 séances au choix',        prix: 225, element: 'eau', icone: 'gong' },
    { id: 'duo',    nom: 'Journée Duo',                     prix: 350, element: 'terre', icone: 'duo' },
    { id: 'cercle', nom: 'Cercle de la Lune Nouvelle',      prix: 30,  element: 'air', icone: 'lune' },
    { id: 'libre',  nom: 'Montant libre',                   prix: null, element: 'air', icone: 'cadeau' }
  ],
  livraisons: [            // À VALIDER
    { id: 'email', nom: 'E-carte par email', detail: 'PDF à imprimer ou à transférer · immédiat après paiement', prix: 0 },
    { id: 'poste', nom: 'Carte imprimée sur papier ensemencé', detail: 'Envoyée par la poste sous 3 jours · elle se plante après usage', prix: 4 },
    { id: 'main',  nom: 'Remise en main propre', detail: 'À Dourdan, sur rendez-vous', prix: 0 }
  ]
};

/* ── QUESTIONNAIRE « QUEL SOIN POUR MOI ? » ─────────────────────── */
const QUIZ = [
  { q: 'Ce qui vous amène, en ce moment…',
    r: [ ['J\'ai besoin de me poser, de relâcher la pression', { eau: 2 }],
         ['Je traverse un passage difficile, je me sens bloqué·e', { feu: 2 }],
         ['J\'ai envie de vivre un moment fort avec une proche', { terre: 2 }],
         ['Je veux retrouver ma voix, partager en cercle', { air: 2 }] ] },
  { q: 'Vous aimez recevoir…',
    r: [ ['Allongé·e, sans rien avoir à faire', { eau: 2 }],
         ['Accompagné·e pas à pas, en confiance', { feu: 2 }],
         ['Dehors, au contact de la nature', { terre: 2, air: 1 }],
         ['Portée par l\'énergie d\'un groupe', { air: 2, eau: 1 }] ] },
  { q: 'Le temps que vous voulez vous offrir…',
    r: [ ['Une heure, rien que pour moi', { eau: 1, feu: 1 }],
         ['Une soirée', { air: 1, eau: 1 }],
         ['Une journée entière', { terre: 2, air: 1 }] ] }
];

const QUIZ_RESULTATS = {
  eau:   { titre: 'Le bain sonore', texte: 'Votre corps demande à déposer. Allongé·e au milieu des bols, vous n\'avez rien à faire : la vibration fait le chemin pour vous.', lien: 'soins-sonores', resa: 'bain-individuel' },
  feu:   { titre: 'Le soin chamanique', texte: 'Quelque chose demande à être traversé. Le tambour ouvre la porte, et nous allons ensemble, à votre rythme, vers ce qui veut guérir.', lien: 'soins-chamaniques', resa: 'soin-chamanique' },
  terre: { titre: 'La Journée Duo', texte: 'Vous avez besoin de temps, de nature et d\'une présence aimée à vos côtés. Une journée entière pour vous retrouver à deux.', lien: 'journee-duo', resa: 'journee-duo' },
  air:   { titre: 'Les cercles & stages', texte: 'Votre voix et le collectif vous appellent. Le cercle de la Lune Nouvelle est une très belle première porte.', lien: 'stages', resa: null }
};

/* ── TÉMOIGNAGES ──────────────────────────────────────────────────
   Emplacements réservés : à remplacer par de vrais témoignages
   recueillis avec accord. Tant que exemple:true, ils sont signalés. */
const TEMOIGNAGES = [
  { texte: 'Texte du témoignage à recueillir — ce que la personne a ressenti pendant le bain sonore, et ce qui a changé après.', auteur: 'Prénom', soin: 'Bain sonore', exemple: true },
  { texte: 'Texte du témoignage à recueillir — un moment précis du soin chamanique qui l\'a marquée.', auteur: 'Prénom', soin: 'Soin chamanique', exemple: true },
  { texte: 'Texte du témoignage à recueillir — deux amies racontent leur Journée Duo.', auteur: 'Prénoms', soin: 'Journée Duo', exemple: true }
];

/* ── FAQ ─────────────────────────────────────────────────────── */
const FAQ = {
  general: [
    ['Je n\'ai jamais fait ça. Est-ce pour moi ?', 'Oui. Aucune expérience n\'est nécessaire, ni aucune croyance particulière. Nous prenons toujours un temps d\'échange avant de commencer, pour que vous sachiez exactement ce qui va se passer.'],
    ['Comment se passe la réservation ?', 'Vous choisissez un créneau et m\'envoyez votre demande. Je vous réponds personnellement ' + 'sous 48 h' + ' pour confirmer, et nous échangeons si vous avez des questions. Rien n\'est automatique : c\'est une rencontre.'],
    ['Et si je dois annuler ?', 'Vous pouvez reporter ou annuler sans frais jusqu\'à 48 h avant la séance. Pour les stages, l\'acompte est remboursé jusqu\'à 7 jours avant.'], // À VALIDER
    ['Comment m\'habiller ?', 'Une tenue confortable et des chaussettes chaudes. Je fournis matelas, coussins et couvertures.'],
    ['Et si des émotions fortes remontent ?', 'C\'est possible, et c\'est accueilli. Vous pouvez interrompre à tout moment. Je reste présente jusqu\'à ce que vous vous sentiez prêt·e à repartir.'],
    ['Ces pratiques remplacent-elles un suivi médical ?', 'Non. Ce sont des pratiques de bien-être et d\'accompagnement personnel. Elles ne remplacent ni un diagnostic, ni un traitement, ni un suivi médical ou psychologique.']
  ],
  sonore: [
    ['Y a-t-il des contre-indications ?', 'Par précaution, les bains et massages sonores sont déconseillés en cas de grossesse au 1er trimestre, de pacemaker, de troubles cardiaques graves, d\'épilepsie ou d\'opération récente. En cas de doute, demandez l\'avis de votre médecin.'],
    ['Quelle différence entre bain et massage sonore ?', 'Dans le bain, les bols sont disposés autour de vous. Dans le massage, certains sont posés directement sur le corps : la vibration se ressent physiquement, de l\'intérieur.']
  ],
  chamanique: [
    ['Que se passe-t-il pendant un soin ?', 'Il n\'y a pas de déroulé écrit d\'avance. Après un temps d\'échange, le tambour ouvre le soin ; je suis ce que je perçois, avec les instruments, le chant, le pendule. Vous restez habillé·e, allongé·e ou assis·e.'],
    ['Vais-je « voir » quelque chose ?', 'Peut-être, peut-être pas. Certaines personnes ont des images, d\'autres des sensations, d\'autres rien de particulier sur le moment. Tout est juste.']
  ]
};
