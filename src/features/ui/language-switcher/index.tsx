'use client';

import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={params.locale as string}
      disabled={isPending}
      className="bg-transparent p-1 dark:text-gray-200 text-gray-800 border border-gray-300 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
    </select>
  );
}
