import { useEffect, useRef } from 'react';
import { GalleryPost } from '../utils/reddit';
import MediaCard from './MediaCard';
import EmptyState from './ui/EmptyState';
import SectionHeader from './ui/SectionHeader';

type Props = {
  posts: GalleryPost[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onOpen: (postIndex: number, mediaIndex: number) => void;
};

export default function Gallery({ posts, hasMore, isLoadingMore, onLoadMore, onOpen }: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <section className="space-y-4">
      <SectionHeader title="Gallery" count={`${posts.length} posts`} />
      {posts.length === 0 ? (
        <EmptyState>No visual posts found.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post, postIndex) => (
            <MediaCard
              key={post.id}
              title={post.title}
              media={post.media[0]}
              mediaCount={post.media.length}
              onClick={() => onOpen(postIndex, 0)}
            />
          ))}
        </div>
      )}
      {hasMore && (
        <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
      )}
      {isLoadingMore && (
        <p className="text-center text-xs text-chalk/60">Loading more posts…</p>
      )}
    </section>
  );
}
