import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { SelectField } from './index';

describe('SelectField', () => {
  it('associates label with select and renders options from `options` prop', async () => {
    render(
      <SelectField
        id="gender"
        label="Gender"
        options={[
          { value: '', label: 'Select gender', disabled: true },
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
        defaultValue=""
      />,
    );

    const select = screen.getByLabelText(/gender/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: /select gender/i }),
    ).toBeDisabled();
    expect(screen.getAllByRole('option')[0]).toHaveTextContent(
      /select gender/i,
    );
    expect(screen.getAllByRole('option')[1]).toHaveTextContent(/male/i);
    expect(screen.getByRole('option', { name: /female/i })).toBeInTheDocument();

    await userEvent.selectOptions(select, 'female');
    expect(select.value).toBe('female');
  });

  it('renders children when `options` not provided', () => {
    render(
      <SelectField id="x" label="X">
        <option value="a">A</option>
        <option value="b">B</option>
      </SelectField>,
    );
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'B' })).toBeInTheDocument();
  });

  it('shows error and applies error style', () => {
    render(
      <SelectField
        id="s"
        label="Select"
        error="Required"
        options={[{ value: '1', label: 'One' }]}
      />,
    );
    const select = screen.getByLabelText(/select/i);
    expect(select.className).toMatch(/border-red-500/);
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('forwards ref to the select element', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <SelectField
        id="y"
        label="Y"
        options={[{ value: '1', label: 'One' }]}
        ref={ref}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
