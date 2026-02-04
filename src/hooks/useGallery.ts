import { useEffect, useMemo, useState } from 'react';
import { extractGalleryPosts, GalleryPost } from '../utils/reddit';

type GalleryState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  posts: GalleryPost[];
};

export function useGallery(subreddit: string | null) {
  const [state, setState] = useState<GalleryState>({ status: 'idle', posts: [] });

  useEffect(() => {
    if (!subreddit) {
      setState({ status: 'idle', posts: [] });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        setState((prev) => ({ ...prev, status: 'loading' }));
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json?limit=50`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Failed to load');
        }
        const data = await response.json();
        if (cancelled) return;
        const posts = extractGalleryPosts(data);
        setState({ status: 'success', posts });
      } catch {
        if (!cancelled) {
          setState({ status: 'error', posts: [] });
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [subreddit]);

  return useMemo(() => state, [state]);
}
