export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: 'name' | 'population';
  direction: SortDirection;
}

export interface ControlsProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  selectedYear: number;
  setSelectedYear: (selectedYear: number) => void;
  sortConfig: SortConfig | null;
  setSortConfig: (sortConfig: SortConfig | null) => void;
  onOpenColumnSelector: () => void;
}

export function Controls({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  sortConfig,
  setSortConfig,
  onOpenColumnSelector,
}: ControlsProps) {
  const handleSort = (key: 'name' | 'population') => {
    let direction: SortDirection = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="card sticky top-5 z-10">
      <div className="card-section flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex w-full gap-3 sm:w-auto">
          <input
            type="search"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            aria-label="Search country"
            name="search"
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
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
          <button
            onClick={() => handleSort('name')}
            className="btn"
            type="button"
          >
            Sort by Name
          </button>
          <button
            onClick={() => handleSort('population')}
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
}
