import type { FormSubmission } from '@/types';

interface SubmissionCardProps {
  submission: FormSubmission;
  isNew?: boolean;
}

export function SubmissionCard({
  submission,
  isNew = false,
}: SubmissionCardProps) {
  const { name, age, email, gender, country, picture } = submission;

  const base =
    'relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-900';
  const normal = 'border-gray-200 dark:border-gray-700';
  const highlight =
    'border-green-300 ring-2 ring-green-200 dark:border-green-700 dark:ring-green-900/40';
  const classes = [base, isNew ? highlight : normal].join(' ');

  return (
    <article className={classes} aria-live={isNew ? 'polite' : undefined}>
      {isNew && (
        <span className="absolute top-3 right-3 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 shadow-sm select-none dark:bg-green-900/40 dark:text-green-200">
          NEW
        </span>
      )}

      <div className="flex items-start gap-4">
        <img
          src={
            picture ||
            'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%2280%22 height=%2280%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2254%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22>no img</text></svg>'
          }
          alt={`${name}'s profile`}
          className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-900/40"
        />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {age} years old
          </p>

          <a
            href={`mailto:${email}`}
            className="mt-1 block truncate text-sm font-medium text-purple-700 hover:underline dark:text-purple-300"
            title={email}
          >
            {email}
          </a>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize dark:bg-gray-800 dark:text-gray-300">
              {gender}
            </span>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:ring-purple-900/40">
              {country}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
