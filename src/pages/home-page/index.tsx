import { useState, useEffect } from 'react';
import { useFormStore } from '@/store/form-submissions';
import { SubmissionCard } from '@/components/ui/submission-card';
import { Modal } from '@/components/ui/modal';
import { UncontrolledForm } from '@/components/forms/uncontrolled-form';
import type { FormSubmission } from '@/types';
import { RHFForm } from '@/components/forms/react-hook-form';

export function HomePage() {
  const submissions = useFormStore((state) => state.submissions);
  const countries = useFormStore((state) => state.countries);
  const fetchCountries = useFormStore((state) => state.fetchCountries);

  useEffect(() => {
    if (!countries || countries.length === 0) {
      void fetchCountries();
    }
  }, [countries, fetchCountries]);

  const [newSubmissionIdentifier, setNewSubmissionIdentifier] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'uncontrolled' | 'rhf' | null>(
    null,
  );

  const handleOpenUncontrolledForm = () => {
    setActiveForm('uncontrolled');
    setIsModalOpen(true);
  };

  const handleOpenRhfForm = () => {
    setActiveForm('rhf');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveForm(null), 300);
  };

  const handleFormSuccess = (newSubmission: FormSubmission) => {
    setNewSubmissionIdentifier(newSubmission.id);
    handleCloseModal();
  };

  useEffect(() => {
    if (newSubmissionIdentifier) {
      const timer = setTimeout(() => setNewSubmissionIdentifier(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [newSubmissionIdentifier]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 md:px-8">
      <div aria-live="polite" className="sr-only">
        {newSubmissionIdentifier ? 'New submission added' : ''}
      </div>

      <header className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-6 text-white shadow-lg ring-1 ring-black/5">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">React Forms</h1>
            <p className="mt-1 text-white/80">
              Uncontrolled vs. React Hook Form — same UX, different approaches.
            </p>
          </div>

          <div className="mt-4 flex gap-3 md:mt-0">
            <button
              onClick={handleOpenUncontrolledForm}
              className="group inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 font-medium text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="opacity-90 transition group-hover:opacity-100"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M10 3h4a1 1 0 0 1 1 1v3h3a1 1 0 0 1 1 1v4h-2V9h-3v3h-2V5h-2v7H8V9H5v4H3V8a1 1 0 0 1 1-1h3V4a1 1 0 0 1 1-1Z"
                />
                <path
                  fill="currentColor"
                  d="M5 19h14a2 2 0 0 0 2-2v-3h-2v3H5v-3H3v3a2 2 0 0 0 2 2Z"
                />
              </svg>
              Open Uncontrolled
            </button>

            <button
              onClick={handleOpenRhfForm}
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-purple-700 shadow-sm transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="text-purple-700 opacity-90 transition group-hover:opacity-100"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M4 5h16v2H4zm0 6h16v2H4zm0 6h10v2H4z"
                />
              </svg>
              Open RHF
            </button>
          </div>
        </div>
      </header>

      <section className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Submissions
        </h2>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {submissions.length} item{submissions.length === 1 ? '' : 's'}
        </span>
      </section>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
          <p className="mx-auto max-w-md">
            No submissions yet. Start by filling one of the forms.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={handleOpenUncontrolledForm}
              className="rounded-lg bg-purple-600 px-5 py-2 font-medium text-white shadow-sm transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              Uncontrolled Form
            </button>
            <button
              onClick={handleOpenRhfForm}
              className="rounded-lg border border-purple-200 bg-white px-5 py-2 font-medium text-purple-700 shadow-sm transition hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:border-purple-400/30 dark:bg-gray-900 dark:text-purple-300 dark:hover:bg-gray-800"
            >
              React Hook Form
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              isNew={newSubmissionIdentifier === submission.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          activeForm === 'uncontrolled'
            ? 'Uncontrolled Form'
            : 'React Hook Form'
        }
      >
        {activeForm === 'uncontrolled' && (
          <UncontrolledForm
            onSuccess={handleFormSuccess}
            countries={countries}
          />
        )}
        {activeForm === 'rhf' && (
          <RHFForm onSuccess={handleFormSuccess} countries={countries} />
        )}
      </Modal>
    </div>
  );
}
