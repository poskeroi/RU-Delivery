
# RU Delivery — Fullstack Monorepo

This merges your web client (**cra**) and the **combined backend** (HackRU-25 + RU Relay API).

## Structure
- `apps/frontend` — frontend app
- `apps/backend` — backends under `packages/`

## Dev
```bash
npm install
npm run dev:hackru
npm run dev:relay
npm run dev:frontend
```
Configure the frontend to point to:
- API: `http://localhost:3000` (HackRU-25)
- Relay: `http://localhost:4000` (RU Relay API)

Add env vars as needed in `apps/frontend/.env`.
