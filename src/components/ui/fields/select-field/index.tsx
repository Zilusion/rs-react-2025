import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  options?: SelectOption[];
  containerClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      id,
      label,
      error,
      hint,
      options,
      children,
      containerClassName,
      className = '',
      ...props
    },
    ref,
  ) {
    return (
      <div className={containerClassName ?? 'space-y-1'}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={[
            'w-full rounded-lg border bg-white px-3 py-2 shadow-sm outline-none',
            'border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : '',
            className,
          ].join(' ')}
          {...props}
        >
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
