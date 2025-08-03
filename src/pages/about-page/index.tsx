import { PATHS } from '@/lib/paths';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="container mx-auto flex h-full flex-col justify-center">
      <div className="rounded-lg bg-blue-100 p-8 text-center shadow-md dark:bg-gray-800 dark:shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          About This Project
        </h1>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          This application was created by Sudorgin Daniil as part of the React
          course from RS School.
        </p>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          Learn more about the RS School React Course
        </a>
        <div className="mt-8">
          <Link
            to={PATHS.collection()}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
