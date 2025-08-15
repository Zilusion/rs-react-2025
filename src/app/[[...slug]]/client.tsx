'use client';

import dynamic from 'next/dynamic';

const LegacyApp = dynamic(() => import('@/legacy'), {
  ssr: false,
});

export function ClientApp() {
  return <LegacyApp />;
}
