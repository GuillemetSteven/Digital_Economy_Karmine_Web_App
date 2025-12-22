import { BookOpen, ExternalLink, Check, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { bibliographieData, BibliographySource, getSections } from '../data/bibliographieData';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { MatchType } from '../types/search';
import { MatchTypeBadge } from '../components/MatchTypeBadge';

export function BibliographyView() {
  const [filter, setFilter] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(getSections()));
  const [selectedIndex, setSelectedIndex] = useState(0);
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

          {/* Fuzzy Search Input - Arc/Spotlight style */}
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
                placeholder="Rechercher une source, auteur, section... (ex: 'lol' pour League of Legends)"
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
                    {searchResults.length}/{bibliographieData.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="mt-2 text-xs text-gray-600">
              <span>🔍 Recherche intelligente • ↑↓ naviguer • Enter ouvrir • Esc effacer</span>
            </div>
          </div>

          {/* Section Filters - Horizontal Pills */}
          <div className="mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Bouton "Toutes" */}
              <button
                onClick={toggleAllSections}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-karmine-dark
                  ${selectedSections.size === getSections().length
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 scale-105 font-semibold'
                    : 'bg-blue-900/30 border border-blue-800/40 text-gray-400 hover:bg-blue-800/40 hover:border-blue-700/60 hover:text-blue-200 hover:scale-102'
                  }
                `}
              >
                <span className="text-sm font-medium">Toutes</span>
                <span className={`
                  text-xs px-2.5 py-0.5 rounded-full font-bold
                  ${selectedSections.size === getSections().length
                    ? 'bg-white/30 text-white backdrop-blur-sm ring-1 ring-white/20'
                    : 'bg-blue-500/30 text-blue-300'
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
                      flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap
                      transition-all duration-300 ease-out
                      focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-karmine-dark
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 scale-105 font-semibold'
                        : 'bg-blue-900/30 border border-blue-800/40 text-gray-400 hover:bg-blue-800/40 hover:border-blue-700/60 hover:text-blue-200 hover:scale-102'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{section}</span>
                    <span className={`
                      text-xs px-2.5 py-0.5 rounded-full font-bold
                      ${isActive
                        ? 'bg-white/30 text-white backdrop-blur-sm ring-1 ring-white/20'
                        : 'bg-blue-500/30 text-blue-300'
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
            <div className="bg-karmine-surface rounded-xl border border-blue-900/30 overflow-hidden">
              {(() => {
                let globalIndex = 0;
                return Array.from(groupedResults.entries()).map(([section, items]) => (
                  <div key={section}>
                    {/* Section Header - Sticky */}
                    <div className="sticky top-0 z-10 bg-karmine-surface/95 backdrop-blur-sm px-5 py-3 border-b border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-blue-400 text-sm uppercase tracking-wider">
                          {section}
                        </h3>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold">
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
                              group px-5 py-4 transition-all duration-200 border-l-4
                              ${isSelected
                                ? 'bg-blue-900/40 border-blue-500'
                                : 'border-transparent hover:bg-blue-900/10 hover:border-blue-500/50'
                              }
                            `}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {/* Title with Arc-style highlight */}
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors text-sm leading-relaxed flex-1">
                                    {filter && titleIndices.length > 0
                                      ? highlightMatches(source.title, titleIndices, matchType)
                                      : source.title}
                                  </h4>
                                  {/* Match type badge */}
                                  {filter && <MatchTypeBadge type={matchType} compact />}
                                </div>
                                {/* Author, year, subsection */}
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="text-xs text-gray-400">
                                    {filter && authorIndices.length > 0
                                      ? highlightMatches(source.author, authorIndices, matchType)
                                      : source.author}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                  <span className="text-xs text-gray-500">{source.year}</span>
                                  {source.subsection && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                      <span className="text-xs text-blue-500/70">{source.subsection}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Open button */}
                              <button
                                onClick={() => openUrl(source.url)}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 text-xs font-medium group/btn"
                              >
                                <span>Ouvrir</span>
                                <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
            <div className="text-center py-20 bg-karmine-surface rounded-xl border border-blue-900/30">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
                <BookOpen className="text-blue-500" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedSections.size === 0 ? 'Aucune catégorie sélectionnée' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
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
                  className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
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
