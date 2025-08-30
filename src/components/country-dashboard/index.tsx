import { useState } from 'react';
import type { Country } from '@/types';
import { useDataResource } from '@/api/co2-data';
import { ColumnSelector } from '../column-selector';
import { Controls } from '../controls';
import { CountryList } from '../country-list';
import { Modal } from '../modal';

export function CountryDashboard() {
  const allCountries = useDataResource();

  const allPossibleColumns = Array.from(
    new Set(allCountries.flatMap((c) => c.data.flatMap((d) => Object.keys(d)))),
  ).filter(
    (key) => !['year', 'population', 'co2', 'co2_per_capita'].includes(key),
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'population';
    direction: 'asc' | 'desc';
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultColumns = ['population', 'co2', 'co2_per_capita'];
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  let processedCountries: Country[] = [...allCountries];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    processedCountries = processedCountries.filter((country) =>
      country.name.toLowerCase().includes(term),
    );
  }

  if (sortConfig !== null) {
    processedCountries.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      if (sortConfig.key === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else {
        aValue = a.data.find((d) => d.year === selectedYear)?.population;
        bValue = b.data.find((d) => d.year === selectedYear)?.population;
      }

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleToggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  };

  return (
    <div className="container-app">
      <Controls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        onOpenColumnSelector={() => setIsModalOpen(true)}
      />

      <CountryList
        countries={processedCountries}
        selectedYear={selectedYear}
        visibleColumns={[...defaultColumns, ...selectedColumns]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Additional Columns"
      >
        <ColumnSelector
          allColumns={allPossibleColumns}
          selectedColumns={selectedColumns}
          onColumnChange={handleToggleColumn}
        />
      </Modal>
    </div>
  );
}
