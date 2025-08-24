import { forwardRef, type InputHTMLAttributes, useId } from 'react';

export type FileFieldProps = {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  showSelected?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  function FileField(
    {
      id,
      label,
      error,
      hint,
      containerClassName,
      className = '',
      showSelected = true,
      value,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? `file-${autoId}`;

    const filename =
      typeof value === 'string' && value ? (value.split('\\').pop() ?? '') : '';

    return (
      <div className={containerClassName ?? 'space-y-1'}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-800"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          type="file"
          className={[
            'block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none',
            'file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white',
            'focus:border-purple-600 focus:ring-2 focus:ring-purple-200',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : '',
            className,
          ].join(' ')}
          value={value as string | undefined}
          {...props}
        />
        {showSelected && filename && (
          <p className="text-xs text-gray-600">
            Selected: <span className="font-medium">{filename}</span>
          </p>
        )}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
