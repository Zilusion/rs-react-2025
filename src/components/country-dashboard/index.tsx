import { memo, useCallback, useMemo, useState } from 'react';
import type { Country, Region } from '@/types';
import { useDataResource } from '@/api/co2-data';
import { ColumnSelector } from '../column-selector';
import { Controls, type SortDirection, type SortKey } from '../controls';
import { CountryList } from '../country-list';
import { Modal } from '../modal';
import { ALL_REGIONS } from '@/constants/regions';

export const CountryDashboard = memo(function CountryDashboard() {
  const allCountries = useDataResource();

  const allPossibleColumns = useMemo(() => {
    const keys = new Set<string>();
    for (const c of allCountries) {
      for (const d of c.data) {
        for (const k of Object.keys(d)) keys.add(k);
      }
    }
    keys.delete('year');
    keys.delete('population');
    keys.delete('co2');
    keys.delete('co2_per_capita');
    return Array.from(keys).sort();
  }, [allCountries]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const defaultColumns = useMemo(
    () => ['population', 'co2', 'co2_per_capita'],
    [],
  );
  const visibleColumns = useMemo(
    () => [...defaultColumns, ...selectedColumns],
    [selectedColumns, defaultColumns],
  );
  const [region, setRegion] = useState<Region | 'All'>('All');

  const processedCountries: Country[] = useMemo(() => {
    let list: Country[] = allCountries;

    if (region !== 'All') {
      list = list.filter((c) => c.region === region);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((country) =>
        country.name.toLowerCase().includes(term),
      );
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;
      const dir = direction === 'asc' ? 1 : -1;
      const sorted = [...list];
      sorted.sort((a, b) => {
        if (key === 'name') {
          return a.name.localeCompare(b.name) * dir;
        }
        const ap = a.data.find((d) => d.year === selectedYear)?.population;
        const bp = b.data.find((d) => d.year === selectedYear)?.population;
        if (ap == null && bp == null) return 0;
        if (ap == null) return 1;
        if (bp == null) return -1;
        if (ap < bp) return -1 * dir;
        if (ap > bp) return 1 * dir;
        return 0;
      });
      return sorted;
    }

    return list;
  }, [allCountries, searchTerm, sortConfig, selectedYear, region]);

  const handleSort = useCallback((key: 'name' | 'population') => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleToggleColumn = useCallback((column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  }, []);

  const openColumnsModal = useCallback(() => setIsModalOpen(true), []);
  const closeColumnsModal = useCallback(() => setIsModalOpen(false), []);

  const onSearch = useCallback((value: string) => setSearchTerm(value), []);
  const onChangeYear = useCallback((year: number) => setSelectedYear(year), []);
  const onChangeRegion = useCallback((r: Region | 'All') => setRegion(r), []);

  return (
    <div className="container-app">
      <Controls
        searchTerm={searchTerm}
        onSearch={onSearch}
        selectedYear={selectedYear}
        onChangeYear={onChangeYear}
        onSort={handleSort}
        onOpenColumnSelector={openColumnsModal}
        region={region}
        onChangeRegion={onChangeRegion}
        regions={ALL_REGIONS}
      />

      <CountryList
        countries={processedCountries}
        selectedYear={selectedYear}
        visibleColumns={visibleColumns}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeColumnsModal}
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
});
