import { render, screen } from '@testing-library/react';
import { HomePage } from './index';

vi.mock('@/components/ui/modal', () => ({
  Modal: ({
    isOpen,
    children,
    title,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    title: string;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    ) : null,
}));

describe('HomePage component', () => {
  it('should render the initial state correctly with no submissions', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: /React Forms/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No submissions yet/i)).toBeInTheDocument();
  });
});
