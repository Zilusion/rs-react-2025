import { Link } from '@/i18n/navigation';
import { PATHS } from '@/lib/paths';
import { getTranslations } from 'next-intl/server';


export default async function AboutPage() {
  const t = await getTranslations('AboutPage');
  return (
    <div className="container mx-auto flex h-full flex-col justify-center">
      <div className="rounded-lg bg-blue-100 p-8 text-center shadow-md dark:bg-gray-800 dark:shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          {t('description')}
        </p>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t('courseLink')}
        </a>
        <div className="mt-8">
          <Link
            href={PATHS.collection()}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {t('backToSearch')}
          </Link>
        </div>
      </div>
    </div>
  );
}
