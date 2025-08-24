import { forwardRef, type InputHTMLAttributes } from 'react';

export type CheckboxFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(
    { id, label, error, hint, className = '', containerClassName, ...props },
    ref,
  ) {
    return (
      <div className={containerClassName ?? 'space-y-1'}>
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-sm text-gray-800"
        >
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={[
              'h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500',
              className,
            ].join(' ')}
            {...props}
          />
          {label}
        </label>
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
