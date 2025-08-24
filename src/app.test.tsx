import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './app';
import type { Country, FormSubmission } from './types';

vi.mock('@/store/form-submissions', async () => {
  const { create } = await import('zustand');

  interface FormStoreState {
    submissions: FormSubmission[];
    countries: Country[];
    addSubmission: (s: FormSubmission) => void;
    fetchCountries: () => Promise<null>;
  }

  const useFormStore = create<FormStoreState>((set) => ({
    submissions: [],
    countries: [],
    addSubmission: (s) =>
      set((st) => ({ submissions: [s, ...st.submissions] })),
    fetchCountries: vi.fn(async () => null),
  }));

  return { useFormStore };
});

describe('App', () => {
  beforeEach(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'modal-root');
      document.body.appendChild(root);
    }
  });

  it('renders HomePage inside App', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /react forms/i }),
    ).toBeInTheDocument();
  });
});
