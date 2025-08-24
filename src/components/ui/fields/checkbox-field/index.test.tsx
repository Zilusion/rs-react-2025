import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxField } from './index';
import React from 'react';

describe('CheckboxField', () => {
  it('renders checkbox and associates label via htmlFor', async () => {
    render(
      <CheckboxField id="terms" label="I accept T&C" aria-label="terms" />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await userEvent.click(screen.getByText(/i accept t&c/i));
    expect(checkbox).toBeChecked();
  });

  it('shows hint when provided and no error', () => {
    render(
      <CheckboxField
        id="terms"
        label="I accept T&C"
        hint="Required to proceed"
      />,
    );
    expect(screen.getByText(/required to proceed/i)).toBeInTheDocument();
  });

  it('shows error and hides hint when error present', () => {
    render(
      <CheckboxField
        id="terms"
        label="I accept T&C"
        hint="Required to proceed"
        error="You must accept the Terms and Conditions."
      />,
    );

    expect(screen.queryByText(/required to proceed/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/you must accept the terms and conditions\./i),
    ).toBeInTheDocument();
  });

  it('forwards ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<CheckboxField id="x" label="X" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('respects containerClassName override', () => {
    const { container } = render(
      <CheckboxField id="y" label="Y" containerClassName="my-container" />,
    );
    const rootDiv = container.querySelector('div');
    expect(rootDiv?.className).toContain('my-container');
  });
});
