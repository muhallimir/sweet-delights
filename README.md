# Sweet Delights | Homemade Sweets and Fiesta Catering

Bakery storefront for a Filipino homemade sweets business. Browse the menu, add to cart, check out with COD/GCash, inquire for catering, and join the newsletter. Built to impress clients and take real orders.

## Features

### Storefront and ordering
- Persistent cart: add/remove/qty, drawer UI, subtotal + delivery + total, localStorage, navbar badge
- Checkout flow: validated form (name/phone/address/payment mock), order summary, confirmation screen with order ID, cart clears, orders saved locally
- Menu experience: category tabs (Sweets/Snacks/Drinks/Combos), live search, sort by price/name, product detail modal with qty selector and add-to-cart, quick-add
- Social proof + lead capture: auto-advancing testimonials carousel with manual controls, newsletter signup with validation + localStorage + success state
- UX polish: IntersectionObserver scroll-reveal, back-to-top button, 404 route, skip-to-menu link, focus states, alt text, aria labels, responsive layout
- Catering/contact: inquiry form with validation + success toast + localStorage, hours + location block with map embed
- SEO: title, description, OG/Twitter tags, canonical, JSON-LD Bakery schema

### Admin and operations
- Admin dashboard: orders list, sales bar chart (pure CSS), mark fulfilled / cancelled
- Receipts by email (mock): captured to localStorage with validation
- Track order by ID: live timeline that reads SMS-driven stage
- Currency toggle PHP/USD, dark mode toggle, theme persisted

### Engagement and retention
- Loyalty program: 1pt per peso, 100pts = 250 off, points persist locally
- Loyalty tier system: Bronze / Silver / Gold based on lifetime points with progress bar
  - Silver unlocks free delivery on all orders
  - Gold unlocks exclusive items and free delivery
- Referral/birthday capture: local storage, helper for future invites

### Product and experience
- Pre-order for tomorrow: pick date + time slot, separate "Scheduled" section in cart with live 1s countdown
- Combo of the week: curated bundle (e.g. 2 pastries + 1 drink), auto-calculated savings, weekly rotation from a fixed demo date
- Customer photo reviews: file input -> FileReader -> data URL (max 200 KB), stored locally, rendered with author + caption
- Allergen substitution matrix: swap nuts/egg/milk/gluten/etc, adds a fee line item, updates allergen display
- Macro pie chart: pure CSS conic-gradient donut with carbs/protein/fat, accessible <table> fallback and aria-label
- Order notes: separate driver instructions (delivery) and note to baker fields, both 0-200 char validated, shown on confirmation and in admin
- Gift cards: /gift-cards route with 500/1000/2000 denominations, recipient + message, My gift cards list, redeem flow
- SMS order updates (mock): opt-in checkbox with phone, fake status pushes (placed -> baking -> out -> delivered) drive toast notifications and /track timeline
- In-store pickup QR ticket: confirmation page renders a real QR Code Model 2 (hand-rolled, no deps) with Save as image button

## Screenshots

Placeholders (add real shots to `docs/`):

- `docs/screenshot-home.png` - hero + menu
- `docs/screenshot-cart.png` - cart drawer open
- `docs/screenshot-checkout.png` - checkout + confirmation
- `docs/screenshot-catering.png` - catering form + map

## Tech stack

- React 17, react-scripts 4 (CRA), react-router-dom v5
- styled-components, react-icons, react-typical
- Zero new runtime dependencies (hand-rolled carousel, modal, reveal, toast, QR Code Model 2 generator, macro pie)
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
- `npm test` - CRA test runner (212+ unit tests, all green)
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

## Deployment to Vercel

The project also builds for Vercel. `vercel.json` sets the install/build commands and SPA rewrites. Pushes to `main` auto-deploy to production.

```bash
vercel --prod
# or push to main and let the GitHub integration do it
```

## Project structure

- `src/App.js` - routes (`/`, `/checkout`, `/track`, `/admin`, `/gift-cards`, 404), providers
- `src/context/CartContext.js` - cart reducer + localStorage + drawer state
- `src/components/Cart/` - drawer UI
- `src/components/Checkout/` - checkout page + confirmation (notes, QR, tier, etc)
- `src/components/Menu/` - filter/search/sort + product modal (allergens, macros, preorder, photo reviews)
- `src/components/Loyalty/`, `Preorder/`, `Combo/`, `GiftCards/`, `Sms/`, `Reviews/`, `Allergens/`, `Macros/`, `QR/`
- `src/components/Testimonials/`, `Newsletter/`, `Catering/`
- `src/components/BackToTop/`, `NotFound/`, `Reveal/`, `hooks/useReveal.js`
- `src/utils/format.js` - peso formatting, totals
- `src/utils/qr.js` - hand-rolled QR Code Model 2 generator (versions 1-10, Reed-Solomon)
- `src/utils/loyaltyTier.js`, `preorder.js`, `combo.js`, `giftCards.js`, `sms.js`, `photoReviews.js`, `allergenSubs.js`, `macros.js`, `orderNotes.js`, `scheduled.js`

## Roadmap

- Real backend orders (Firestore) + GCash deep link
- Admin menu editor + order list
- Delivery fee by barangay + pickup slots
- PWA install + offline menu
- Analytics + conversion events
