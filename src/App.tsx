import { useMemo, useState } from 'react';
import Gallery from './components/Gallery';
import MediaViewer from './components/MediaViewer';
import SearchBar from './components/SearchBar';
import SubredditList from './components/SubredditList';
import { useGallery } from './hooks/useGallery';
import { useSubreddits } from './hooks/useSubreddits';
import { useViewerNavigation } from './hooks/useViewerNavigation';

export default function App() {
  const { favorites, recents, addRecent, remove, toggleFavorite } = useSubreddits();
  const [activeSubreddit, setActiveSubreddit] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'gallery'>('home');
  const galleryState = useGallery(view === 'gallery' ? activeSubreddit : null);
  const viewer = useViewerNavigation(galleryState.posts);

  const handleSelect = (name: string) => {
    addRecent(name);
    setActiveSubreddit(name);
    setView('gallery');
  };

  const selectedLabel = useMemo(() => {
    if (!activeSubreddit) return null;
    return `r/${activeSubreddit}`;
  }, [activeSubreddit]);

  return (
    <div className="min-h-screen bg-ink text-chalk">
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-chalk/50">PWA Gallery</p>
          <h1 className="font-display text-3xl">Yet Another Reddit Gallery App (YARGA)</h1>
          <p className="text-sm text-chalk/70">
            YARGA (Yet Another Reddit Gallery App). Search, favorite, and browse visual posts
            without the clutter.
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
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-chalk/50">Now viewing</p>
                <p className="mt-2 text-lg font-semibold">{selectedLabel}</p>
              </div>
              <button
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-chalk/70 hover:bg-white/10"
                onClick={() => {
                  viewer.close();
                  setView('home');
                }}
              >
                Back
              </button>
            </div>
            {galleryState.status === 'loading' && (
              <p className="text-sm text-chalk/60">Loading gallery…</p>
            )}
            {galleryState.status === 'error' && (
              <p className="text-sm text-ember">Could not load this subreddit.</p>
            )}
            {galleryState.status === 'success' && (
              <Gallery
                posts={galleryState.posts}
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
          onSwipeUp={viewer.nextPost}
          onSwipeDown={viewer.prevPost}
        />
      )}
    </div>
  );
}
