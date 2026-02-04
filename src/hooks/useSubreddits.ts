import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Subreddit = {
  name: string;
  lastVisitedAt: number;
  favorited: boolean;
};

type SubredditState = {
  items: Subreddit[];
};

const STORAGE_KEY = 'reddit_gallery_subreddits';

export function useSubreddits() {
  const [state, setState] = useLocalStorage<SubredditState>(STORAGE_KEY, { items: [] });

  const addRecent = useCallback(
    (name: string) => {
      const normalized = name.trim().toLowerCase();
      if (!normalized) return;
      setState((prev) => {
        const existing = prev.items.find((item) => item.name === normalized);
        const nextItems = prev.items.filter((item) => item.name !== normalized);
        const base: Subreddit = existing ?? {
          name: normalized,
          lastVisitedAt: Date.now(),
          favorited: false
        };
        return {
          items: [{ ...base, lastVisitedAt: Date.now() }, ...nextItems]
        };
      });
    },
    [setState]
  );

  const toggleFavorite = useCallback(
    (name: string) => {
      setState((prev) => ({
        items: prev.items.map((item) =>
          item.name === name ? { ...item, favorited: !item.favorited } : item
        )
      }));
    },
    [setState]
  );

  const remove = useCallback(
    (name: string) => {
      setState((prev) => ({ items: prev.items.filter((item) => item.name !== name) }));
    },
    [setState]
  );

  const favorites = useMemo(
    () => state.items.filter((item) => item.favorited),
    [state.items]
  );
  const recents = useMemo(() => state.items, [state.items]);

  return { favorites, recents, addRecent, toggleFavorite, remove };
}
