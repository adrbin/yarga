import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildRedditUrl, getRedditBaseUrl } from '../utils/redditApi';

describe('redditApi', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses Reddit base URL by default', () => {
    vi.stubEnv('VITE_REDDIT_BASE_URL', '');
    expect(getRedditBaseUrl()).toBe('https://www.reddit.com');
    expect(buildRedditUrl('/r/pics.json', { limit: 50 })).toBe(
      'https://www.reddit.com/r/pics.json?limit=50'
    );
  });

  it('joins relative proxy base URL', () => {
    vi.stubEnv('VITE_REDDIT_BASE_URL', '/api/reddit');
    expect(buildRedditUrl('/r/pics.json', { limit: 50, after: 't3_after1' })).toBe(
      '/api/reddit/r/pics.json?limit=50&after=t3_after1'
    );
  });

  it('joins absolute base URL', () => {
    vi.stubEnv('VITE_REDDIT_BASE_URL', 'https://example.com/api/reddit');
    expect(buildRedditUrl('/subreddits/search.json', { q: 'pics', raw_json: 1 })).toBe(
      'https://example.com/api/reddit/subreddits/search.json?q=pics&raw_json=1'
    );
  });

  it('skips undefined query values', () => {
    vi.stubEnv('VITE_REDDIT_BASE_URL', 'https://www.reddit.com');
    expect(buildRedditUrl('/r/pics.json', { limit: 50, after: undefined })).toBe(
      'https://www.reddit.com/r/pics.json?limit=50'
    );
  });
});
