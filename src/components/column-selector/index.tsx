interface ColumnSelectorProps {
  allColumns: string[];
  selectedColumns: string[];
  onColumnChange: (column: string) => void;
}

export function ColumnSelector({
  allColumns,
  selectedColumns,
  onColumnChange,
}: ColumnSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {allColumns.map((column) => {
        const label = column.replace(/_/g, ' ');
        const checked = selectedColumns.includes(column);
        const id = `col-${column}`;
        return (
          <label
            key={column}
            htmlFor={id}
            className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={() => onColumnChange(column)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="capitalize">{label}</span>
          </label>
        );
      })}
    </div>
  );
}
