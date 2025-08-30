import type { Country } from '@/types';
import { CountryRow } from '../country-row';
import { useState, useEffect } from 'react';

export interface CountryListProps {
  countries: Country[];
  selectedYear: number;
  visibleColumns: string[];
}

export function CountryList({
  countries,
  selectedYear,
  visibleColumns,
}: CountryListProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [selectedYear]);

  return (
    <div className="table-wrap">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-xl bg-blue-500/10 ring-2 ring-blue-500/60 transition-opacity duration-700 ${
          flash ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <table className="table">
        <thead className="thead">
          <tr>
            <th scope="col" className="th">
              Country
            </th>
            <th scope="col" className="th">
              ISO Code
            </th>
            <th scope="col" className="th">
              Year
            </th>
            <th scope="col" className="th">
              Population
            </th>
            <th scope="col" className="th">
              CO₂
            </th>
            <th scope="col" className="th">
              CO₂ per capita
            </th>
            {visibleColumns.map(
              (col) =>
                !['population', 'co2', 'co2_per_capita'].includes(col) && (
                  <th key={col} scope="col" className="th">
                    {col.replace(/_/g, ' ')}
                  </th>
                ),
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {countries.map((country) => (
            <CountryRow
              key={`${country.iso_code ?? 'NOISO'}:${country.name}`}
              country={country}
              selectedYear={selectedYear}
              visibleColumns={visibleColumns}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
