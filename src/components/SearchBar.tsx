import { useState } from 'react';
import { SubredditSearchResult, useSubredditSearch } from '../hooks/useSubredditSearch';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import Kicker from './ui/Kicker';
import Panel from './ui/Panel';

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
  const normalizedQuery = normalizeSubreddit(query);
  const showManualOption =
    normalizedQuery.length > 0 && !results.some((item) => item.name === normalizedQuery);

  const handleSelect = (item: SubredditSearchResult) => {
    onSelect(item.name);
    setQuery('');
  };

  const handleManualSelect = (value: string) => {
    const normalized = normalizeSubreddit(value);
    if (!normalized) return;
    onSelect(normalized);
    setQuery('');
  };

  return (
    <Panel>
      <label htmlFor="search">
        <Kicker className="tracking-[0.3em]">Subreddit Search</Kicker>
      </label>
      <input
        id="search"
        className="mt-3 w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-chalk"
        placeholder="Search subreddits"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleManualSelect(query);
          }
        }}
      />
      <div className="mt-3 space-y-2">
        {status === 'loading' && (
          <p className="text-xs uppercase tracking-[0.2em] text-chalk/40">Searching…</p>
        )}
        {status === 'error' && (
          <p className="text-xs uppercase tracking-[0.2em] text-ember">Search failed</p>
        )}
        {status === 'success' && results.length === 0 && !showManualOption && (
          <EmptyState>No matches yet.</EmptyState>
        )}
        {showManualOption && (
          <Button
            variant="list"
            size="list"
            className="flex w-full items-center justify-between"
            onClick={() => handleManualSelect(query)}
          >
            <span className="text-sm">
              <span className="font-semibold">Go to r/{normalizedQuery}</span>
              <span className="ml-2 text-xs text-chalk/50">Open directly</span>
            </span>
            <span className="text-xs text-chalk/50">Enter</span>
          </Button>
        )}
        {results.map((item) => (
          <Button
            key={item.name}
            variant="list"
            size="list"
            className="flex w-full items-center justify-between"
            onClick={() => handleSelect(item)}
          >
            <span className="text-sm">
              <span className="font-semibold">r/{item.name}</span>
              <span className="ml-2 text-xs text-chalk/50">{item.title}</span>
            </span>
            <span className="text-xs text-chalk/50">
              {formatSubscribers(item.subscribers)} members
            </span>
          </Button>
        ))}
      </div>
    </Panel>
  );
}

const normalizeSubreddit = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const cleaned = trimmed
    .replace(/^https?:\/\/(www\.)?reddit\.com\/r\//i, '')
    .replace(/^\/?r\//i, '')
    .replace(/\/.*/g, '')
    .trim();
  return cleaned.toLowerCase();
};
