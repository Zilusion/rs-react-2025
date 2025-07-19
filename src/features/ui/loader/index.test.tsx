import { render, screen } from '@testing-library/react';
import { Loader } from '.';

describe('Loader component', () => {
  it('should render', () => {
    render(<Loader />);
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
  });
});
