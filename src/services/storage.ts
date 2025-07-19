export const SEARCH_TERM_KEY = 'artworks-search-term';

export function getStoredSearchTerm(): string | null {
  return localStorage.getItem(SEARCH_TERM_KEY);
}

export function setStoredSearchTerm(searchTerm: string): void {
  localStorage.setItem(SEARCH_TERM_KEY, searchTerm);
}

export function clearStoredSearchTerm(): void {
  localStorage.removeItem(SEARCH_TERM_KEY);
}
