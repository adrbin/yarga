import { GalleryPost } from '../utils/reddit';
import MediaCard from './MediaCard';
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
        <p className="text-sm text-chalk/50">No visual posts found.</p>
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
