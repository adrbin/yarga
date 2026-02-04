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
  return (
    <div className="fixed inset-0 z-50 bg-ink text-chalk">
      <SwipeLayer
        testId="media-viewer"
        className="flex h-full flex-col"
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
          <button
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-chalk/70 hover:bg-white/10"
            onClick={onBack}
          >
            Back
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center bg-ink/95">
          {media.type === 'video' ? (
            <video
              className="max-h-[80vh] w-full max-w-4xl rounded-2xl"
              src={media.url}
              poster={media.poster}
              controls
            />
          ) : (
            <img
              className="max-h-[80vh] w-full max-w-4xl rounded-2xl object-contain"
              src={media.url}
              alt={post.title}
            />
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-chalk/60">
          <span>
            Media {mediaIndex + 1} / {mediaCount}
          </span>
          <span>Swipe left/right for media · Swipe up/down for posts</span>
        </footer>
      </SwipeLayer>
    </div>
  );
}
