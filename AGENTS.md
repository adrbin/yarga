# AGENTS.md (Codex Guide) — YARGA

## Project Snapshot
YARGA (Yet Another Reddit Gallery App) is a Vite + React PWA that lets users search subreddits, favorite or revisit them, and browse image/video/gif posts in a swipeable viewer. Data is fetched client-side from Reddit’s public JSON endpoints, with localStorage persistence for recents/favorites.

## Stack
- React 18 (functional components)
- Vite + TypeScript
- Tailwind CSS
- Vitest + React Testing Library
- Vite PWA (workbox-window)

## Architecture Map
App root
- `src/App.tsx`: view switching (`home` vs `gallery`), wiring of hooks + components

Hooks
- `src/hooks/useSubreddits.ts`: recents/favorites + persistence (localStorage)
- `src/hooks/useSubredditSearch.ts`: debounced autocomplete search
- `src/hooks/useGallery.ts`: fetch + transform subreddit posts into gallery data
- `src/hooks/useViewerNavigation.ts`: viewer state + swipe navigation
- `src/hooks/useLocalStorage.ts`: storage helper

Components
- `src/components/SearchBar.tsx`: search UX
- `src/components/SubredditList.tsx`: favorites/recents lists
- `src/components/Gallery.tsx`: gallery grid
- `src/components/MediaCard.tsx`: gallery card
- `src/components/MediaViewer.tsx`: viewer UI
- `src/components/SwipeLayer.tsx`: pointer/touch handling

Data utilities
- `src/utils/reddit.ts`: extract media items from Reddit listings
- `src/utils/redditApi.ts`: Reddit URL builder using `VITE_REDDIT_BASE_URL`

Serverless
- `netlify/edge-functions/reddit-proxy.ts`: Reddit JSON proxy for `/api/reddit/*`

Tests
- `src/test/App.stage1.test.tsx`: stage 1
- `src/test/App.stage2.test.tsx`: stage 2
- `src/test/App.stage3.test.tsx`: stage 3
- `src/test/App.stage4.test.tsx`: stage 4
- `src/test/reddit-utils.test.ts`: extraction logic

## Core Concepts (from PLAN)
- Subreddit entity: `{ name, lastVisitedAt, favorited }`
- Media item: `{ id, type, url, poster? }`
- Viewer: horizontal swipe for media in a post; vertical swipe for next/prev post

## Data Flow
1. User searches/selects a subreddit → `useSubreddits` updates recents + active subreddit.
2. `useGallery` fetches `https://www.reddit.com/r/<subreddit>.json` and transforms with `extractGalleryPosts`.
3. `Gallery` renders posts; `MediaViewer` opens on selection.
4. `useViewerNavigation` + `SwipeLayer` manage media/post navigation.

## Conventions / Guardrails
- Keep all logic client-side; no server components or backend.
- Prefer hooks for stateful logic and reuse.
- Avoid adding new dependencies unless needed; follow existing patterns.
- Keep view switching simple (no router; state-based navigation).
- Ensure swipe and pointer handling lives in `SwipeLayer` + `useViewerNavigation`.
- LocalStorage is the source of truth for recents/favorites.

## Testing
- Run tests: `pnpm test`
- Watch mode: `pnpm test:watch`
- Lint: `pnpm lint`
- Typecheck (required before finishing changes): `pnpm typecheck`
- If you add TypeScript files outside `src/` (for example `netlify/edge-functions`), ensure they are covered by a TS config and fix any reported errors before completion.
- If you add JavaScript/MJS scripts (for example in `scripts/`), ensure they are covered by `tsconfig.scripts.json` so `pnpm typecheck` catches script type errors automatically.

## PWA
- Vite PWA is already configured; do not remove `workbox-window` usage or the manifest/service worker setup.

## API Target Config
- Frontend uses `VITE_REDDIT_BASE_URL` for all Reddit fetches.
- Default is direct Reddit: `https://www.reddit.com`.
- Proxy mode sets `VITE_REDDIT_BASE_URL=/api/reddit`.
- Netlify edge function deployment is controlled by `NETLIFY_ENABLE_REDDIT_PROXY`:
  - `false` (default): edge function is not prepared.
  - `true`: `reddit-proxy` is prepared/deployed.
- Netlify edge function routing in `netlify.toml` maps `/api/reddit/*` to `reddit-proxy`.

## If You’re Adding Features
- Update tests alongside changes (prefer BDD-style in `src/test/`).
- Keep UX aligned with the existing gallery/viewer flow.
- If touching media extraction, update `src/test/reddit-utils.test.ts`.
- Update this guide with any new architectural decisions or patterns you introduce and keep documentation (README.md) up to date.
- Check if there are any type errors, warnings or lint issues after your changes and fix them.
