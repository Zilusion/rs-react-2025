import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/store/form-submissions', async () => {
  const { create } = await import('zustand');

  interface FormStoreState {
    submissions: FormSubmission[];
    countries: Country[];
    addSubmission: (newSubmission: FormSubmission) => void;
    fetchCountries: () => Promise<null>;
  }

  const useFormStore = create<FormStoreState>((set) => ({
    submissions: [],
    countries: [],
    addSubmission: (newSubmission) =>
      set((state) => ({ submissions: [newSubmission, ...state.submissions] })),
    fetchCountries: async () => null,
  }));

  return { useFormStore };
});

vi.mock('@/lib/file-utils', () => {
  return {
    fileToBase64: vi.fn(async () => 'data:image/png;base64,TESTDATA'),
  };
});

import { RHFForm } from './index';
import { useFormStore } from '@/store/form-submissions';
import { fileToBase64 } from '@/lib/file-utils';
import type { FormSubmission, Country } from '@/types';

function seedCountries(names: string[]): void {
  const countries = names.map((n) => ({ name: { common: n, official: n } }));
  useFormStore.setState({ countries });
}

describe('RHFForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFormStore.setState({ submissions: [], countries: [] });
  });

  it('renders fields and keeps the Submit button disabled until a valid state; then enables', async () => {
    seedCountries(['Netherlands']);
    const onSuccess = vi.fn();

    render(<RHFForm onSuccess={onSuccess} />);

    const user = userEvent.setup();

    const name = screen.getByLabelText(/name/i);
    const age = screen.getByLabelText(/age/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/^password$/i);
    const confirm = screen.getByLabelText(/confirm password/i);
    const gender = screen.getByLabelText(/gender/i);
    const country = screen.getByLabelText(/country/i);
    const picture = screen.getByLabelText(/profile picture/i);
    const terms = screen.getByLabelText(/i accept the terms/i);
    const submit = screen.getByRole('button', { name: /submit/i });

    expect(submit).toBeDisabled();

    await user.type(name, 'john');
    expect(submit).toBeDisabled();

    await user.clear(name);
    await user.type(name, 'John');

    await user.type(age, '25');
    await user.type(email, 'john@example.com');
    await user.type(password, 'Aa1!aaaa');
    await user.type(confirm, 'Aa1!aaaa');

    await user.selectOptions(gender, 'male');
    await user.type(country, 'Netherlands');

    const file = new File([new Uint8Array([1, 2, 3])], 'avatar.png', {
      type: 'image/png',
    });
    await user.upload(picture, file);

    await user.click(terms);

    await waitFor(() => expect(submit).toBeEnabled());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('shows password confirmation error only after user actions; re-validates confirm on password change', async () => {
    seedCountries(['Netherlands']);
    render(<RHFForm onSuccess={() => null} />);
    const user = userEvent.setup();

    const password = screen.getByLabelText(/^password$/i);
    const confirm = screen.getByLabelText(/confirm password/i);

    await user.type(password, 'Aa1!aaaa');
    expect(
      screen.queryByText(/passwords don't match/i),
    ).not.toBeInTheDocument();

    await user.type(confirm, 'Aa1!bbbb');
    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();

    await user.clear(confirm);
    await user.type(confirm, 'Aa1!aaaa');
    await waitFor(() =>
      expect(
        screen.queryByText(/passwords don't match/i),
      ).not.toBeInTheDocument(),
    );

    await user.clear(password);
    await user.type(password, 'Bb1!bbbb');
    await screen.findByText(/passwords don't match/i);
  });

  it('successfully submits a valid form: calls onSuccess, stores in store, converts file to base64 and blocks the button during submission', async () => {
    seedCountries(['Netherlands']);
    const onSuccess = vi.fn();

    const delayed = vi.fn(
      () =>
        new Promise<string>((resolve) =>
          setTimeout(() => resolve('data:image/png;base64,DELAYED'), 50),
        ),
    );
    (fileToBase64 as unknown as typeof delayed).mockImplementation(delayed);

    render(<RHFForm onSuccess={onSuccess} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Aa1!aaaa');
    await user.type(screen.getByLabelText(/confirm password/i), 'Aa1!aaaa');
    await user.selectOptions(screen.getByLabelText(/gender/i), 'male');
    await user.type(screen.getByLabelText(/country/i), 'Netherlands');

    const file = new File([new Uint8Array([9, 9, 9])], 'p.png', {
      type: 'image/png',
    });
    await user.upload(screen.getByLabelText(/profile picture/i), file);

    await user.click(screen.getByLabelText(/i accept the terms/i));

    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(submit).toBeDisabled();
    expect(submit).toHaveTextContent(/submitting/i);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    const calledWith = onSuccess.mock.calls[0]?.[0];
    expect(calledWith).toBeTruthy();
    expect(calledWith.name).toBe('John');
    expect(calledWith.age).toBe(30);
    expect(calledWith.email).toBe('john@example.com');
    expect(calledWith.gender).toBe('male');
    expect(calledWith.country).toBe('Netherlands');
    expect(typeof calledWith.id).toBe('string');
    expect(calledWith.picture).toBe('data:image/png;base64,DELAYED');

    const state = useFormStore.getState();
    expect(state.submissions.length).toBe(1);
    expect(state.submissions[0].email).toBe('john@example.com');

    expect(fileToBase64).toHaveBeenCalledTimes(1);
    const firstArg = // @ts-expect-error Mocked function is not a function, it's a jest mock object
      (fileToBase64 as unknown as (f: File) => Promise<string>).mock
        ?.calls?.[0]?.[0] as File | undefined;
    expect(firstArg).toBeInstanceOf(File);
    expect(firstArg?.name).toBe('p.png');

    await waitFor(() => expect(submit).toBeEnabled());
  });
  it('displays password strength in PasswordStrength', async () => {
    seedCountries(['Netherlands']);
    render(<RHFForm onSuccess={() => null} />);
    const user = userEvent.setup();

    expect(screen.getByText(/enter a password/i)).toBeInTheDocument();

    const pw = screen.getByLabelText(/^password$/i);
    await user.type(pw, 'a');
    expect(
      screen.getByText(/weak|too weak|fair|good|strong/i),
    ).toBeInTheDocument();

    await user.clear(pw);
    await user.type(pw, 'Aa1!aaaa');
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
