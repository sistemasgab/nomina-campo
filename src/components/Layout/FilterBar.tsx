import './FilterBar.css';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFilterChange: (id: string, value: string) => void;
  filterDefs: FilterDef[];
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function FilterBar({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  filterDefs,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <span className="filter-bar__search-icon"><IconSearch /></span>
        <input
          className="filter-bar__search-input"
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {filterDefs.length > 0 && (
        <>
          <div className="filter-bar__divider" aria-hidden="true" />

          <div className="filter-bar__filters">
            <span className="filter-bar__filters-label">
              <IconFilter />
              Filtrar
            </span>

            {filterDefs.map((def) => (
              <div key={def.id} className="filter-bar__field">
                <label className="filter-bar__field-label" htmlFor={`filter-${def.id}`}>
                  {def.label}
                </label>
                <select
                  id={`filter-${def.id}`}
                  className="filter-bar__select"
                  value={filters[def.id] ?? ''}
                  onChange={(e) => onFilterChange(def.id, e.target.value)}
                >
                  {def.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
