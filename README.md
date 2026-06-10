# ETF Tracker Web

ETF Tracker Web is a full-stack ETF analysis dashboard designed to surface attractive buy signals from live market data. The backend pulls pricing and historical data from Yahoo Finance, calculates each ETF's discount to its 20-day moving average, and stores the results in Redis. The frontend turns that data into a clean dashboard with ranked opportunities, allocation guidance, and market status at a glance.

## Problem Solved
This project solves the problem of quickly identifying ETFs that are trading below their recent trend and surfacing the best potential entry points in a single dashboard. Instead of manually checking market data and doing calculations in a spreadsheet, the app automates the analysis, ranks the opportunities, and keeps the results fresh through caching and scheduled refreshes.

## What It Demonstrates

- End-to-end data flow from a public market data source to a production-style UI
- Server-side ranking logic based on 20-day moving average discount
- Background refreshes and Redis caching to keep responses fast
- A React + TypeScript frontend with reusable cards, tables, and calculator components
- Clear separation between API, business logic, and presentation

## Web Images
<img width="600" height="342" alt="Screenshot 2026-06-10 at 9 19 49 PM" src="https://github.com/user-attachments/assets/d429a1b5-dfd0-4385-8f15-687fd1cd7cf0" />

<img width="600" height="342" alt="Screenshot 2026-06-10 at 9 20 11 PM" src="https://github.com/user-attachments/assets/a3065c61-3fab-4f36-8f74-a7720531bae6" />

<img width="600" height="342" alt="Screenshot 2026-06-10 at 9 20 01 PM" src="https://github.com/user-attachments/assets/032c9b94-b747-4bfe-8372-56c403ca531e" />

## Project Structure

- `backend/` - Express API, Yahoo Finance integration, Redis cache, and refresh job
- `frontend/` - Vite + React app that renders the dashboard experience

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Redis, node-cron, Yahoo Finance integration
- Tooling: pnpm workspaces, Vite proxy for local development

## Prerequisites

- Node.js 20+
- pnpm 8+
- Upstash Redis account and credentials

## Getting Started

1. Install dependencies from the repository root:

   ```bash
   pnpm install
   ```

2. Configure the backend environment:
   - Copy `backend/backend.env.example` to `backend/.env`
   - Add your real Redis credentials and any local overrides

3. Configure the frontend environment:
   - Copy `frontend/frontend.env.example` to `frontend/.env.local`
   - Set `VITE_API_URL` only when targeting a deployed backend

4. Start both apps in separate terminals:

   ```bash
   pnpm dev:backend
   pnpm dev:frontend
   ```

   In local development, the Vite proxy forwards `/api` requests to `http://localhost:3001`.

## Available Scripts

From the repository root:

- `pnpm dev:backend` - start the backend in watch mode
- `pnpm dev:frontend` - start the frontend dev server
- `pnpm build:backend` - compile the backend TypeScript
- `pnpm build:frontend` - build the frontend for production

Inside `backend/`:

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

Inside `frontend/`:

- `pnpm dev`
- `pnpm build`
- `pnpm preview`

## API Surface

- `GET /api/etfs` - returns the cached or freshly fetched ETF dataset
- `POST /api/etfs/refresh` - forces a refresh and repopulates the cache
- `GET /health` - basic health check

## Architecture

The backend fetches quote and historical price data from Yahoo Finance, computes the 20-day moving average for each ETF, ranks ETFs by percentage discount to that average, and stores the result in Redis. A cron job refreshes the cache during market hours so the frontend can stay fast while still showing fresh data. The frontend consumes that single API response and renders the dashboard, top-three opportunities, and allocation calculator.

## Notes

- Do not commit `backend/.env` or `frontend/.env.local`.
- Keep Redis credentials and any deployment secrets out of source control.
- The repo already ignores generated artifacts such as `node_modules/` and `dist/`.
