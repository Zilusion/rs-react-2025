import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubmitButton } from './index';

describe('SubmitButton', () => {
  it('renders as type=submit by default with given children', () => {
    render(<SubmitButton>Send</SubmitButton>);
    const btn = screen.getByRole('button', { name: /send/i });
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).not.toBeDisabled();
  });

  it('shows loading state and becomes disabled when loading=true', () => {
    render(<SubmitButton loading>Send</SubmitButton>);
    const btn = screen.getByRole('button', { name: /submitting…/i });
    expect(btn).toBeDisabled();
  });

  it('is disabled when disabled=true', () => {
    render(<SubmitButton disabled>Send</SubmitButton>);
    const btn = screen.getByRole('button', { name: /send/i });
    expect(btn).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<SubmitButton className="extra">Send</SubmitButton>);
    const btn = screen.getByRole('button', { name: /send/i });
    expect(btn.className).toMatch(/extra/);
  });
});
