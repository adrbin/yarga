import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const STORAGE_KEY = 'reddit_gallery_subreddits';

describe('Stage 1 - shell lists', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders recent and favorite lists from storage', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: [
          { name: 'imaginary', lastVisitedAt: 1, favorited: false },
          { name: 'earthporn', lastVisitedAt: 2, favorited: true }
        ]
      })
    );

    render(<App />);

    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Recently Visited')).toBeInTheDocument();
    expect(screen.getAllByText('r/earthporn').length).toBeGreaterThan(0);
    expect(screen.getByText('r/imaginary')).toBeInTheDocument();
  });

  it('removes items from a list', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: [{ name: 'earthporn', lastVisitedAt: 2, favorited: true }]
      })
    );

    render(<App />);

    await user.click(screen.getAllByRole('button', { name: /remove earthporn/i })[0]);
    expect(screen.queryByText('r/earthporn')).not.toBeInTheDocument();
  });
});
