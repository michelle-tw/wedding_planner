# Wedding Planner — Việt Nam × Đài Loan

A personal, single-user wedding planning app for a Vietnamese bride and
Taiwanese groom planning two weddings:

- **Vietnam wedding** — 12/06/2027 (fixed)
- **Taiwan wedding** — date TBD, ~07/2027, avoiding Ghost Month (editable in
  Settings, default placeholder 15/07/2027)

This is a **static, offline-capable single-page app**. There is no backend,
no server, no authentication, and no external API calls. All data lives in
the browser's `localStorage`. It is meant for private use by the couple
only — do not treat it as a multi-user or production SaaS product.

## What it does

- **Dashboard** — live countdowns to both weddings, checklist completion %,
  a budget variance bar (planned vs. actual), and a list of urgent tasks.
- **Budget** — the 9 budget categories from the wedding plan (food, video,
  venue, sound/lighting, attire, photography, ceremony, invitations,
  contingency), each with editable planned/actual amounts, a ⭐ priority
  flag, and a visual variance bar. Raising one category nudges (never
  blocks) a suggestion to trim a "can-cut" category — food and videography
  are protected and never suggested for cuts.
- **Tasks** — a Kanban board (Chưa làm / Đang làm / Hoàn thành) seeded from
  the 5 planning phases (giai đoạn) in the master checklist, with an
  alternate Timeline view grouped by phase.
- **Vendors** — a lightweight CRM for catering, videography, venue,
  sound/lighting, attire, and photography vendors: contact info, quotes,
  negotiation status, and notes.
- **Guests** — separate VN-side / TW-side guest lists with RSVP status,
  table numbers, and notes.
- **Timeline** — both wedding dates plus the two full logistics itineraries
  from the plan: a 5-day Bình Dương itinerary for the groom's family and a
  7-day Đài Nam itinerary for the bride's parents, each day expandable with
  recommended food notes.
- **Documents** — a metadata-only document vault (marriage registration,
  passports, vendor contracts, visas) with expiry-date tracking and an
  "expiring soon" warning badge.
- **Settings** — edit the Taiwan wedding date and total budget cap, switch
  the UI language, and **export/import the entire app state as JSON** —
  this is the safety net since there is no database behind this app.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` config, no
  `tailwind.config.js`)
- [lucide-react](https://lucide.dev) for all icons (no emoji anywhere)
- [zustand](https://github.com/pmndrs/zustand) with the `persist` middleware
  — the whole app state is persisted to `localStorage` under the key
  `wedding-planner-state`
- [react-i18next](https://react.i18next.com) for a bilingual UI shell
  (Vietnamese default, Traditional Chinese toggle) using static JSON
  translation files — no AI/API-based translation
- [react-router](https://reactrouter.com) with `HashRouter` (so this works
  as a GitHub Pages project site without server-side rewrites)

Seed content (checklist items, budget figures, itinerary text) is taken
verbatim from the source planning document and is intentionally left in its
original Vietnamese — only the surrounding UI chrome is bilingual.

## Running locally

```bash
npm install
npm run dev
```

Vite will print a local dev URL (typically `http://localhost:5173/wedding_planner/`).

## Building

```bash
npm run build
```

Type-checks with `tsc -b` and outputs a static build to `dist/`.

## Deploying

This repo is configured as a GitHub Pages **project site** served from
`/wedding_planner/` (see `base` in `vite.config.ts`). Pushing to `main`
triggers `.github/workflows/deploy.yml`, which builds the app and deploys
`dist/` to GitHub Pages automatically. You can also trigger a deploy
manually from the Actions tab (`workflow_dispatch`).

## Data & privacy

Everything is stored locally in your browser. There is no login, no
tracking, and no server persistence. If you clear your browser storage or
switch devices/browsers, your data will not follow you automatically —
use **Settings → Xuất dữ liệu (Export)** regularly to download a JSON
backup, and **Nhập dữ liệu (Import)** to restore it.
