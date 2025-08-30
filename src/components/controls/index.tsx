import type { Region } from '@/types';
import { memo } from 'react';

export type SortDirection = 'asc' | 'desc';
export type SortKey = 'name' | 'population';

export interface ControlsProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedYear: number;
  onChangeYear: (year: number) => void;
  onSort: (key: SortKey) => void;
  onOpenColumnSelector: () => void;
  region: Region | 'All';
  onChangeRegion: (region: Region | 'All') => void;
  regions: readonly Region[];
}

export const Controls = memo(function Controls({
  searchTerm,
  onSearch,
  selectedYear,
  onChangeYear,
  onSort,
  onOpenColumnSelector,
  region,
  onChangeRegion,
  regions,
}: ControlsProps) {
  return (
    <div className="card sticky top-5 z-10">
      <div className="card-section flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex w-full gap-3 sm:w-auto">
          <input
            type="search"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="input"
            aria-label="Search country"
            name="search"
          />
          <select
            value={region}
            onChange={(e) =>
              onChangeRegion(e.target.value as ControlsProps['region'])
            }
            className="select"
            aria-label="Filter by region"
          >
            <option value="All">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="select"
            aria-label="Select year"
            name="year"
          >
            {Array.from({ length: 2023 - 1750 + 1 }, (_, i) => 2023 - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => onSort('name')} className="btn" type="button">
            Sort by Name
          </button>
          <button
            onClick={() => onSort('population')}
            className="btn"
            type="button"
          >
            Sort by Population
          </button>
          <button
            onClick={onOpenColumnSelector}
            className="btn-primary"
            type="button"
          >
            Select Columns
          </button>
        </div>
      </div>
    </div>
  );
});
