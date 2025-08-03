import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './index';

const TestConsumer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial theme, toggle theme, and update document attribute and localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    const themeValueElement = screen.getByTestId('theme-value');
    const toggleButton = screen.getByRole('button', { name: 'Toggle' });

    expect(themeValueElement).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(toggleButton);

    expect(themeValueElement).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');

    await user.click(toggleButton);

    expect(themeValueElement).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
  });
});
