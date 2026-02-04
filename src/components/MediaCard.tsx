import { MediaItem } from '../utils/reddit';

type Props = {
  title: string;
  media: MediaItem;
  mediaCount: number;
  onClick?: () => void;
};

export default function MediaCard({ title, media, mediaCount, onClick }: Props) {
  const badge = `${media.type.toUpperCase()}${mediaCount > 1 ? ` · ${mediaCount}` : ''}`;

  return (
    <button
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-ink">
        {media.type === 'video' && media.poster ? (
          <img
            src={media.poster}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <img
            src={media.url}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-chalk">
          {badge}
        </span>
      </div>
      <div className="space-y-2 px-4 py-3">
        <p className="max-h-10 overflow-hidden text-sm font-semibold text-chalk">{title}</p>
      </div>
    </button>
  );
}
