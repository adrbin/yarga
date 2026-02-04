import { useState } from 'react';
import { SubredditSearchResult, useSubredditSearch } from '../hooks/useSubredditSearch';

const formatSubscribers = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return `${count}`;
};

type Props = {
  onSelect: (name: string) => void;
};

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const { status, results } = useSubredditSearch(query);

  const handleSelect = (item: SubredditSearchResult) => {
    onSelect(item.name);
    setQuery('');
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <label className="text-xs uppercase tracking-[0.3em] text-chalk/50" htmlFor="search">
        Subreddit Search
      </label>
      <input
        id="search"
        className="mt-3 w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-chalk"
        placeholder="Search subreddits"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="mt-3 space-y-2">
        {status === 'loading' && (
          <p className="text-xs uppercase tracking-[0.2em] text-chalk/40">Searching…</p>
        )}
        {status === 'error' && (
          <p className="text-xs uppercase tracking-[0.2em] text-ember">Search failed</p>
        )}
        {results.map((item) => (
          <button
            key={item.name}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-ink/70 px-3 py-2 text-left hover:bg-white/10"
            onClick={() => handleSelect(item)}
          >
            <span className="text-sm">
              <span className="font-semibold">r/{item.name}</span>
              <span className="ml-2 text-xs text-chalk/50">{item.title}</span>
            </span>
            <span className="text-xs text-chalk/50">
              {formatSubscribers(item.subscribers)} members
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
