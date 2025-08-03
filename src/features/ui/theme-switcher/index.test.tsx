import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSwitcher } from './index';
import { ThemeProvider } from '@/contexts/theme';

describe('ThemeSwitcher component', () => {
  it('should toggle the theme on click', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toHaveTextContent('🌙');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(button);

    expect(button).toHaveTextContent('☀️');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
