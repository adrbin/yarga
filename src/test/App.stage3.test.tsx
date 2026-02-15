import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { buildRedditUrl } from '../utils/redditApi';

const STORAGE_KEY = 'reddit_gallery_subreddits';

describe('Stage 3 - gallery view', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads and displays visual posts for a subreddit', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: [{ name: 'pics', lastVisitedAt: 1, favorited: false }] })
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          children: [
            {
              data: {
                id: 'img1',
                title: 'Nice photo',
                post_hint: 'image',
                url_overridden_by_dest: 'https://example.com/img.jpg'
              }
            },
            {
              data: {
                id: 'text1',
                title: 'No media'
              }
            }
          ]
        }
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await user.click(screen.getByText('r/pics'));

    expect(await screen.findByText('Gallery')).toBeInTheDocument();
    expect(await screen.findByText('Nice photo')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      buildRedditUrl('/r/pics.json', { limit: 50 }),
      expect.anything()
    );
  });
});
