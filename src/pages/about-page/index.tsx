import { PATHS } from '@/lib/paths';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="container mx-auto flex h-full flex-col justify-center">
      <div className="rounded-lg bg-blue-100 p-8 text-center shadow-md">
        <h1 className="mb-4 text-4xl font-bold">About This Project</h1>
        <p className="mb-4 text-lg">
          This application was created by Sudorgin Daniil as part of the React
          course from RS School.
        </p>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-blue-600 hover:underline"
        >
          Learn more about the RS School React Course
        </a>
        <div className="mt-8">
          <Link
            to={PATHS.collection()}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
