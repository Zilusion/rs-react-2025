import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrength } from './index';

function getBar(): HTMLDivElement {
  const outer = screen.getByRole('progressbar', {}) as HTMLDivElement;
  return outer;
}

describe('PasswordStrength', () => {
  it('shows "Enter a password" and no bar classes when empty', () => {
    render(<PasswordStrength password="" />);
    expect(screen.getByText(/enter a password/i)).toBeInTheDocument();

    const bar = document.querySelector(
      '.mt-1.h-2.w-full.rounded.bg-gray-200 > div',
    ) as HTMLDivElement;

    expect(bar).toBeInTheDocument();
    expect(bar.className).not.toMatch(/w-1\/5|w-2\/5|w-3\/5|w-4\/5|w-full/);
    expect(bar.className).not.toMatch(
      /bg-red-500|bg-orange-500|bg-yellow-500|bg-lime-500|bg-green-500/,
    );
  });

  it('progresses labels and classes with stronger passwords', () => {
    const { rerender } = render(<PasswordStrength password="aaaaaaaa" />);
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
    let bar = getBar();
    expect(bar.className).toMatch(/w-2\/5/);
    expect(bar.className).toMatch(/bg-orange-500/);

    rerender(<PasswordStrength password="Aaaaaaaa" />);
    expect(screen.getByText(/fair/i)).toBeInTheDocument();
    bar = getBar();
    expect(bar.className).toMatch(/w-3\/5/);
    expect(bar.className).toMatch(/bg-yellow-500/);

    rerender(<PasswordStrength password="Aa1aaaaa" />);
    expect(screen.getByText(/good/i)).toBeInTheDocument();
    bar = getBar();
    expect(bar.className).toMatch(/w-4\/5/);
    expect(bar.className).toMatch(/bg-lime-500/);

    rerender(<PasswordStrength password="Aa1!aaaa" />);
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
    bar = getBar();
    expect(bar.className).toMatch(/w-full/);
    expect(bar.className).toMatch(/bg-green-500/);
  });
});
