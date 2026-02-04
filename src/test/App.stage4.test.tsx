import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

const STORAGE_KEY = 'reddit_gallery_subreddits';

const swipe = (element: HTMLElement, start: [number, number], end: [number, number]) => {
  fireEvent.pointerDown(element, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: start[0],
    clientY: start[1]
  });
  fireEvent.pointerUp(element, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: end[0],
    clientY: end[1]
  });
};

describe('Stage 4 - viewer swipes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('swipes between media and posts', async () => {
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
                id: 'g1',
                title: 'Gallery post',
                is_gallery: true,
                gallery_data: { items: [{ media_id: 'm1' }, { media_id: 'm2' }] },
                media_metadata: {
                  m1: { e: 'Image', s: { u: 'https://example.com/1.jpg' } },
                  m2: { e: 'Image', s: { u: 'https://example.com/2.jpg' } }
                }
              }
            },
            {
              data: {
                id: 'v1',
                title: 'Second post',
                is_video: true,
                media: { reddit_video: { fallback_url: 'https://example.com/v.mp4' } }
              }
            }
          ]
        }
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await user.click(screen.getByText('r/pics'));
    await screen.findByText('Gallery post');

    await user.click(screen.getAllByRole('button', { name: /gallery post/i })[0]);

    const viewer = await screen.findByTestId('media-viewer');
    expect(screen.getByText('Media 1 / 2')).toBeInTheDocument();

    swipe(viewer, [300, 100], [100, 100]);
    expect(await screen.findByText('Media 2 / 2')).toBeInTheDocument();

    swipe(viewer, [100, 300], [100, 100]);
    expect(await within(viewer).findByText('Second post')).toBeInTheDocument();

    swipe(viewer, [100, 100], [100, 300]);
    expect(await within(viewer).findByText('Gallery post')).toBeInTheDocument();
  });
});
