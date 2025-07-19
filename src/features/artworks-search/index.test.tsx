import { render, screen } from '@testing-library/react';
import { ArtworksSearch } from '.';
import userEvent from '@testing-library/user-event';

describe('ArtworksSearch component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with the correct initial value', () => {
    render(<ArtworksSearch initialValue="forest" onSearch={mockOnSearch} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('forest');
  });

  it('should call onSearch with the current trimmed input value when the form is submitted', async () => {
    render(<ArtworksSearch initialValue="" onSearch={mockOnSearch} />);

    await userEvent.type(screen.getByRole('searchbox'), '   forest ');
    await userEvent.click(
      screen.getByRole('button', { name: 'Submit search' }),
    );

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('forest');
  });

  it('should update the search term when the input value changes', async () => {
    render(<ArtworksSearch initialValue="" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'forest');

    expect(input).toHaveValue('forest');
  });
});
