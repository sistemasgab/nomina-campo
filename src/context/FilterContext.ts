import { useOutletContext } from 'react-router-dom';

export interface FilterContextValue {
  search: string;
  setSearch: (value: string) => void;
  filters: Record<string, string>;
  setFilter: (id: string, value: string) => void;
  clearFilters: () => void;
}

export function usePageFilters(): FilterContextValue {
  return useOutletContext<FilterContextValue>();
}
