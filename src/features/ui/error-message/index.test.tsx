import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '.';

describe('ErrorMessage component', () => {
  it('should render with the correct message', () => {
    const errorMessageText = 'Something went wrong';
    render(<ErrorMessage error={errorMessageText} />);

    const container = screen.getByRole('alert');

    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent(`Error: ${errorMessageText}`);
  });
});
