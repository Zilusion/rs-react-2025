import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from './use-local-storage-state';

const TEST_KEY = 'testKey';

describe('useLocalStorageState Hook', () => {
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return the default value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorageState(TEST_KEY, 'default'),
    );

    expect(result.current[0]).toBe('default');
    expect(getItemSpy).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should return the stored value from localStorage if it exists', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify('stored value'));

    const { result } = renderHook(() =>
      useLocalStorageState(TEST_KEY, 'default'),
    );

    expect(result.current[0]).toBe('stored value');
    expect(getItemSpy).toHaveBeenCalledWith(TEST_KEY);
  });

  it('should update state and write to localStorage when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorageState(TEST_KEY, 'default'),
    );
    const newValue = 'new value';

    act(() => {
      const setValue = result.current[1];
      setValue(newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(setItemSpy).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(newValue));
  });

  it('should return the default value if localStorage parsing fails', () => {
    localStorage.setItem(TEST_KEY, 'invalid json');
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    const { result } = renderHook(() =>
      useLocalStorageState(TEST_KEY, 'default'),
    );

    expect(result.current[0]).toBe('default');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when writing to localStorage', () => {
    setItemSpy.mockImplementation(() => {
      throw new Error('Storage is full');
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    const { result } = renderHook(() =>
      useLocalStorageState(TEST_KEY, 'default'),
    );
    act(() => {
      const setValue = result.current[1];
      setValue('new value');
    });

    expect(setItemSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error writing to localStorage'),
    );

    consoleErrorSpy.mockRestore();
  });
});
