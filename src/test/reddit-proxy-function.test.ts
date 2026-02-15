import { afterEach, describe, expect, it, vi } from 'vitest';
import { handler } from '../../netlify/functions/reddit-proxy';

describe('reddit proxy function', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('forwards allowed subreddit requests and preserves query', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json; charset=utf-8' },
      text: async () => '{"ok":true}'
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await handler({
      path: '/.netlify/functions/reddit-proxy/r/pics.json',
      rawQuery: 'limit=50&after=t3_after1'
    });

    const [upstream, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(upstream)).toBe('https://www.reddit.com/r/pics.json?limit=50&after=t3_after1');
    expect(init.headers).toEqual({
      Accept: 'application/json',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{"ok":true}');
  });

  it('rejects invalid paths', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await handler({
      path: '/.netlify/functions/reddit-proxy/user/me.json'
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
  });

  it('uses configurable upstream URL', async () => {
    vi.stubEnv('REDDIT_UPSTREAM_BASE_URL', 'https://proxy.example.com/base');
    const fetchMock = vi.fn().mockResolvedValue({
      status: 404,
      headers: { get: () => 'application/json' },
      text: async () => '{"message":"not found"}'
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await handler({
      path: '/api/reddit/subreddits/search.json',
      rawQuery: 'q=cats&limit=8&raw_json=1'
    });

    const [upstream] = fetchMock.mock.calls[0] as [URL];
    expect(String(upstream)).toBe(
      'https://proxy.example.com/base/subreddits/search.json?q=cats&limit=8&raw_json=1'
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('{"message":"not found"}');
  });
});

