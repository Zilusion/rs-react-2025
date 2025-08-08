import { PATHS } from './paths';

describe('Path Helpers', () => {
  describe('PATHS.collection', () => {
    it('should return the path for the first page by default', () => {
      expect(PATHS.collection()).toBe('/collection/1');
    });

    it('should return the path for a specific page number', () => {
      expect(PATHS.collection(5)).toBe('/collection/5');
    });
  });

  describe('PATHS.details', () => {
    it('should return the correct path for artwork details', () => {
      expect(PATHS.details(5, 123)).toBe('/collection/5/123');
    });
  });

  it('should contain correct static paths', () => {
    expect(PATHS.home).toBe('/');
    expect(PATHS.about).toBe('/about');
  });
});
