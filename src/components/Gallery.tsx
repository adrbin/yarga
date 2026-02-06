import { GalleryPost } from '../utils/reddit';
import MediaCard from './MediaCard';
import EmptyState from './ui/EmptyState';
import SectionHeader from './ui/SectionHeader';

type Props = {
  posts: GalleryPost[];
  onOpen: (postIndex: number, mediaIndex: number) => void;
};

export default function Gallery({ posts, onOpen }: Props) {
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
    </section>
  );
}
