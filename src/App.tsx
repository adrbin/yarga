import { useCallback, useMemo, useRef, useState } from 'react';
import Gallery from './components/Gallery';
import MediaViewer from './components/MediaViewer';
import SearchBar from './components/SearchBar';
import SubredditList from './components/SubredditList';
import Button from './components/ui/Button';
import EmptyState from './components/ui/EmptyState';
import Kicker from './components/ui/Kicker';
import Panel from './components/ui/Panel';
import { useGallery } from './hooks/useGallery';
import { useSubreddits } from './hooks/useSubreddits';
import { useViewerNavigation } from './hooks/useViewerNavigation';

export default function App() {
  const { favorites, recents, addRecent, remove, toggleFavorite } = useSubreddits();
  const [activeSubreddit, setActiveSubreddit] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'gallery'>('home');
  const galleryState = useGallery(view === 'gallery' ? activeSubreddit : null);
  const viewer = useViewerNavigation(galleryState.posts);
  const viewerLoadMoreInFlightRef = useRef(false);

  const handleSelect = (name: string) => {
    addRecent(name);
    setActiveSubreddit(name);
    setView('gallery');
  };

  const selectedLabel = useMemo(() => {
    if (!activeSubreddit) return null;
    return `r/${activeSubreddit}`;
  }, [activeSubreddit]);

  const handleGalleryLoadMore = useCallback(() => {
    void galleryState.loadMore();
  }, [galleryState]);

  const handleViewerNextPost = useCallback(async () => {
    const currentPostIndex = viewer.state.postIndex;
    const isLastLoadedPost = currentPostIndex >= galleryState.posts.length - 1;
    if (!isLastLoadedPost) {
      viewer.nextPost();
      return;
    }

    if (!galleryState.hasMore || viewerLoadMoreInFlightRef.current) {
      return;
    }

    viewerLoadMoreInFlightRef.current = true;
    try {
      const appendedCount = await galleryState.loadMore();
      if (appendedCount > 0) {
        viewer.open(currentPostIndex + 1, 0);
      }
    } finally {
      viewerLoadMoreInFlightRef.current = false;
    }
  }, [galleryState, viewer]);

  return (
    <div className="min-h-screen bg-ink text-chalk">
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="space-y-3">
          <Kicker className="tracking-[0.4em]">PWA Gallery</Kicker>
          <h1 className="font-display text-3xl">Yet Another Reddit Gallery App (YARGA)</h1>
          <p className="text-sm text-chalk/70">
            Search, favorite, and browse visual posts without the clutter.
          </p>
        </header>

        {view === 'home' ? (
          <>
            <SearchBar onSelect={handleSelect} />
            <div className="grid gap-4 md:grid-cols-2">
              <SubredditList
                title="Favorites"
                items={favorites}
                onRemove={remove}
                onSelect={handleSelect}
                onToggleFavorite={toggleFavorite}
              />
              <SubredditList
                title="Recently Visited"
                items={recents}
                onRemove={remove}
                onSelect={handleSelect}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </>
        ) : (
          <section className="space-y-4">
            <Panel as="div" className="flex items-center justify-between">
              <div>
                <Kicker>Now viewing</Kicker>
                <p className="mt-2 text-lg font-semibold">{selectedLabel}</p>
              </div>
              <Button
                variant="pill"
                size="pill-md"
                onClick={() => {
                  viewer.close();
                  setView('home');
                }}
              >
                Back
              </Button>
            </Panel>
            {galleryState.status === 'loading' && (
              <EmptyState className="text-chalk/60">Loading gallery…</EmptyState>
            )}
            {galleryState.status === 'error' && (
              <EmptyState tone="error">Could not load this subreddit.</EmptyState>
            )}
            {galleryState.status === 'success' && (
              <Gallery
                posts={galleryState.posts}
                hasMore={galleryState.hasMore}
                isLoadingMore={galleryState.isLoadingMore}
                onLoadMore={handleGalleryLoadMore}
                onOpen={(postIndex, mediaIndex) => viewer.open(postIndex, mediaIndex)}
              />
            )}
          </section>
        )}
      </main>
      {viewer.state.isOpen && viewer.current.post && viewer.current.media && (
        <MediaViewer
          post={viewer.current.post}
          media={viewer.current.media}
          postIndex={viewer.state.postIndex}
          postCount={galleryState.posts.length}
          mediaIndex={viewer.state.mediaIndex}
          mediaCount={viewer.current.post.media.length}
          onBack={viewer.close}
          onSwipeLeft={viewer.nextMedia}
          onSwipeRight={viewer.prevMedia}
          onSwipeUp={() => {
            void handleViewerNextPost();
          }}
          onSwipeDown={viewer.prevPost}
        />
      )}
    </div>
  );
}
