# v2 — Contenus à valider

Tout ce qui suit a été **proposé pour la maquette**, sans venir du site actuel ni d'une décision de Sandrine. Chaque point se modifie dans `assets/data.js`, sauf mention contraire.

Les textes repris tels quels de la v1 (parcours, éthique, déroulés, tarifs à 80 €, 25 € et 350 €, contre-indications) ne sont pas listés.

---

## 1. Prix proposés

| Élément | Proposé | Situation v1 |
|---|---|---|
| Carte 3 séances (sonores ou soins) | 225 € (75 €/séance), valable 6 mois | « Tarif préférentiel, sur demande » |
| Cercle de la Lune Nouvelle | 30 € | n'existait pas |
| Cérémonies de saison | 40 € | n'existait pas |
| Stage « Éveiller sa voix » | 110 €, acompte 40 € | n'existait pas |
| Stage « Voyage au tambour » | 120 €, acompte 40 € | n'existait pas |
| Carte cadeau montant libre | dès 30 € | n'existait pas |
| Carte imprimée envoyée par la poste | + 4 € | n'existait pas |

## 2. Agenda (dates, horaires, jauges)

Les dates s'appuient sur le calendrier réel : nouvelles lunes du 9 nov., 9 déc. 2026 et 7 janv. 2027, solstice du 21 déc. 2026, équinoxe du 20 mars 2027. Chaque cercle est placé le vendredi le plus proche.

| Date | Rencontre | Horaire | Jauge |
|---|---|---|---|
| ven. 13 nov. 2026 | Cercle de la Lune Nouvelle | 19 h 30 – 22 h | 10 |
| sam. 21 nov. 2026 | Bain sonore collectif | 17 h – 19 h | 6 |
| ven. 11 déc. 2026 | Cercle de la Lune Nouvelle | 19 h 30 – 22 h | 10 |
| lun. 21 déc. 2026 | Cérémonie du solstice « Le retour de la lumière » | 19 h – 21 h 30 | 12 |
| ven. 8 janv. 2027 | Cercle de la Lune Nouvelle | 19 h 30 – 22 h | 10 |
| sam. 16 janv. 2027 | Bain sonore collectif | 17 h – 19 h | 6 |
| dim. 24 janv. 2027 | Stage « Éveiller sa voix » | 10 h – 17 h | 8 |
| sam. 13 mars 2027 | Stage « Voyage au tambour » | 10 h – 17 h | 8 |
| sam. 20 mars 2027 | Cérémonie d'équinoxe « Ce qui germe » | 15 h – 18 h | 12 |

Les événements passés disparaissent d'eux-mêmes de l'agenda. Le site n'affiche **pas** de « places restantes » : un compteur inventé serait une pression commerciale contraire à l'éthique du site. Il ne sera affiché que lorsqu'un vrai suivi des inscriptions existera.

## 3. Contenu des stages et cérémonies

Les **programmes horaires, intentions, « inclus », « à apporter » et « pour qui »** de chaque rencontre sont des premiers jets écrits pour la maquette. Points qui engagent Sandrine :

- **Stage voix** : enregistrement audio du chant collectif, livret de chants, « chant de pouvoir personnel ».
- **Stage voyage** : prêt d'un tambour à chaque participant, enregistrement de tambour à emporter, marche en forêt. La mention « déconseillé en cas de fragilité psychique non accompagnée » est à confirmer.
- **Solstice** : un feu en extérieur (autorisation, météo, lieu de repli), une soupe offerte.
- **Équinoxe** : en forêt près de Dourdan, graine et pot offerts, enfants dès 8 ans.
- **Bain collectif** : « dès 12 ans ».
- **Cercles** : réservés aux femmes, carnet de chants et bougie offerts.

## 4. Journée Duo

- **Programme horaire** proposé : accueil 10 h, bain sonore à deux 11 h, déjeuner 12 h 30, marche et rituel au bord de l'eau 14 h, soin au tambour 15 h 30, cercle de clôture 16 h 30. La v1 disait seulement « rituels, instruments, forêt ou chez moi ».
- **Déjeuner inclus** : qui le prépare ? « Déjeuner de saison, partagé » reste volontairement flou.
- **« Mère et fille »** a été ajouté aux exemples de duos.

## 5. Disponibilités (réservation)

Le modèle de semaine, inventé pour la maquette, se règle dans `DISPONIBILITES` :

- Soins individuels : **mardi et jeudi à 10 h, 14 h et 17 h 30, samedi à 10 h et 14 h**.
- Journée Duo et bains entre proches : **mercredi, samedi, dimanche**.
- Délai minimum : 2 jours. Horizon : 4 semaines. Fermetures : 24-25 et 31 déc., 1er janv.

Ce ne sont **pas** de vraies disponibilités : le client envoie une *demande*, que Sandrine confirme. Pour un agenda en temps réel, voir `README.md` (Cal.com).

## 6. Conditions (affichées dans la FAQ et les mentions)

- Report ou annulation sans frais **jusqu'à 48 h** avant une séance.
- Acompte de stage **remboursé jusqu'à 7 jours** avant.
- Carte cadeau **valable 12 mois**, échangeable contre un soin de même valeur.
- Paiement **à la confirmation**, jamais au moment de la demande.

## 7. Carte cadeau

- **Papier ensemencé** (carte qui se plante) : trouver un fournisseur, ou retirer l'option.
- **Remise en main propre à Dourdan** : à confirmer.

## 8. Engagements nouveaux

- **Lettre des saisons** : une lettre à chaque solstice et équinoxe, soit 4 par an. Il faut l'écrire, ou renommer la promesse.
- **Intervention en structure** : le texte ajoute « séances au sol ou assises, durée et volume ajustés ».

## 9. Textes écrits « dans la voix de Sandrine »

Ces phrases sont nouvelles. Elles sont à relire pour vérifier que Sandrine s'y reconnaît :

- L'accroche du héros : « Un tambour, un souffle, une vibration — pour revenir à vous quand la vie s'est figée. »
- Le manifeste du seuil (6 lignes, dans `index.html`).
- Les descriptions des quatre portes, des six outils du soin (dont **kila** : « pour trancher les liens qui ne vous servent plus » ; **voyage** : « je voyage pour vous »), et les listes « Pour vous si… ».
- « Sandrine, passeuse de vibrations. »
- La phrase « Je ne prends jamais le pouvoir sur le chemin de quelqu'un. Je le facilite. », reformulée à partir de la v1.

## 10. Témoignages

Les trois emplacements sont **vides et signalés** (« à recueillir »). Aucun témoignage n'a été inventé. Il faut en recueillir 3 réels, avec l'accord écrit des personnes (prénom seul suffit), puis passer `exemple: true` à `false`.

## 11. Informations pratiques manquantes

- Adresse email et téléphone à afficher (`CONFIG.email`, `CONFIG.telephone`).
- Identifiant du formulaire (`CONFIG.formEndpoint`). Sans lui, le site reste en **mode maquette** : les parcours vont jusqu'au bout mais rien n'est envoyé.
- Liens de paiement (`CONFIG.paiement`).
- Hébergeur définitif (page mentions).
