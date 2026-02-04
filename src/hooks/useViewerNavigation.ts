import { useMemo, useState } from 'react';
import { GalleryPost } from '../utils/reddit';

type ViewerState = {
  isOpen: boolean;
  postIndex: number;
  mediaIndex: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function useViewerNavigation(posts: GalleryPost[]) {
  const [state, setState] = useState<ViewerState>({
    isOpen: false,
    postIndex: 0,
    mediaIndex: 0
  });

  const open = (postIndex: number, mediaIndex: number) => {
    setState({ isOpen: true, postIndex, mediaIndex });
  };

  const close = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const nextMedia = () => {
    setState((prev) => {
      const post = posts[prev.postIndex];
      if (!post) return prev;
      const nextIndex = clamp(prev.mediaIndex + 1, 0, post.media.length - 1);
      return { ...prev, mediaIndex: nextIndex };
    });
  };

  const prevMedia = () => {
    setState((prev) => {
      const post = posts[prev.postIndex];
      if (!post) return prev;
      const nextIndex = clamp(prev.mediaIndex - 1, 0, post.media.length - 1);
      return { ...prev, mediaIndex: nextIndex };
    });
  };

  const nextPost = () => {
    setState((prev) => {
      const nextPostIndex = clamp(prev.postIndex + 1, 0, posts.length - 1);
      return { ...prev, postIndex: nextPostIndex, mediaIndex: 0 };
    });
  };

  const prevPost = () => {
    setState((prev) => {
      const nextPostIndex = clamp(prev.postIndex - 1, 0, posts.length - 1);
      return { ...prev, postIndex: nextPostIndex, mediaIndex: 0 };
    });
  };

  const current = useMemo(() => {
    const post = posts[state.postIndex];
    const media = post?.media[state.mediaIndex];
    return { post, media };
  }, [posts, state.mediaIndex, state.postIndex]);

  return {
    state,
    open,
    close,
    nextMedia,
    prevMedia,
    nextPost,
    prevPost,
    current
  };
}
