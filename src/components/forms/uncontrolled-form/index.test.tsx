import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UncontrolledForm } from './index';
import { useFormStore } from '@/store/form-submissions';
import type { Country, FormSubmission } from '@/types';

vi.mock('@/lib/file-utils', () => {
  return {
    fileToBase64: vi.fn(async () => 'data:image/png;base64,TEST'),
  };
});

function seedCountries(list: Country[]): void {
  useFormStore.setState({
    submissions: [],
    countries: list,
  });
}

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], countries: [] });
  });

  it('renders all required fields and submit button', () => {
    seedCountries([
      {
        name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
      },
    ]);

    render(<UncontrolledForm onSuccess={() => null} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i accept the terms and conditions/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/enter a password/i)).toBeInTheDocument();
  });

  it('validates only on submit: shows errors after submit with empty fields', async () => {
    seedCountries([
      {
        name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
      },
    ]);

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/please confirm your password\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/gender is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/image is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/please select a country\./i)).toBeInTheDocument();
  });

  it('updates password strength live (without submit)', async () => {
    seedCountries([
      {
        name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
      },
    ]);

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    const user = userEvent.setup();
    const pw = screen.getByLabelText(/^password$/i) as HTMLInputElement;

    expect(screen.getByText(/enter a password/i)).toBeInTheDocument();
    await user.type(pw, 'Aa1!aaaa');
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('submits valid form: calls onSuccess, updates store submissions and resets password strength text', async () => {
    seedCountries([
      {
        name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
      },
    ]);

    const onSuccess = vi.fn((d: FormSubmission) => d);
    render(<UncontrolledForm onSuccess={onSuccess} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/age/i), '25');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');

    await user.type(screen.getByLabelText(/^password$/i), 'Aa1!aaaa');
    await user.type(screen.getByLabelText(/confirm password/i), 'Aa1!aaaa');

    await user.selectOptions(screen.getByLabelText(/gender/i), 'male');
    await user.type(screen.getByLabelText(/country/i), 'Netherlands');

    const file = new File([new Uint8Array([1, 2, 3])], 'avatar.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByLabelText(
      /profile picture/i,
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    const terms = screen.getByLabelText(/i accept the terms and conditions/i);
    await user.click(terms);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSuccess).toHaveBeenCalledTimes(1);
    const passed = onSuccess.mock.calls[0]?.[0] as FormSubmission;
    expect(passed).toMatchObject({
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      country: 'Netherlands',
      picture: 'data:image/png;base64,TEST',
    });
    expect(typeof passed.id).toBe('string');
    expect(passed.id.length).toBeGreaterThan(0);

    const { submissions } = useFormStore.getState();
    expect(submissions.length).toBe(1);
    expect(submissions[0]).toEqual(passed);
  });

  it('shows mismatch error for confirmPassword when both pw fields pass basic validation', async () => {
    seedCountries([
      {
        name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
      },
    ]);

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');

    await user.type(screen.getByLabelText(/^password$/i), 'Aa1!aaaa');
    await user.type(screen.getByLabelText(/confirm password/i), 'Aa1!bbbb');

    await user.selectOptions(screen.getByLabelText(/gender/i), 'male');
    await user.type(screen.getByLabelText(/country/i), 'Netherlands');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/passwords don't match/i),
    ).toBeInTheDocument();
  });
});
