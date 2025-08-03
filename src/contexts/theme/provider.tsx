import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
