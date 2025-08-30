import type { Country } from '@/types';
import { memo } from 'react';

export interface CountryRowProps {
  country: Country;
  selectedYear: number;
  visibleColumns: string[];
}

export const CountryRow = memo(function CountryRow({
  country,
  selectedYear,
  visibleColumns,
}: CountryRowProps) {
  const yearData = country.data.find((d) => d.year === selectedYear);

  const baseCols: {
    key: 'population' | 'co2' | 'co2_per_capita';
    label: string;
  }[] = [
    { key: 'population', label: 'Population' },
    { key: 'co2', label: 'CO₂' },
    { key: 'co2_per_capita', label: 'CO₂ per capita' },
  ];

  const extraCols = visibleColumns.filter(
    (c) => !['population', 'co2', 'co2_per_capita'].includes(c),
  );

  const renderVal = (k: string) => {
    const v = yearData?.[k as keyof typeof yearData];
    if (typeof v === 'number') return v.toLocaleString();
    return v ?? 'N/A';
  };

  return (
    <tr className="transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="td">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {country.name}
        </div>
      </td>
      <td className="td">{country.iso_code ?? 'N/A'}</td>
      <td className="td">{selectedYear}</td>

      {baseCols.map(({ key }) => (
        <td key={key} className="td">
          {renderVal(key)}
        </td>
      ))}

      {extraCols.map((col) => (
        <td key={col} className="td">
          {renderVal(col)}
        </td>
      ))}
    </tr>
  );
}, areEqual);

function areEqual(prev: CountryRowProps, next: CountryRowProps) {
  if (prev.selectedYear !== next.selectedYear) return false;
  if (prev.country !== next.country) return false;
  if (prev.visibleColumns.length !== next.visibleColumns.length) return false;
  for (let i = 0; i < prev.visibleColumns.length; i++) {
    if (prev.visibleColumns[i] !== next.visibleColumns[i]) return false;
  }
  return true;
}
