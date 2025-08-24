import React from 'react';

export interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SubmitButton({
  children,
  loading,
  disabled,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={[
        'w-full rounded-lg bg-purple-600 px-6 py-2 font-medium text-white shadow-sm transition',
        'hover:bg-purple-700 focus:ring-2 focus:ring-purple-300 focus:outline-none disabled:bg-gray-400',
        className,
      ].join(' ')}
    >
      {loading ? 'Submitting…' : children}
    </button>
  );
}
