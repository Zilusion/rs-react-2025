import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmissionCard } from './index';
import type { FormSubmission } from '@/types';

const baseSubmission: FormSubmission = {
  id: '1',
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  password: 'Aa1!aaaa',
  confirmPassword: 'Aa1!aaaa',
  gender: 'male',
  acceptTerms: true,
  picture: 'data:image/png;base64,abc',
  country: 'Netherlands',
};

describe('SubmissionCard', () => {
  it('renders core fields and mailto link', () => {
    render(<SubmissionCard submission={baseSubmission} />);
    expect(
      screen.getByRole('heading', { name: /john doe/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/30 years old/i)).toBeInTheDocument();

    const mail = screen.getByRole('link', { name: /john@example\.com/i });
    expect(mail).toHaveAttribute('href', 'mailto:john@example.com');
    expect(mail).toHaveAttribute('title', 'john@example.com');

    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/netherlands/i)).toBeInTheDocument();

    const img = screen.getByAltText(/john doe's profile/i) as HTMLImageElement;
    expect(img.src).toContain('data:image/png;base64,abc');
  });

  it('shows fallback image when picture is empty', () => {
    const submission: FormSubmission = { ...baseSubmission, picture: '' };
    render(<SubmissionCard submission={submission} />);
    const img = screen.getByAltText(/john doe's profile/i) as HTMLImageElement;
    expect(img.src).toMatch(/^data:image\/svg\+xml/);
  });

  it('highlights as NEW when isNew=true and adds accessibility aid', () => {
    render(<SubmissionCard submission={baseSubmission} isNew />);
    expect(screen.getByText(/new/i)).toBeInTheDocument();

    const article =
      screen.getByRole('article', { hidden: true }) ||
      (document.querySelector('article') as HTMLElement);

    expect(article.className).toMatch(/ring-2/);
    expect(article.getAttribute('aria-live')).toBe('polite');
  });

  it('does not show NEW badge when isNew=false', () => {
    render(<SubmissionCard submission={baseSubmission} isNew={false} />);
    expect(screen.queryByText(/new/i)).not.toBeInTheDocument();

    const article = document.querySelector('article') as HTMLElement;
    expect(article.className).toMatch(/border-gray-200|dark:border-gray-700/);
    expect(article.className).not.toMatch(/ring-2/);
  });
});
