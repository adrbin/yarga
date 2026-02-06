import { Subreddit } from '../hooks/useSubreddits';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import Panel from './ui/Panel';
import SectionHeader from './ui/SectionHeader';

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
    <Panel>
      <SectionHeader className="mb-3" title={title} count={items.length} />
      {items.length === 0 ? (
        <EmptyState>Nothing here yet.</EmptyState>
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
                  <Button
                    variant="pill"
                    size="pill-sm"
                    onClick={() => onToggleFavorite(item.name)}
                    aria-label={`Toggle favorite ${item.name}`}
                  >
                    {item.favorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                )}
                <Button
                  variant="pill"
                  size="pill-sm"
                  onClick={() => onRemove(item.name)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
