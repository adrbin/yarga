import { Subreddit } from '../hooks/useSubreddits';

type Props = {
  title: string;
  items: Subreddit[];
  onRemove: (name: string) => void;
  onSelect?: (name: string) => void;
  onToggleFavorite?: (name: string) => void;
};

export default function SubredditList({
  title,
  items,
  onRemove,
  onSelect,
  onToggleFavorite
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg uppercase tracking-wide text-chalk/80">
          {title}
        </h2>
        <span className="text-xs text-chalk/50">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-chalk/50">Nothing here yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between rounded-xl bg-ink/60 px-3 py-2"
            >
              <button
                className="text-sm font-medium"
                onClick={() => onSelect?.(item.name)}
              >
                r/{item.name}
              </button>
              <div className="flex items-center gap-2">
                {onToggleFavorite && (
                  <button
                    className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-wide text-chalk/70 hover:bg-white/10"
                    onClick={() => onToggleFavorite(item.name)}
                    aria-label={`Toggle favorite ${item.name}`}
                  >
                    {item.favorited ? 'Unfavorite' : 'Favorite'}
                  </button>
                )}
                <button
                  className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-wide text-chalk/70 hover:bg-white/10"
                  onClick={() => onRemove(item.name)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
