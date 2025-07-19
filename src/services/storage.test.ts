import {
  getStoredSearchTerm,
  setStoredSearchTerm,
  clearStoredSearchTerm,
  SEARCH_TERM_KEY,
} from './storage';

describe('Storage service', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('getStoredSearchTerm should call localStorage.getItem with the correct key', () => {
    getStoredSearchTerm();

    expect(getItemSpy).toHaveBeenCalledWith(SEARCH_TERM_KEY);
  });

  it('setStoredSearchTerm should call localStorage.setItem with the correct key and value', () => {
    const searchTerm = 'cats';

    setStoredSearchTerm(searchTerm);

    expect(setItemSpy).toHaveBeenCalledWith(SEARCH_TERM_KEY, searchTerm);
  });

  it('clearStoredSearchTerm should call localStorage.removeItem with the correct key', () => {
    clearStoredSearchTerm();

    expect(removeItemSpy).toHaveBeenCalledWith(SEARCH_TERM_KEY);
  });

  it('getStoredSearchTerm should return the stored value', () => {
    const searchTerm = 'cats';
    localStorage.setItem(SEARCH_TERM_KEY, searchTerm);

    const result = getStoredSearchTerm();

    expect(result).toBe(searchTerm);
  });

  it('getStoredSearchTerm should return null if no value is stored', () => {
    const result = getStoredSearchTerm();

    expect(result).toBeNull();
  });
});
