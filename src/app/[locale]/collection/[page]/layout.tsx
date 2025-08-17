'use client';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function CollectionPageLayout({
  list,
  details,
}: {
  list: React.ReactNode;
  details: React.ReactNode;
}) {
  const detailsSeg = useSelectedLayoutSegment('details');
  const hasDetails = !!detailsSeg && detailsSeg !== 'page';
  return (
    <div className="relative container mx-auto grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
      <main className={hasDetails ? 'md:col-span-2' : 'md:col-span-3'}>
        {list}
      </main>
      {hasDetails && <aside className="md:col-span-1">{details}</aside>}
    </div>
  );
}
