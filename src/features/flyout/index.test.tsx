import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flyout } from './index';
import { useSelectedArtworksStore } from '@/store/selected-artworks';
import {
  MOCK_ARTWORK_ANOTHER,
  MOCK_ARTWORK_WITH_IMAGE,
} from '@/__mocks__/artworks';

describe('Flyout component', () => {
  beforeEach(() => {
    act(() => {
      useSelectedArtworksStore.setState({ selectedArtworks: new Map() });
    });
  });

  it('should not be visible when no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('should be visible and display the correct count when items are selected', () => {
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
    });
    render(<Flyout />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should display the plural "items" when multiple items are selected', () => {
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_ANOTHER);
    });

    render(<Flyout />);

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('should call clearAll from the store when "Unselect all" is clicked', async () => {
    const user = userEvent.setup();
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
    });
    render(<Flyout />);

    expect(useSelectedArtworksStore.getState().selectedArtworks.size).toBe(1);

    const unselectAllButton = screen.getByRole('button', {
      name: /Unselect all/i,
    });
    await user.click(unselectAllButton);

    expect(useSelectedArtworksStore.getState().selectedArtworks.size).toBe(0);
  });

  it('should trigger a CSV download when "Download" is clicked', async () => {
    const user = userEvent.setup();

    const createObjectURLSpy = vi.fn(() => 'mock-url');
    window.URL.createObjectURL = createObjectURLSpy;

    const linkClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => null);

    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
    });
    render(<Flyout />);

    const downloadButton = screen.getByRole('button', { name: /Download/i });
    await user.click(downloadButton);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(linkClickSpy).toHaveBeenCalledTimes(1);
  });
});
