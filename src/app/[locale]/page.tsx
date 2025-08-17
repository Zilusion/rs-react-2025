import { redirect } from 'next/navigation';
import { PATHS } from '@/lib/paths';

export default function LocaleRootPage() {
  redirect(PATHS.collection());
}
