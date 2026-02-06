# YARGA

Yet Another Reddit Gallery App (YARGA) is a Vite + React PWA that lets you search subreddits, save favorites, and browse image/video/gif posts in a swipeable viewer. Data is fetched client-side from Reddit’s public JSON endpoints with localStorage persistence.

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
- All data fetching is client-side from `https://www.reddit.com/r/<subreddit>.json`.
- Swipe handling lives in `src/components/SwipeLayer.tsx` and `src/hooks/useViewerNavigation.ts`.
- Recents/favorites are persisted in localStorage.

## PWA
The app is configured as a PWA via Vite PWA. The manifest and service worker are already set up.
