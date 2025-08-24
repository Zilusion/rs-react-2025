import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { id, label, error, hint, containerClassName, className = '', ...props },
    ref,
  ) {
    return (
      <div className={containerClassName ?? 'space-y-1'}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={[
            'w-full rounded-lg border px-3 py-2 shadow-sm outline-none',
            'border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : '',
            className,
          ].join(' ')}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
