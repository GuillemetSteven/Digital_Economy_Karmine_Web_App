import { BookOpen, ExternalLink } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { bibliographieData, BibliographySource, getSections } from '../data/bibliographieData';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { MatchType } from '../types/search';
import { MatchTypeBadge } from '../components/MatchTypeBadge';
import { SearchInput } from '../components/SearchInput';

export function BibliographyView() {
  const [filter, setFilter] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(getSections()));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fuzzy search with memoization + section filtering
  const searchResults = useMemo(() => {
    const results = fuzzySearch(bibliographieData, filter, (source: BibliographySource) => [
      source.title,
      source.author,
      source.section,
      source.subsection || ''
    ]);

    // Filter by selected sections
    return results.filter(result => selectedSections.has(result.item.section));
  }, [filter, selectedSections]);

  // Group results by section for display
  const groupedResults = useMemo(() => {
    const groups = new Map<string, Array<{ source: BibliographySource; matchIndices: Map<string, number[]>; matchType: MatchType }>>();

    for (const result of searchResults) {
      const section = result.item.section;
      if (!groups.has(section)) {
        groups.set(section, []);
      }
      groups.get(section)!.push({
        source: result.item,
        matchIndices: result.matchIndices,
        matchType: result.matchType
      });
    }

    return groups;
  }, [searchResults]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    const items: BibliographySource[] = [];
    for (const sectionItems of groupedResults.values()) {
      items.push(...sectionItems.map(item => item.source));
    }
    return items;
  }, [groupedResults]);

  // Calculate autocomplete suggestion
  useEffect(() => {
    const filterNoLeading = filter.trimStart();

    // Don't suggest if filter is empty, only spaces, or has trailing spaces
    if (!filterNoLeading || filter.trimEnd() !== filter || searchResults.length === 0) {
      setSuggestion('');
      return;
    }

    const firstResult = searchResults[0];
    const title = firstResult.item.title;

    // Check if filter contains spaces (phrase search mode)
    const isPhraseSearch = filterNoLeading.includes(' ');

    if (isPhraseSearch) {
      // For phrase searches, only suggest if high-quality match
      if (
        (firstResult.matchType === 'exact' ||
         firstResult.matchType === 'contains' ||
         firstResult.matchType === 'starts-with') &&
        title.toLowerCase().startsWith(filterNoLeading.toLowerCase())
      ) {
        setSuggestion(title);
      } else {
        setSuggestion('');
      }
    } else {
      // Single word: match without leading spaces
      if (title.toLowerCase().startsWith(filterNoLeading.toLowerCase())) {
        setSuggestion(title);
      } else {
        setSuggestion('');
      }
    }
  }, [filter, searchResults]);

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [filter, selectedSections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flatResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        openUrl(flatResults[selectedIndex].url);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatResults, selectedIndex]);

  // Auto-scroll to selected item
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  // Toggle section filter
  const toggleSectionFilter = (section: string) => {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Toggle all sections
  const toggleAllSections = () => {
    if (selectedSections.size === getSections().length) {
      setSelectedSections(new Set());
    } else {
      setSelectedSections(new Set(getSections()));
    }
  };

  // Count sources per section
  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const source of bibliographieData) {
      counts[source.section] = (counts[source.section] || 0) + 1;
    }
    return counts;
  }, []);

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="px-6 md:px-12 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <BookOpen className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Bibliographie</h2>
            <p className="text-gray-500 text-sm">
              {searchResults.length} / {bibliographieData.length} sources • {selectedSections.size} / {getSections().length} sections actives
            </p>
          </div>
        </div>
        <p className="text-gray-400">
          Sources et références utilisées pour l'analyse de Karmine Corp.
        </p>
      </div>

          {/* Fuzzy Search Input */}
          <div className="mb-6">
            <SearchInput
              value={filter}
              onChange={setFilter}
              onClear={() => {
                setFilter('');
                inputRef.current?.focus();
              }}
              placeholder="Rechercher une source, auteur, section..."
              isFocused={isFocused}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              inputRef={inputRef}
              resultCount={searchResults.length}
              totalCount={bibliographieData.length}
              showChevron={searchResults.length > 0}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && suggestion && suggestion !== filter) {
                  e.preventDefault();
                  setFilter(suggestion);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setFilter('');
                }
              }}
              autocompleteOverlay={
                suggestion && suggestion !== filter && filter ? (
                  <div className="absolute left-14 top-4 pointer-events-none font-mono text-sm text-gray-500 z-20">
                    <span className="invisible">{filter.trimStart()}</span>
                    <span>{suggestion.slice(filter.trimStart().length)}</span>
                  </div>
                ) : null
              }
            />
          </div>

          {/* Section Filters - Pills (same style as Gallery) */}
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto p-2 scrollbar-hide">
              {/* Bouton "Toutes" */}
              <button
                onClick={toggleAllSections}
                className={`
                  flex items-center gap-2.5 px-5 py-2.5 rounded-md whitespace-nowrap
                  transition-all duration-200 font-mono text-xs uppercase tracking-wider
                  outline-none
                  ${selectedSections.size === getSections().length
                    ? 'bg-blue-500/20 text-blue-200 border-2 border-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.08)]'
                    : 'bg-blue-900/20 border border-blue-800/40 text-gray-400 hover:bg-blue-800/30 hover:border-blue-700/60 hover:text-blue-200'
                  }
                `}
              >
                <span className="font-bold">Toutes</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-sm font-bold
                  ${selectedSections.size === getSections().length
                    ? 'bg-blue-300/30 text-blue-100'
                    : 'bg-blue-500/20 text-blue-400'
                  }
                `}>
                  {bibliographieData.length}
                </span>
              </button>

              {/* Badges individuels par section */}
              {getSections().map((section) => {
                const count = sectionCounts[section] || 0;
                const isActive = selectedSections.has(section);

                return (
                  <button
                    key={section}
                    onClick={() => toggleSectionFilter(section)}
                    className={`
                      flex items-center gap-2.5 px-5 py-2.5 rounded-md whitespace-nowrap
                      transition-all duration-200 font-mono text-xs uppercase tracking-wider
                      outline-none
                      ${isActive
                        ? 'bg-blue-500/20 text-blue-200 border-2 border-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.08)]'
                        : 'bg-blue-900/20 border border-blue-800/40 text-gray-400 hover:bg-blue-800/30 hover:border-blue-700/60 hover:text-blue-200'
                      }
                    `}
                  >
                    <span className="font-bold">{section}</span>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-sm font-bold
                      ${isActive
                        ? 'bg-blue-300/30 text-blue-100'
                        : 'bg-blue-500/20 text-blue-400'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results - Compact List with Sticky Section Headers */}
          {searchResults.length > 0 ? (
            <div className="bg-karmine-surface rounded-lg border border-gray-800 overflow-hidden">
              {(() => {
                let globalIndex = 0;
                return Array.from(groupedResults.entries()).map(([section, items]) => (
                  <div key={section}>
                    {/* Section Header - Sticky */}
                    <div className="sticky top-0 z-10 bg-karmine-surface px-4 py-2 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-blue-400 text-xs uppercase tracking-wide">
                          {section}
                        </h3>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          {items.length}
                        </span>
                      </div>
                    </div>

                    {/* Section Items - Compact List */}
                    <div>
                      {items.map(({ source, matchIndices, matchType }) => {
                        const titleIndices = matchIndices.get(source.title) || [];
                        const authorIndices = matchIndices.get(source.author) || [];
                        const currentIndex = globalIndex++;
                        const isSelected = currentIndex === selectedIndex;

                        return (
                          <div
                            key={source.id}
                            ref={(el) => (itemRefs.current[currentIndex] = el)}
                            className={`
                              group px-4 py-3 transition-colors border-l-2
                              ${isSelected
                                ? 'bg-blue-900/30 border-blue-400'
                                : 'border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                              }
                            `}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {/* Title */}
                                <div className="flex items-start gap-2 mb-1">
                                  <h4 className="text-white text-sm flex-1">
                                    {filter && titleIndices.length > 0
                                      ? highlightMatches(source.title, titleIndices, matchType)
                                      : source.title}
                                  </h4>
                                  {/* Match type badge */}
                                  {filter && <MatchTypeBadge type={matchType} compact />}
                                </div>
                                {/* Author, year, subsection */}
                                <div className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
                                  <span>
                                    {filter && authorIndices.length > 0
                                      ? highlightMatches(source.author, authorIndices, matchType)
                                      : source.author}
                                  </span>
                                  <span>•</span>
                                  <span>{source.year}</span>
                                  {source.subsection && (
                                    <>
                                      <span>•</span>
                                      <span className="text-blue-500/70">{source.subsection}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Open button */}
                              <button
                                onClick={() => openUrl(source.url)}
                                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors text-xs"
                              >
                                <span>Ouvrir</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-16 bg-karmine-surface rounded-lg border border-gray-800">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-500/10 mb-4">
                <BookOpen className="text-blue-500" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {selectedSections.size === 0 ? 'Aucune catégorie sélectionnée' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {selectedSections.size === 0
                  ? 'Sélectionnez au moins une catégorie ci-dessus'
                  : filter
                  ? `Aucune source ne correspond à "${filter}"`
                  : 'Aucune source dans les catégories sélectionnées'
                }
              </p>
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="mt-4 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}

      {/* Inline styles for scrollbar-hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
