import { act } from '@testing-library/react';
import { useSelectedArtworksStore } from './selected-artworks';
import {
  MOCK_ARTWORK_WITH_IMAGE,
  MOCK_ARTWORK_ANOTHER,
} from '@/__mocks__/artworks';

describe('useSelectedArtworksStore', () => {
  beforeEach(() => {
    act(() => {
      useSelectedArtworksStore.setState({ selectedArtworks: new Map() });
    });
  });

  it('should have an empty map initially', () => {
    const { selectedArtworks } = useSelectedArtworksStore.getState();
    expect(selectedArtworks.size).toBe(0);
  });

  it('should add an artwork to the selection', () => {
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
    });

    const { selectedArtworks, isSelected } =
      useSelectedArtworksStore.getState();
    expect(selectedArtworks.size).toBe(1);
    expect(selectedArtworks.get(MOCK_ARTWORK_WITH_IMAGE.id)).toEqual(
      MOCK_ARTWORK_WITH_IMAGE,
    );
    expect(isSelected(MOCK_ARTWORK_WITH_IMAGE.id)).toBe(true);
  });

  it('should remove an artwork from the selection', () => {
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
    });
    expect(useSelectedArtworksStore.getState().selectedArtworks.size).toBe(1);

    act(() => {
      useSelectedArtworksStore
        .getState()
        .removeArtwork(MOCK_ARTWORK_WITH_IMAGE.id);
    });

    const { selectedArtworks, isSelected } =
      useSelectedArtworksStore.getState();
    expect(selectedArtworks.size).toBe(0);
    expect(isSelected(MOCK_ARTWORK_WITH_IMAGE.id)).toBe(false);
  });

  it('should clear all selected artworks', () => {
    act(() => {
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_WITH_IMAGE);
      useSelectedArtworksStore.getState().addArtwork(MOCK_ARTWORK_ANOTHER);
    });
    expect(useSelectedArtworksStore.getState().selectedArtworks.size).toBe(2);

    act(() => {
      useSelectedArtworksStore.getState().clearAll();
    });

    expect(useSelectedArtworksStore.getState().selectedArtworks.size).toBe(0);
  });
});
