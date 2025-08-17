'use server';

import { Artwork } from '@/api/artworks-api.types';
import { escapeCsvCell } from '@/lib/csv-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRetry(path: string) {
  revalidatePath(path);
  redirect(path);
}

export async function generateAndDownloadCsv(artworksArray: Artwork[]) {
  const headers = ['ID', 'Title', 'Artist', 'Date', 'URL'];

  const csvRows = [
    headers.join(','),
    ...artworksArray.map((art) =>
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

  return csvString;
}
