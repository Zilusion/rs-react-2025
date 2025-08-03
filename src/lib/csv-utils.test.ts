import { escapeCsvCell } from './csv-utils';

describe('escapeCsvCell', () => {
  it('should return the string representation of a simple value', () => {
    expect(escapeCsvCell('hello')).toBe('hello');
    expect(escapeCsvCell(123)).toBe('123');
  });

  it('should wrap the value in double quotes if it contains a comma', () => {
    expect(escapeCsvCell('Hello, world')).toBe('"Hello, world"');
  });

  it('should escape double quotes and wrap the value', () => {
    expect(escapeCsvCell('He said "Hello"')).toBe('"He said ""Hello"""');
  });

  it('should replace newlines with spaces and wrap the value', () => {
    expect(escapeCsvCell('Line 1\nLine 2')).toBe('"Line 1 Line 2"');
  });

  it('should handle commas, quotes, and newlines all together', () => {
    expect(escapeCsvCell('A, "B",\nC')).toBe('"A, ""B"", C"');
  });

  it('should return an empty string for null or undefined input', () => {
    expect(escapeCsvCell(null)).toBe('');
    expect(escapeCsvCell(undefined)).toBe('');
  });
});
