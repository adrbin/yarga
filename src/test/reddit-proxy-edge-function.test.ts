import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from '../../netlify/edge-functions/reddit-proxy';

describe('reddit proxy edge function', () => {
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

    const response = await handler(
      new Request('https://example.test/api/reddit/r/pics.json?limit=50&after=t3_after1')
    );

    const [upstream, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(upstream)).toBe('https://www.reddit.com/r/pics.json?limit=50&after=t3_after1');
    expect(init.headers).toEqual({
      Accept: 'application/json',
    });
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe('{"ok":true}');
  });

  it('rejects invalid paths', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await handler(new Request('https://example.test/api/reddit/user/me.json'));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it('uses configurable upstream URL', async () => {
    vi.stubEnv('REDDIT_UPSTREAM_BASE_URL', 'https://proxy.example.com/base');
    const fetchMock = vi.fn().mockResolvedValue({
      status: 404,
      headers: { get: () => 'application/json' },
      text: async () => '{"message":"not found"}'
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await handler(
      new Request('https://example.test/api/reddit/subreddits/search.json?q=cats&limit=8&raw_json=1')
    );

    const [upstream] = fetchMock.mock.calls[0] as [URL];
    expect(String(upstream)).toBe(
      'https://proxy.example.com/base/subreddits/search.json?q=cats&limit=8&raw_json=1'
    );
    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('{"message":"not found"}');
  });
});
