import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { buildRedditUrl } from '../utils/redditApi';

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

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    IntersectionObserverMock.instances.push(this);
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  trigger = (isIntersecting = true) => {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  };
}

describe('Stage 5 - infinite post pagination', () => {
  beforeEach(() => {
    window.localStorage.clear();
    IntersectionObserverMock.instances = [];
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads next page when gallery sentinel intersects', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: [{ name: 'pics', lastVisitedAt: 1, favorited: false }] })
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            after: 't3_after1',
            children: [
              {
                data: {
                  id: 'p1',
                  title: 'First page post',
                  post_hint: 'image',
                  url_overridden_by_dest: 'https://example.com/first.jpg'
                }
              }
            ]
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            after: null,
            children: [
              {
                data: {
                  id: 'p2',
                  title: 'Second page post',
                  post_hint: 'image',
                  url_overridden_by_dest: 'https://example.com/second.jpg'
                }
              }
            ]
          }
        })
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    await user.click(screen.getByText('r/pics'));
    expect(await screen.findByText('First page post')).toBeInTheDocument();

    act(() => {
      IntersectionObserverMock.instances.forEach((instance) => instance.trigger(true));
    });

    expect(await screen.findByText('Second page post')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      buildRedditUrl('/r/pics.json', { limit: 50, after: 't3_after1' })
    );
  });

  it('auto-loads and advances when requesting the next post at the end', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: [{ name: 'pics', lastVisitedAt: 1, favorited: false }] })
    );

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            after: 't3_after1',
            children: [
              {
                data: {
                  id: 'p1',
                  title: 'First page post',
                  post_hint: 'image',
                  url_overridden_by_dest: 'https://example.com/first.jpg'
                }
              }
            ]
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            after: null,
            children: [
              {
                data: {
                  id: 'p2',
                  title: 'Second page post',
                  post_hint: 'image',
                  url_overridden_by_dest: 'https://example.com/second.jpg'
                }
              }
            ]
          }
        })
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    await user.click(screen.getByText('r/pics'));
    await screen.findByText('First page post');
    await user.click(screen.getByRole('button', { name: /first page post/i }));

    const viewer = await screen.findByTestId('media-viewer');
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    expect(await within(viewer).findByText('Second page post')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      buildRedditUrl('/r/pics.json', { limit: 50, after: 't3_after1' })
    );
  });

  it('does not load extra pages when hasMore is false', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: [{ name: 'pics', lastVisitedAt: 1, favorited: false }] })
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          after: null,
          children: [
            {
              data: {
                id: 'p1',
                title: 'Only page post',
                post_hint: 'image',
                url_overridden_by_dest: 'https://example.com/first.jpg'
              }
            }
          ]
        }
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    await user.click(screen.getByText('r/pics'));
    await screen.findByText('Only page post');
    await user.click(screen.getByRole('button', { name: /only page post/i }));

    const viewer = await screen.findByTestId('media-viewer');
    swipe(viewer, [100, 300], [100, 100]);

    act(() => {
      IntersectionObserverMock.instances.forEach((instance) => instance.trigger(true));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
