import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

const STORAGE_KEY = 'reddit_gallery_subreddits';

describe('Stage 2 - search and persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adds a selected subreddit to recents', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          children: [
            {
              data: {
                display_name: 'Pics',
                title: 'Pictures',
                subscribers: 1000,
                icon_img: ''
              }
            }
          ]
        }
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await user.type(screen.getByLabelText(/subreddit search/i), 'pi');
    const result = await screen.findByText('r/pics');
    await user.click(result);

    expect(screen.getAllByText('r/pics')[0]).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.items[0].name).toBe('pics');
  });

  it('toggles favorite status from the list', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: [{ name: 'earthporn', lastVisitedAt: 2, favorited: false }] })
    );

    render(<App />);

    await user.click(screen.getByRole('button', { name: /toggle favorite earthporn/i }));
    expect(screen.getAllByText('r/earthporn')[0]).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.items[0].favorited).toBe(true);
  });
});
