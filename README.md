# AM People — Member App

A private membership web app built with Next.js 14, React 18, and TypeScript.

## Stack

- **Framework**: Next.js 14 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Custom CSS (globals.css) + Tailwind utilities
- **Fonts**: Playfair Display, Cormorant Garamond, DM Mono (Google Fonts)
- **Backend**: Node.js + Express + PostgreSQL (see `am-people-backend/`)
- **Email/CRM**: Flodesk
- **Payments**: Stripe
- **Deployment**: Vercel (frontend) + Railway (backend)

## Project Structure

```
am-people/
├── app/
│   ├── layout.tsx          # Root layout, fonts, meta
│   └── page.tsx            # Entry point
├── src/
│   ├── components/
│   │   └── AMPeopleApp.tsx # Main app component (all screens)
│   ├── data/
│   │   └── memberData.ts   # Events, tier config, member data
│   ├── lib/
│   │   └── appLogic.js     # Migrated JS utilities (refactor into hooks)
│   └── styles/
│       └── globals.css     # All styles inc. tier theme system
├── public/
│   └── assets/
│       └── hero-bg.jpg     # Landing page hero image
└── package.json
```

## Tier Colour System

Tiers are applied via `data-tier` attribute on `<body>`:

| Tier | Card | Accent |
|------|------|--------|
| Core | Light grey | Charcoal |
| Select | Deep burgundy/wine | Rose gold |
| Elite | Cold onyx | Platinum silver |
| Founding | Deep obsidian | Aged gold |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login**: Member number `AM-00001`, PIN `0001`

## Connect Backend

Update `API_BASE` in `AMPeopleApp.tsx`:

```ts
const API_BASE = 'https://your-api.railway.app'
```

## Deploy to Vercel

```bash
npm run build
vercel deploy
```
