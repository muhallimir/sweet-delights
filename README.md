# Sweet Delights | Homemade Sweets and Fiesta Catering

Bakery storefront for a Filipino homemade sweets business. Browse the menu, add to cart, check out with COD/GCash, inquire for catering, and join the newsletter. Built to impress clients and take real orders.

## Features

- Persistent cart: add/remove/qty, drawer UI, subtotal + delivery + total, localStorage, navbar badge
- Checkout flow: validated form (name/phone/address/payment mock), order summary, confirmation screen with order ID, cart clears, orders saved locally
- Menu experience: category tabs (Sweets/Snacks/Drinks/Combos), live search, sort by price/name, product detail modal with qty selector and add-to-cart, quick-add
- Social proof + lead capture: auto-advancing testimonials carousel with manual controls, newsletter signup with validation + localStorage + success state
- UX polish: IntersectionObserver scroll-reveal, back-to-top button, 404 route, skip-to-menu link, focus states, alt text, aria labels, responsive layout
- Catering/contact: inquiry form with validation + success toast + localStorage, hours + location block with map embed
- SEO: title, description, OG/Twitter tags, canonical, JSON-LD Bakery schema

## Screenshots

Placeholders (add real shots to `docs/`):

- `docs/screenshot-home.png` - hero + menu
- `docs/screenshot-cart.png` - cart drawer open
- `docs/screenshot-checkout.png` - checkout + confirmation
- `docs/screenshot-catering.png` - catering form + map

## Tech stack

- React 17, react-scripts 4 (CRA), react-router-dom v5
- styled-components, react-icons, react-typical
- Zero new runtime dependencies (hand-rolled carousel, modal, reveal, toast)
- Firebase Hosting (`firebase.json` rewrites SPA to `/index.html`)

## Getting started

Requirements: Node 16 (CRA 4 era). Node 18+ needs `NODE_OPTIONS=--openssl-legacy-provider` for build.

```bash
npm install --legacy-peer-deps
npm start
```

Open http://localhost:3000

## Scripts

- `npm start` - dev server
- `npm run build` - production build to `build/`
- `npm test` - CRA test runner
- `npx serve -s build` - preview production build locally

## Environment

Copy `.env.example` to `.env` for local overrides. No secrets required; all checkout/catering is mock + localStorage.

```bash
cp .env.example .env
```

## Deployment to Firebase

Project: `sweet-delights-c84a7` (see `.firebaserc`).

```bash
npm run build
npx firebase-tools deploy --only hosting
# or: firebase deploy --only hosting
```

SPA rewrite is already configured in `firebase.json`.

## Project structure

- `src/App.js` - routes (`/`, `/checkout`, 404), providers
- `src/context/CartContext.js` - cart reducer + localStorage + drawer state
- `src/components/Cart/` - drawer UI
- `src/components/Checkout/` - checkout page + confirmation
- `src/components/Menu/` - filter/search/sort + product modal
- `src/components/Testimonials/`, `Newsletter/`, `Catering/`
- `src/components/BackToTop/`, `NotFound/`, `Reveal/`, `hooks/useReveal.js`
- `src/utils/format.js` - peso formatting, totals

## Roadmap

- Real backend orders (Firestore) + GCash deep link
- Admin menu editor + order list
- Delivery fee by barangay + pickup slots
- PWA install + offline menu
- Analytics + conversion events
