export const escapeCsvCell = (
  cell: string | number | null | undefined,
): string => {
  if (cell === null || cell === undefined) {
    return '';
  }

  const cellStr = String(cell);
  const processedStr = cellStr.replace(/"/g, '""');

  if (
    cellStr.includes(',') ||
    cellStr.includes('"') ||
    cellStr.includes('\n')
  ) {
    const cleanedStr = processedStr.replace(/(\r\n|\n|\r)/gm, ' ');
    return `"${cleanedStr}"`;
  }

  return processedStr;
};
