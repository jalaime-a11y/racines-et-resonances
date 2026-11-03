# Racines & Résonances — v2 (maquette)

La v2 vit dans ce dossier. **Le site actuel (`/index.html`, `/images/`) n'est pas modifié.**
Une fois sur `main`, elle est en ligne à l'adresse `…/racines-et-resonances/v2/`. Un petit badge « v2 · maquette » en bas à gauche renvoie vers la version actuelle.

- `CONTENUS-A-VALIDER.md` liste tout ce qui a été proposé : prix, dates, stages, conditions.
- `MEDIAS.md` décrit les médias existants, ceux qui manquent, et comment les produire.

## Structure

```
v2/
├── index.html        navigation, pied de page, tiroir, page d'accueil (gabarit)
├── assets/
│   ├── data.js       ← TOUT LE CONTENU ÉDITABLE (prestations, agenda, stages,
│   │                    disponibilités, carte cadeau, questionnaire, FAQ, config)
│   ├── app.js        moteur : pages, sons, animations, réservation, cadeau
│   └── style.css     direction artistique
└── media/            photos optimisées (WebP)
```

Pages : `#/` accueil · `#/soins-sonores` · `#/soins-chamaniques` · `#/journee-duo` · `#/stages` · `#/stage/<id>` · `#/carte-cadeau` · `#/qui` · `#/contact` · `#/mentions`.

## Modifier un contenu

Tout se fait dans `assets/data.js`. Pour **ajouter une date à l'agenda**, copier un bloc de `EVENEMENTS`, changer `id` et `date`. Pour réutiliser le texte d'un événement existant, ajouter `ref: 'id-de-l-original'` : seuls les champs écrits remplacent ceux de l'original. Les dates passées disparaissent d'elles-mêmes.

## Ce qu'il faut brancher pour passer de maquette à site réel

1. **Formulaires** (réservation, contact, carte cadeau, lettre). Créer un formulaire gratuit sur [Formspree](https://formspree.io), puis coller son adresse dans `CONFIG.formEndpoint`. Chaque demande arrive alors par email, avec tous les détails. Tant que l'adresse contient `VOTRE_ID`, rien n'est envoyé et l'écran de confirmation l'indique.
2. **Paiement** (carte cadeau, acompte de stage). Créer des liens de paiement Stripe, SumUp ou HelloAsso, puis les coller dans `CONFIG.paiement`. Sans eux, Sandrine envoie le lien à la main après la demande.
3. **Agenda en temps réel** (facultatif). Aujourd'hui, les créneaux proposés viennent d'un modèle de semaine (`DISPONIBILITES`) et Sandrine confirme chaque demande. Pour que les clients voient ses vraies disponibilités et réservent directement, il faut un service d'agenda : Cal.com (gratuit) ou Calendly, synchronisé avec son agenda Google. Le choix dépend de la manière dont Sandrine veut travailler.
4. Retirer `<meta name="robots" content="noindex">` de `index.html` et passer `CONFIG.maquette` à `false` le jour où la v2 remplace la v1.

## Accessibilité et sobriété

- Le son ne démarre jamais seul, et le tambour s'arrête quand on quitte sa section.
- Avec le réglage « réduire les animations » du système, toutes les animations sont coupées et le manifeste s'affiche d'un bloc.
- Les animations restent lentes et sans clignotement.
- Aucune bibliothèque externe, à part les polices Google déjà utilisées en v1.
