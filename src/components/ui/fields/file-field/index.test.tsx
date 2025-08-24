import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileField } from './index';
import React from 'react';

describe('FileField', () => {
  it('renders with label associated to input (auto id via useId)', () => {
    render(<FileField label="Profile Picture" aria-label="pp" />);

    const input = screen.getByLabelText(/profile picture/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  });

  it('uses provided id when passed', () => {
    render(<FileField id="pic" label="Upload" />);
    const input = screen.getByLabelText(/upload/i);
    expect(input.getAttribute('id')).toBe('pic');
  });

  it('shows selected filename when `value` is a string path and showSelected=true', () => {
    render(
      <FileField
        label="Avatar"
        value={'C:\\fakepath\\image.png'}
        showSelected
      />,
    );

    const selectedLine = screen.getAllByText((_, node) => {
      const text = node?.textContent ?? '';
      return /Selected:\s*image\.png/i.test(text);
    })[0];

    expect(selectedLine).toBeInTheDocument();
  });

  it('does not show selected filename when showSelected=false', () => {
    render(
      <FileField
        label="Avatar"
        value={'C:\\fakepath\\image.png'}
        showSelected={false}
      />,
    );

    const selectedLine = screen.queryByText((_, node) => {
      const text = node?.textContent ?? '';
      return /Selected:\s*image\.png/i.test(text);
    });

    expect(selectedLine).not.toBeInTheDocument();
  });

  it('applies error styles and renders error text', () => {
    render(<FileField label="Doc" error="Invalid file" />);
    const input = screen.getByLabelText(/doc/i);
    expect(input.className).toMatch(/border-red-500/);
    expect(screen.getByText(/invalid file/i)).toBeInTheDocument();
  });

  it('forwards ref to file input', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<FileField label="X" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('fires onChange when user selects a file (programmatic change)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      return e;
    });

    render(<FileField id="file" label="Choose file" onChange={handleChange} />);
    const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

    const file = new File([new Uint8Array([1, 2, 3])], 'a.txt', {
      type: 'text/plain',
    });
    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.files?.length).toBe(1);
    expect(input.files?.[0]?.name).toBe('a.txt');
  });
});
