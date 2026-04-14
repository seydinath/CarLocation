# Atelier Reserve - Location automobile premium

Application React + Vite pour une experience de location de vehicules premium, avec visualisation 3D (React Three Fiber et Sketchfab), tunnel complet de reservation et paiement, et historique client.

## Stack technique

- React 18
- Vite 4
- Three.js + @react-three/fiber + @react-three/drei
- CSS custom (direction artistique luxe)
- LocalStorage pour session et reservations

## Fonctionnalites

- Catalogue vehicules premium avec details complets
- Visualisation 3D:
  - rendu local Three.js pour certains modeles
  - integration Sketchfab iframe pour modeles reels
- Tunnel de reservation:
  - choix dates/agence/creaneau
  - options additionnelles
  - recapitulatif prix en F CFA
- Ecran paiement avec recapitulatif et validation
- Confirmation de reservation
- Historique client filtre (a venir, en cours, archive)

## Lancer en local

Prerequis:
- Node.js 18.18+ (ou plus recent)

Installation:

```bash
npm install
```

Mode developpement:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview local du build:

```bash
npm run serve:dist
```

## Preparation deploiement

Le projet est pret pour un deploiement statique SPA.

Fichiers inclus:
- `netlify.toml` (build + redirect SPA)
- `vercel.json` (build + rewrite SPA)

### Deploiement Netlify

Configuration utilisee:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect SPA: `/* -> /index.html` (200)

Vous pouvez deployer:
1. via interface Netlify (import du repo)
2. ou via Netlify CLI

### Deploiement Vercel

Configuration utilisee:
- Build command: `npm run build`
- Output directory: `dist`
- Rewrite SPA: `/(.*) -> /index.html`

Vous pouvez deployer:
1. via interface Vercel (import du repo)
2. ou via Vercel CLI

## Structure principale

```text
src/
  components/
    CarsFleet.jsx
    CarDetails.jsx
    BookingForm.jsx
    PaymentForm.jsx
    Confirmation.jsx
    MyBookings.jsx
  data/
    cars.js
  utils/
    currency.js
  App.jsx
  styles.css
```

## Notes

- Les prix sont affiches en F CFA.
- Les donnees de session/reservations sont stockees localement dans le navigateur.
- Pour la production, prevoir un backend/API si vous voulez persister les reservations cote serveur.
