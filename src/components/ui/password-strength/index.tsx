export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function calcStrength(pw: string): number {
  let s = 0;
  if (pw?.length >= 8) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const WIDTHS = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
];

export function PasswordStrength({
  password,
  className = '',
}: PasswordStrengthProps) {
  const strength = calcStrength(password);
  return (
    <div className={className}>
      <div className="mt-1 h-2 w-full rounded bg-gray-200">
        <div
          role="progressbar"
          className={[
            'h-full rounded transition-all',
            strength > 0 ? WIDTHS[strength - 1] : '',
            strength > 0 ? COLORS[strength - 1] : '',
          ].join(' ')}
        />
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {strength ? LABELS[strength - 1] : 'Enter a password'}
      </p>
    </div>
  );
}
