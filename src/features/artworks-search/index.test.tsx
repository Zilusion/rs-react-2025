import { render, screen } from '@testing-library/react';
import { ArtworksSearch } from '.';
import userEvent from '@testing-library/user-event';
import { type FormProps } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  Form: (props: FormProps) => <form {...props} />,
}));

describe('ArtworksSearch component', () => {
  it('should render with the correct initial value', () => {
    render(<ArtworksSearch initialValue="forest" />);
    expect(screen.getByRole('searchbox')).toHaveValue('forest');
  });

  it('should update the input value as the user types', async () => {
    const user = userEvent.setup();
    render(<ArtworksSearch initialValue="" />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'forest');
    expect(input).toHaveValue('forest');
  });
});
