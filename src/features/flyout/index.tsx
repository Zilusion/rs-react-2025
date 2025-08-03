import type { Artwork } from '@/api/artworks-api.types';
import { escapeCsvCell } from '@/lib/csv-utils';
import { useSelectedArtworksStore } from '@/store/selected-artworks';

export function Flyout() {
  const selectedArtworks = useSelectedArtworksStore(
    (state) => state.selectedArtworks,
  );
  const clearAll = useSelectedArtworksStore((state) => state.clearAll);
  const count = selectedArtworks.size;

  const handleDownload = () => {
    const artworksArray = Array.from(selectedArtworks.values());

    const headers = ['ID', 'Title', 'Artist', 'Date', 'URL'];
    const csvRows = [
      headers.join(','),
      ...artworksArray.map((art: Artwork) =>
        [
          art.id,
          escapeCsvCell(art.title),
          escapeCsvCell(art.artist_display),
          escapeCsvCell(art.date_display),
          `https://www.artic.edu/artworks/${art.id}`,
        ].join(','),
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${count}_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-20 w-11/12 max-w-2xl -translate-x-1/2 rounded-lg bg-blue-600 px-6 py-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {count} {count === 1 ? 'item' : 'items'} selected
        </span>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="rounded-md bg-white/20 px-4 py-2 transition hover:bg-white/30"
          >
            Download
          </button>
          <button
            onClick={clearAll}
            className="rounded-md bg-white/20 px-4 py-2 transition hover:bg-white/30"
          >
            Unselect all
          </button>
        </div>
      </div>
    </div>
  );
}
