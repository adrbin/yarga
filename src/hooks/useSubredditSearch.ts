import { useEffect, useMemo, useState } from 'react';
import { buildRedditUrl } from '../utils/redditApi';

export type SubredditSearchResult = {
  name: string;
  title: string;
  subscribers: number;
  icon: string | null;
};

type SubredditSearchApiItem = {
  display_name?: string;
  title?: string;
  subscribers?: number;
  icon_img?: string;
  community_icon?: string;
};

type SubredditSearchApiResponse = {
  data: {
    children: { data: SubredditSearchApiItem }[];
  };
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
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = window.setTimeout(async () => {
      try {
        setState((prev) => ({ ...prev, status: 'loading' }));
        const trimmed = query.trim();
        const endpoint = buildRedditUrl('/subreddits/search.json', {
          q: trimmed,
          limit: 8,
          raw_json: 1
        });

        let data: SubredditSearchApiResponse | null = null;

        if (cancelled) return;
        try {
          const response = await fetch(endpoint, {
            signal: controller?.signal,
            headers: { Accept: 'application/json' }
          });
          if (!response.ok) {
            throw new Error('Search failed');
          }
          data = (await response.json()) as SubredditSearchApiResponse;
        } catch (error) {
          if (controller?.signal.aborted) {
            return;
          }
          console.warn('[subreddit-search] request failed', {
            endpoint,
            error: error instanceof Error ? error.message : String(error)
          });
        }

        if (!data) {
          throw new Error('Search failed');
        }
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
      controller?.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  return useMemo(() => state, [state]);
}
