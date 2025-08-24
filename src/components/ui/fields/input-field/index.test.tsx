import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { InputField } from './index';

describe('InputField', () => {
  it('associates label with input via htmlFor', () => {
    render(<InputField id="name" label="Name" placeholder="John" />);
    const input = screen.getByLabelText(/name/i);
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).placeholder).toBe('John');
  });

  it('shows hint when provided and no error', () => {
    render(<InputField id="age" label="Age" hint="Numbers only" />);
    expect(screen.getByText(/numbers only/i)).toBeInTheDocument();
  });

  it('shows error and hides hint when error is present', () => {
    render(
      <InputField
        id="email"
        label="Email"
        hint="We will not spam"
        error="Invalid email"
      />,
    );
    expect(screen.queryByText(/we will not spam/i)).not.toBeInTheDocument();
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('applies error classes on input when error present', () => {
    render(<InputField id="pwd" label="Password" error="Bad" />);
    const input = screen.getByLabelText(/password/i);
    expect(input.className).toMatch(/border-red-500/);
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputField id="x" label="X" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through native props (type, inputMode, onChange)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <InputField
        id="n"
        label="Number"
        type="number"
        inputMode="numeric"
        onChange={handleChange}
      />,
    );
    const input = screen.getByLabelText(/number/i);
    await user.type(input, '42');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });
});
