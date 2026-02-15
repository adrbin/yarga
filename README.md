# YARGA

Yet Another Reddit Gallery App (YARGA) is a Vite + React PWA that lets you search subreddits, save favorites, and browse image/video/gif posts in a swipeable viewer. Data is fetched from Reddit JSON endpoints (directly by default, or via a Netlify proxy) with localStorage persistence.

## Features
- Subreddit search with autocomplete
- Favorites + recently visited (localStorage-backed)
- Gallery view filtered to visual media
- Swipe navigation (horizontal: media, vertical: posts)
- PWA-ready (manifest + service worker)

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library
- Vite PWA (workbox-window)

## Getting Started
Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Run with Netlify Functions locally:

```bash
pnpm dev:netlify
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Tests
Run tests once:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

Lint:

```bash
pnpm lint
```

## Project Structure
- `src/App.tsx`: app shell + view switching
- `src/hooks/`: stateful logic (subreddits, gallery, viewer)
- `src/components/`: UI pieces (search, lists, gallery, viewer, swipes)
- `src/utils/reddit.ts`: media extraction helpers
- `src/test/`: stage-based tests and utils tests

## Notes
- Frontend Reddit URL target is configured with `VITE_REDDIT_BASE_URL`.
- Default (direct): `https://www.reddit.com`
- Proxy mode: `/api/reddit`
- Netlify function deployment is controlled by `NETLIFY_ENABLE_REDDIT_PROXY`.
- `NETLIFY_ENABLE_REDDIT_PROXY=false` (default): proxy function is not deployed.
- `NETLIFY_ENABLE_REDDIT_PROXY=true`: proxy function is prepared and deployed.
- When `VITE_REDDIT_BASE_URL=/api/reddit` and `NETLIFY_ENABLE_REDDIT_PROXY=true`, requests route to the Netlify function (`/api/reddit/*` -> `/.netlify/functions/reddit-proxy/:splat`).
- `pnpm dev` can use proxy mode through Vite dev proxy config.
- `pnpm dev:netlify` runs the real Netlify function locally.
- Swipe handling lives in `src/components/SwipeLayer.tsx` and `src/hooks/useViewerNavigation.ts`.
- Recents/favorites are persisted in localStorage.

## Environment
Copy `.env.example` values as needed:

```bash
VITE_REDDIT_BASE_URL=https://www.reddit.com
# VITE_REDDIT_BASE_URL=/api/reddit

REDDIT_UPSTREAM_BASE_URL=https://www.reddit.com
NETLIFY_ENABLE_REDDIT_PROXY=false
```

## PWA
The app is configured as a PWA via Vite PWA. The manifest and service worker are already set up.
