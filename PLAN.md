# Yet Another Reddit Gallery App (YARGA) - Architecture & TDD Plan

## Architecture Overview
- UI Framework: React (functional components)
- Styling: Tailwind CSS
- State: React hooks + localStorage persistence
- Data: Reddit public JSON endpoints (client-side fetch)
- Routing: Lightweight state-based view switching (no comments view)
- PWA: Vite PWA config (manifest + service worker, name: YARGA, description: YARGA (Yet Another Reddit Gallery App))
- Testing: Vitest + React Testing Library (BDD-style specs)

## Core Concepts
- Subreddit entity: { name, lastVisitedAt, favorited }
- Media item: { id, type, urls[], title, postId }
- Post view: list of media items per post, swipe up/down for post navigation

## Modules
- `hooks/useLocalStorage.ts` - persistence for recents/favorites
- `hooks/useSubredditSearch.ts` - fetch + debounce autocomplete
- `hooks/useGallery.ts` - media extraction and navigation state
- `components/SubredditList.tsx`
- `components/SearchBar.tsx`
- `components/Gallery.tsx`
- `components/MediaViewer.tsx`
- `components/SwipeLayer.tsx` (pointer/touch handling)

## TDD/BDD Stages (Incremental)
1) Prototype Shell
- App renders main page with empty recent/favorite lists.
- Can add/remove from a stub list (no network).
- Tests confirm list rendering and removal.

2) Search + Persistence
- Autocomplete search (debounced) from Reddit endpoint.
- Selecting adds to recent list and persists to localStorage.
- Favorite toggle persists.
- Tests cover storage behavior and search results.

3) Gallery View
- Selecting subreddit fetches posts.
- Filter to image/video/gif.
- Gallery list shows titles and thumbnails.
- Tests validate filtering/extraction.

4) Media Viewer + Swipes
- Tap item opens viewer.
- Horizontal swipe cycles media within post.
- Vertical swipe cycles posts.
- Back returns to gallery/main.
- Tests cover navigation state and swipe handlers.

5) PWA + Polish
- Manifest + icon placeholders.
- Service worker enabled.
- Tests pass; app functional at each stage.

## Task List
- [x] Scaffold Vite + React + Tailwind + Vitest
- [x] Implement Stage 1 tests + UI
- [x] Implement Stage 2 tests + UI
- [x] Implement Stage 3 tests + UI
- [x] Implement Stage 4 tests + UI
- [x] Implement Stage 5 PWA config + final checks
