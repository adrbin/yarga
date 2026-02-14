import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { extractGalleryPosts, GalleryPost } from '../utils/reddit';

type GalleryState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  posts: GalleryPost[];
  after: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
};

const INITIAL_STATE: GalleryState = {
  status: 'idle',
  posts: [],
  after: null,
  hasMore: false,
  isLoadingMore: false
};

const buildSubredditUrl = (subreddit: string, after?: string | null) => {
  const url = new URL(`https://www.reddit.com/r/${subreddit}.json`);
  url.searchParams.set('limit', '50');
  if (after) {
    url.searchParams.set('after', after);
  }
  return url.toString();
};

const appendUniquePosts = (existing: GalleryPost[], incoming: GalleryPost[]) => {
  const ids = new Set(existing.map((post) => post.id));
  const appended = incoming.filter((post) => {
    if (ids.has(post.id)) return false;
    ids.add(post.id);
    return true;
  });
  return appended;
};

export function useGallery(subreddit: string | null) {
  const [state, setState] = useState<GalleryState>(INITIAL_STATE);
  const inFlightRef = useRef(false);
  const generationRef = useRef(0);
  const postsRef = useRef<GalleryPost[]>([]);

  useEffect(() => {
    if (!subreddit) {
      generationRef.current += 1;
      inFlightRef.current = false;
      postsRef.current = [];
      setState(INITIAL_STATE);
      return;
    }

    generationRef.current += 1;
    inFlightRef.current = false;
    const generation = generationRef.current;
    let cancelled = false;
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        setState((prev) => ({ ...prev, status: 'loading', posts: [] }));
        const response = await fetch(buildSubredditUrl(subreddit), {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Failed to load');
        }
        const data = (await response.json()) as { data?: { after?: string | null } };
        if (cancelled || generation !== generationRef.current) return;
        const posts = extractGalleryPosts(data);
        const after = data?.data?.after ?? null;
        postsRef.current = posts;
        setState({
          status: 'success',
          posts,
          after,
          hasMore: Boolean(after),
          isLoadingMore: false
        });
      } catch {
        if (!cancelled) {
          postsRef.current = [];
          setState({
            status: 'error',
            posts: [],
            after: null,
            hasMore: false,
            isLoadingMore: false
          });
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [subreddit]);

  const loadMore = useCallback(async () => {
    if (!subreddit || !state.hasMore || !state.after || inFlightRef.current) {
      return 0;
    }

    inFlightRef.current = true;
    const generation = generationRef.current;
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      const response = await fetch(buildSubredditUrl(subreddit, state.after));
      if (!response.ok) {
        throw new Error('Failed to load more');
      }
      const data = (await response.json()) as { data?: { after?: string | null } };
      if (generation !== generationRef.current) {
        return 0;
      }
      const nextPosts = extractGalleryPosts(data);
      const appended = appendUniquePosts(postsRef.current, nextPosts);
      const appendedCount = appended.length;
      const after = data?.data?.after ?? null;
      postsRef.current = [...postsRef.current, ...appended];
      setState((prev) => {
        return {
          ...prev,
          posts: [...prev.posts, ...appended],
          after,
          hasMore: Boolean(after),
          isLoadingMore: false
        };
      });
      return appendedCount;
    } catch {
      if (generation === generationRef.current) {
        setState((prev) => ({ ...prev, isLoadingMore: false }));
      }
      return 0;
    } finally {
      inFlightRef.current = false;
    }
  }, [state.after, state.hasMore, subreddit]);

  return useMemo(
    () => ({
      status: state.status,
      posts: state.posts,
      hasMore: state.hasMore,
      isLoadingMore: state.isLoadingMore,
      loadMore
    }),
    [loadMore, state.hasMore, state.isLoadingMore, state.posts, state.status]
  );
}
