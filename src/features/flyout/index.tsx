'use client';

import { generateAndDownloadCsv } from '@/app/actions';
import { useSelectedArtworksStore } from '@/store/selected-artworks';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

export function Flyout() {
  const selectedArtworks = useSelectedArtworksStore(
    (state) => state.selectedArtworks,
  );
  const clearAll = useSelectedArtworksStore((state) => state.clearAll);
  const count = selectedArtworks.size;

  const [isPending] = useTransition();

  const t = useTranslations('Flyout');

  const handleDownload = async () => {
    const artworksArray = Array.from(selectedArtworks.values());
    const csvString = await generateAndDownloadCsv(artworksArray);
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
        <span className="font-medium">{t('itemsSelected', { count })}</span>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            disabled={isPending}
            className="rounded-md bg-white/20 px-4 py-2 transition hover:bg-white/30"
          >
            {isPending ? t('generating') : t('download')}
          </button>
          <button
            onClick={clearAll}
            className="rounded-md bg-white/20 px-4 py-2 transition hover:bg-white/30"
          >
            {t('unselectAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
