import { BookText, Check, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { lexiqueData, LexiqueEntry } from '../data/lexiqueData';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { MatchType } from '../types/search';
import { MatchTypeBadge } from '../components/MatchTypeBadge';

export function LexiqueView() {
  const [filter, setFilter] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique categories (filter out undefined/null)
  const categories = useMemo(() => {
    return [...new Set(lexiqueData.map(e => e.category).filter((c): c is string => Boolean(c)))];
  }, []);

  // Selected categories state (all selected by default)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(categories)
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fuzzy search with memoization + category filtering
  const searchResults = useMemo(() => {
    const results = fuzzySearch(lexiqueData, filter, (entry: LexiqueEntry) => [
      entry.term,
      entry.definition,
      entry.category || ''
    ]);

    // Filter by selected categories
    return results.filter(result =>
      !result.item.category || selectedCategories.has(result.item.category)
    );
  }, [filter, selectedCategories]);

  // Group results by category for display
  const groupedResults = useMemo(() => {
    const groups = new Map<string, Array<{ entry: LexiqueEntry; matchIndices: Map<string, number[]>; matchType: MatchType }>>();

    for (const result of searchResults) {
      const cat = result.item.category || 'Sans catégorie';
      if (!groups.has(cat)) {
        groups.set(cat, []);
      }
      groups.get(cat)!.push({
        entry: result.item,
        matchIndices: result.matchIndices,
        matchType: result.matchType
      });
    }

    return groups;
  }, [searchResults]);

  // Count terms per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of lexiqueData) {
      const cat = entry.category || 'Sans catégorie';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, []);

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Toggle all categories
  const toggleAllCategories = () => {
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(categories.filter((c): c is string => Boolean(c))));
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <BookText className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Lexique</h2>
            <p className="text-gray-500 text-sm">
              {searchResults.length} / {lexiqueData.length} termes • {selectedCategories.size} / {categories.length} catégories actives
            </p>
          </div>
        </div>
        <p className="text-gray-400">
          Glossaire des termes techniques et définitions utilisés dans ce rapport.
        </p>
      </div>

      {/* 2 Columns Layout: Sidebar + Main Content */}
      <div className="flex gap-8">
        {/* Sidebar - Categories */}
        <aside className="w-72 flex-shrink-0">
          <div className="sticky top-6 space-y-4">
            {/* Categories Header */}
            <div className="bg-karmine-surface rounded-xl p-4 border border-blue-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <span>Catégories</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                </h3>
                <button
                  onClick={toggleAllCategories}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  title={selectedCategories.size === categories.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                >
                  {selectedCategories.size === categories.length ? (
                    <><X size={14} /> Aucune</>
                  ) : (
                    <><Check size={14} /> Toutes</>
                  )}
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                {categories.map((category) => {
                  const isSelected = selectedCategories.has(category);
                  const count = categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategoryFilter(category)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between gap-3
                        ${isSelected
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-900/10 text-gray-400 hover:bg-blue-900/20 hover:text-gray-300'
                        }
                      `}
                    >
                      <span className="text-sm font-medium truncate">{category}</span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0
                        ${isSelected ? 'bg-white/20' : 'bg-blue-500/20 text-blue-400'}
                      `}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Fuzzy Search Input */}
          <div className="mb-6">
            <div
              className={`relative bg-karmine-surface rounded-xl border-2 transition-all duration-300 ${
                isFocused
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-blue-900/30 hover:border-blue-900/50'
              }`}
            >
              {/* Terminal-style prompt */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                <span className="text-blue-500 font-mono font-bold text-lg">&gt;</span>
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un terme... (ex: 'lol' pour League of Legends)"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && filter) {
                    e.preventDefault();
                    setFilter('');
                  }
                }}
                className="w-full pl-10 pr-28 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
              />

              {/* Right side controls */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Clear button (X) - integrated */}
                {filter && (
                  <button
                    onClick={() => {
                      setFilter('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
                    title="Effacer (Esc)"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Results counter */}
                <div className="px-2 py-0.5 bg-blue-900/20 rounded-full">
                  <span className="text-xs font-mono text-gray-400 font-medium">
                    {searchResults.length}/{lexiqueData.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="mt-2 text-xs text-gray-600">
              <span>🔍 Recherche intelligente • Esc effacer</span>
            </div>
          </div>

          {/* Results - Compact List with Sticky Category Headers */}
          {searchResults.length > 0 ? (
            <div className="bg-karmine-surface rounded-xl border border-blue-900/30 overflow-hidden">
              {Array.from(groupedResults.entries()).map(([category, items]) => (
                <div key={category}>
                  {/* Category Header - Sticky */}
                  <div className="sticky top-0 z-10 bg-karmine-surface/95 backdrop-blur-sm px-5 py-3 border-b border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-blue-400 text-sm uppercase tracking-wider">
                        {category}
                      </h3>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  {/* Terms in Category - Compact List */}
                  <div>
                    {items.map(({ entry, matchIndices, matchType }) => {
                      const termIndices = matchIndices.get(entry.term) || [];
                      const defIndices = matchIndices.get(entry.definition) || [];

                      return (
                        <div
                          key={entry.term}
                          className="px-5 py-4 hover:bg-blue-900/10 border-l-4 border-transparent hover:border-blue-500/50 transition-all duration-200"
                        >
                          <div className="flex flex-col gap-2">
                            {/* Term with Arc-style highlight and badge */}
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-base leading-tight flex-1">
                                {filter && termIndices.length > 0 && matchType !== 'exact'
                                  ? highlightMatches(entry.term, termIndices, matchType)
                                  : entry.term}
                              </h4>
                              {/* Match type badge */}
                              {filter && <MatchTypeBadge type={matchType} compact />}
                            </div>
                            {/* Definition with Arc-style highlight */}
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {filter && defIndices.length > 0 && matchType !== 'exact'
                                ? highlightMatches(entry.definition, defIndices, matchType)
                                : entry.definition}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-karmine-surface rounded-xl border border-blue-900/30">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
                <BookText className="text-blue-500" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedCategories.size === 0 ? 'Aucune catégorie sélectionnée' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {selectedCategories.size === 0
                  ? 'Sélectionnez au moins une catégorie dans la sidebar'
                  : filter
                  ? `Aucun terme ne correspond à "${filter}"`
                  : 'Aucun terme dans les catégories sélectionnées'
                }
              </p>
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
