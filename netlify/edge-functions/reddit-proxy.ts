type EnvReader = {
  get?: (name: string) => string | undefined;
};

const DEFAULT_UPSTREAM_BASE_URL = 'https://www.reddit.com';
const PROXY_PREFIX = '/api/reddit';

const getEnv = (name: string) => {
  const processLike = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const fromProcess = processLike.process?.env?.[name];
  if (fromProcess) {
    return fromProcess;
  }

  const denoLike = globalThis as typeof globalThis & {
    Deno?: { env?: EnvReader };
  };
  return denoLike.Deno?.env?.get?.(name);
};

const extractForwardPath = (pathname: string) => {
  if (!pathname.startsWith(PROXY_PREFIX)) {
    return '';
  }
  const path = pathname.slice(PROXY_PREFIX.length);
  return path.startsWith('/') ? path : `/${path}`;
};

const isAllowedTarget = (path: string) => {
  if (path === '/subreddits/search.json') {
    return true;
  }
  return /^\/r\/[A-Za-z0-9_]+\.json$/.test(path);
};

export default async (request: Request): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const targetPath = extractForwardPath(requestUrl.pathname);

  if (!targetPath || !isAllowedTarget(targetPath)) {
    return new Response(JSON.stringify({ error: 'Invalid Reddit proxy path' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }

  try {
    const upstreamBase = getEnv('REDDIT_UPSTREAM_BASE_URL')?.trim() || DEFAULT_UPSTREAM_BASE_URL;
    const upstreamBaseUrl = new URL(upstreamBase);
    const joinedPath = `${upstreamBaseUrl.pathname.replace(/\/+$/, '')}${targetPath}`;
    const upstream = new URL(`${upstreamBaseUrl.origin}${joinedPath}`);
    upstream.search = requestUrl.search;

    const response = await fetch(upstream, {
      headers: {
        Accept: 'application/json'
      }
    });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json; charset=utf-8'
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
};
