import { create } from 'zustand';
import type { Artwork } from '@/api/artworks-api.types';

interface SelectedArtworksState {
  selectedArtworks: Map<number, Artwork>;
  addArtwork: (artwork: Artwork) => void;
  removeArtwork: (artworkId: number) => void;
  clearAll: () => void;
  isSelected: (artworkId: number) => boolean;
}

export const useSelectedArtworksStore = create<SelectedArtworksState>(
  (set, get) => ({
    selectedArtworks: new Map(),

    addArtwork: (artwork) =>
      set((state) => {
        const newMap = new Map(state.selectedArtworks);
        newMap.set(artwork.id, artwork);
        return { selectedArtworks: newMap };
      }),

    removeArtwork: (artworkId) =>
      set((state) => {
        const newMap = new Map(state.selectedArtworks);
        newMap.delete(artworkId);
        return { selectedArtworks: newMap };
      }),

    clearAll: () => set({ selectedArtworks: new Map() }),

    isSelected: (artworkId) => get().selectedArtworks.has(artworkId),
  }),
);
