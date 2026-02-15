type NetlifyEvent = {
  path: string;
  rawQuery?: string;
  rawUrl?: string;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const DEFAULT_UPSTREAM_BASE_URL = 'https://www.reddit.com';

const getEnv = (name: string) => {
  const processLike = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  return processLike.process?.env?.[name];
};

const extractForwardPath = (eventPath: string) => {
  const functionPrefix = '/.netlify/functions/reddit-proxy';
  const proxyPrefix = '/api/reddit';

  if (eventPath.startsWith(functionPrefix)) {
    const path = eventPath.slice(functionPrefix.length);
    return path.startsWith('/') ? path : `/${path}`;
  }
  if (eventPath.startsWith(proxyPrefix)) {
    const path = eventPath.slice(proxyPrefix.length);
    return path.startsWith('/') ? path : `/${path}`;
  }
  return '';
};

const isAllowedTarget = (path: string) => {
  if (path === '/subreddits/search.json') {
    return true;
  }
  return /^\/r\/[A-Za-z0-9_]+\.json$/.test(path);
};

const readQuery = (event: NetlifyEvent) => {
  if (event.rawQuery) {
    return event.rawQuery;
  }
  if (event.rawUrl) {
    return new URL(event.rawUrl).searchParams.toString();
  }
  return '';
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const targetPath = extractForwardPath(event.path);
  if (!targetPath || !isAllowedTarget(targetPath)) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Invalid Reddit proxy path' })
    };
  }

  try {
    const upstreamBase = getEnv('REDDIT_UPSTREAM_BASE_URL')?.trim() || DEFAULT_UPSTREAM_BASE_URL;
    const upstreamBaseUrl = new URL(upstreamBase);
    const joinedPath = `${upstreamBaseUrl.pathname.replace(/\/+$/, '')}${targetPath}`;
    const upstream = new URL(`${upstreamBaseUrl.origin}${joinedPath}`);
    const query = readQuery(event);
    if (query) {
      upstream.search = query;
    }

    const response = await fetch(upstream, {
      headers: {
        Accept: 'application/json',
      }
    });
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json; charset=utf-8'
      },
      body
    };
  } catch {
    return {
      statusCode: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'Upstream request failed' })
    };
  }
};
