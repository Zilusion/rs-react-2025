import Link from 'next/link';

export default async function DetailSlotPage({
  params,
}: {
  params: { page: string; artworkId: string };
}) {
  const awaitedParams = await params;
  const page = Number(awaitedParams.page) || 1;
  const id = Number(awaitedParams.artworkId) || 0;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">DETAIL SLOT</h1>
      <p>Details for Artwork ID: {id}</p>
      <Link
        href={`/collection/${page}`}
        scroll={false}
        className="inline-block rounded border px-2 py-1 text-sm hover:bg-gray-50"
        replace
      >
        Close details
      </Link>
    </div>
  );
}
