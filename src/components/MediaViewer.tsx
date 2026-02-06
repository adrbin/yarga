import { useEffect, useState } from 'react';
import { GalleryPost, MediaItem } from '../utils/reddit';
import SwipeLayer from './SwipeLayer';
import ArrowButton from './ui/ArrowButton';
import Button from './ui/Button';

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
        <header className="relative flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-chalk/50">
              Post {postIndex + 1} / {postCount}
            </p>
            <p className="mt-2 text-sm font-semibold">{post.title}</p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
            <ArrowButton
              ariaLabel="Previous post"
              direction="up"
              disabled={!canGoPrevPost}
              onClick={onSwipeDown}
              dataNoSwipe
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-chalk/40">Esc</span>
            <Button
              variant="pill"
              size="pill-md"
              onClick={onBack}
              data-no-swipe="true"
            >
              Back
            </Button>
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
          <ArrowButton
            ariaLabel="Previous media"
            direction="left"
            disabled={!canGoPrev}
            onClick={onSwipeRight}
            dataNoSwipe
          />
          <ArrowButton
            ariaLabel="Next media"
            direction="right"
            disabled={!canGoNext}
            onClick={onSwipeLeft}
            dataNoSwipe
          />
        </div>
        <footer className="relative flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-chalk/60">
          <span>
            Media {mediaIndex + 1} / {mediaCount}
          </span>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
            <ArrowButton
              ariaLabel="Next post"
              direction="down"
              disabled={!canGoNextPost}
              onClick={onSwipeUp}
              dataNoSwipe
            />
          </div>
          <div className="flex items-center gap-3">
            <span>Swipe or use ←/→ for media · ↑/↓ for posts</span>
          </div>
        </footer>
      </SwipeLayer>
    </div>
  );
}
