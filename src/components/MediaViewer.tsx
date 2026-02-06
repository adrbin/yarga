import { useEffect, useState } from 'react';
import { GalleryPost, MediaItem } from '../utils/reddit';
import SwipeLayer from './SwipeLayer';

type Props = {
  post: GalleryPost;
  media: MediaItem;
  postIndex: number;
  postCount: number;
  mediaIndex: number;
  mediaCount: number;
  onBack: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
};

export default function MediaViewer({
  post,
  media,
  postIndex,
  postCount,
  mediaIndex,
  mediaCount,
  onBack,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onBack();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onSwipeRight();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onSwipeLeft();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onSwipeDown();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onSwipeUp();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp]);

  const canGoPrev = mediaIndex > 0;
  const canGoNext = mediaIndex < mediaCount - 1;
  const canGoPrevPost = postIndex > 0;
  const canGoNextPost = postIndex < postCount - 1;
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-ink text-chalk">
      <SwipeLayer
        testId="media-viewer"
        className="relative flex h-full flex-col"
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-chalk/50">
              Post {postIndex + 1} / {postCount}
            </p>
            <p className="mt-2 text-sm font-semibold">{post.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-chalk/40">Esc</span>
            <button
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-chalk/70 hover:bg-white/10"
              onClick={onBack}
              data-no-swipe="true"
            >
              Back
            </button>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center bg-ink/95">
          {media.type === 'video' ? (
            <video
              className="max-h-[80vh] w-full max-w-4xl rounded-2xl"
              src={media.url}
              poster={media.poster}
              autoPlay
              muted={isMuted}
              playsInline
              controls
              onVolumeChange={(event) => {
                const target = event.currentTarget;
                setIsMuted(target.muted);
              }}
            />
          ) : (
            <img
              className="max-h-[80vh] w-full max-w-4xl rounded-2xl object-contain"
              src={media.url}
              alt={post.title}
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-y-24 left-0 right-0 z-20 hidden items-center justify-between px-4 md:flex">
          <button
            type="button"
            aria-label="Previous media"
            disabled={!canGoPrev}
            onClick={onSwipeRight}
            data-no-swipe="true"
            className={[
              'pointer-events-auto flex h-10 w-20 items-center justify-center rounded-full border border-white/10',
              'bg-white/5 text-chalk/80 shadow-lg shadow-black/20 backdrop-blur',
              'transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
              canGoPrev ? 'opacity-100' : 'cursor-not-allowed opacity-40'
            ].join(' ')}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.5 4.5L7 10l5.5 5.5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next media"
            disabled={!canGoNext}
            onClick={onSwipeLeft}
            data-no-swipe="true"
            className={[
              'pointer-events-auto flex h-10 w-20 items-center justify-center rounded-full border border-white/10',
              'bg-white/5 text-chalk/80 shadow-lg shadow-black/20 backdrop-blur',
              'transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
              canGoNext ? 'opacity-100' : 'cursor-not-allowed opacity-40'
            ].join(' ')}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 4.5L13 10l-5.5 5.5" />
            </svg>
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-16 z-20 hidden items-center justify-center md:flex">
          <button
            type="button"
            aria-label="Previous post"
            disabled={!canGoPrevPost}
            onClick={onSwipeDown}
            data-no-swipe="true"
            className={[
              'pointer-events-auto flex h-10 w-20 items-center justify-center rounded-full border border-white/10',
              'bg-white/10 text-chalk/80 shadow-lg shadow-black/20 backdrop-blur',
              'transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
              canGoPrevPost ? 'opacity-100' : 'cursor-not-allowed opacity-40'
            ].join(' ')}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 12.5L10 7l5.5 5.5" />
            </svg>
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 hidden items-center justify-center md:flex">
          <button
            type="button"
            aria-label="Next post"
            disabled={!canGoNextPost}
            onClick={onSwipeUp}
            data-no-swipe="true"
            className={[
              'pointer-events-auto flex h-10 w-20 items-center justify-center rounded-full border border-white/10',
              'bg-white/10 text-chalk/80 shadow-lg shadow-black/20 backdrop-blur',
              'transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
              canGoNextPost ? 'opacity-100' : 'cursor-not-allowed opacity-40'
            ].join(' ')}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 7.5L10 13l5.5-5.5" />
            </svg>
          </button>
        </div>
        <footer className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-chalk/60">
          <span>
            Media {mediaIndex + 1} / {mediaCount}
          </span>
          <span>Swipe or use ←/→ for media · ↑/↓ for posts</span>
        </footer>
      </SwipeLayer>
    </div>
  );
}
