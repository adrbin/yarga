const DEFAULT_REDDIT_BASE_URL = 'https://www.reddit.com';

export const getRedditBaseUrl = () => {
  const configured = import.meta.env.VITE_REDDIT_BASE_URL?.trim();
  if (!configured) {
    return DEFAULT_REDDIT_BASE_URL;
  }
  return configured;
};

export const buildRedditUrl = (
  path: string,
  query?: Record<string, string | number | undefined>
) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getRedditBaseUrl();
  const isAbsolute = base.startsWith('http://') || base.startsWith('https://');
  const url = isAbsolute
    ? (() => {
        const baseUrl = new URL(base);
        const joinedPath = `${baseUrl.pathname.replace(/\/+$/, '')}${normalizedPath}`;
        return new URL(`${baseUrl.origin}${joinedPath}`);
      })()
    : new URL(`${base.replace(/\/+$/, '')}${normalizedPath}`, window.location.origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  if (!isAbsolute) {
    return `${url.pathname}${url.search}`;
  }
  return url.toString();
};
