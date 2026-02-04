import { useEffect, useMemo, useState } from 'react';

export type SubredditSearchResult = {
  name: string;
  title: string;
  subscribers: number;
  icon: string | null;
};

type SearchState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: SubredditSearchResult[];
};

export function useSubredditSearch(query: string) {
  const [state, setState] = useState<SearchState>({ status: 'idle', results: [] });

  useEffect(() => {
    if (query.trim().length < 2) {
      setState({ status: 'idle', results: [] });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setState((prev) => ({ ...prev, status: 'loading' }));
        const response = await fetch(
          `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(
            query.trim()
          )}&limit=8`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = (await response.json()) as {
          data: { children: { data: any }[] };
        };
        if (cancelled) return;
        const results = data.data.children.map((child) => {
          const info = child.data;
          return {
            name: info.display_name?.toLowerCase() ?? 'unknown',
            title: info.title ?? info.display_name ?? 'Untitled',
            subscribers: info.subscribers ?? 0,
            icon:
              info.icon_img && info.icon_img.length > 0
                ? info.icon_img
                : info.community_icon?.split('?')[0] ?? null
          } as SubredditSearchResult;
        });
        setState({ status: 'success', results });
      } catch {
        if (!cancelled) {
          setState({ status: 'error', results: [] });
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  return useMemo(() => state, [state]);
}
