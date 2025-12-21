import { useState, useMemo } from 'react';
import { fuzzySearch } from '../utils/fuzzySearch';

/**
 * Generic search hook with fuzzy matching
 *
 * @param data - Array of items to search through
 * @param searchKeys - Function that extracts searchable strings from each item
 * @returns Search filter state, setter, and filtered results
 *
 * @example
 * ```tsx
 * const { filter, setFilter, results } = useSearch(
 *   bibliographieData,
 *   (source) => [source.title, source.author, source.section]
 * );
 * ```
 */
export function useSearch<T>(
  data: T[],
  searchKeys: (item: T) => string[]
) {
  const [filter, setFilter] = useState('');

  const results = useMemo(() => {
    if (!filter.trim()) {
      // Return all items with empty indices when no filter
      return data.map(item => ({
        item,
        matchIndices: new Map<string, number[]>(),
        score: 0
      }));
    }

    return fuzzySearch(data, filter, searchKeys);
  }, [data, filter, searchKeys]);

  const clearFilter = () => setFilter('');

  return {
    filter,
    setFilter,
    clearFilter,
    results,
    hasFilter: filter.trim().length > 0,
    resultCount: results.length,
  };
}
