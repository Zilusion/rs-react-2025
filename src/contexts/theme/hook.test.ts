import { act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from './index';

describe('useTheme hook', () => {
  it('should throw an error if used outside of a ThemeProvider', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return the theme context value when used within a ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe('light');
    expect(typeof result.current.toggleTheme).toBe('function');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});
