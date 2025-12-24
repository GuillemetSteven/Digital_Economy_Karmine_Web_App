import { BookText, X, ChevronRight } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { lexiqueData, LexiqueEntry } from '../data/lexiqueData';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { SearchInput } from '../components/SearchInput';

// Helper function to remove parentheses and their content
const removeParentheses = (text: string): string => {
  return text.replace(/\s*\([^)]*\)/g, '').trim();
};

export function LexiqueView() {
  const [filter, setFilter] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fuzzy search - search in term without parentheses and category (NOT definition)
  const searchResults = useMemo(() => {
    const results = fuzzySearch(lexiqueData, filter, (entry: LexiqueEntry) => [
      removeParentheses(entry.term), // Search in clean term without parentheses
      entry.category || ''
    ]);

    return results;
  }, [filter]);

  // Calculate autocomplete suggestion
  useEffect(() => {
    const filterNoLeading = filter.trimStart();

    // Don't suggest if filter is empty, only spaces, or has trailing spaces
    if (!filterNoLeading || filter.trimEnd() !== filter || searchResults.length === 0) {
      setSuggestion('');
      return;
    }

    const firstResult = searchResults[0];
    const cleanTerm = removeParentheses(firstResult.item.term);

    // Check if filter contains spaces (phrase search mode)
    const isPhraseSearch = filterNoLeading.includes(' ');

    if (isPhraseSearch) {
      // For phrase searches, only suggest if high-quality match
      if (
        (firstResult.matchType === 'exact' ||
         firstResult.matchType === 'contains' ||
         firstResult.matchType === 'starts-with') &&
        cleanTerm.toLowerCase().startsWith(filterNoLeading.toLowerCase())
      ) {
        setSuggestion(cleanTerm);
      } else {
        setSuggestion('');
      }
    } else {
      // Single word: match without leading spaces
      if (cleanTerm.toLowerCase().startsWith(filterNoLeading.toLowerCase())) {
        setSuggestion(cleanTerm);
      } else {
        setSuggestion('');
      }
    }
  }, [filter, searchResults]);

  // Auto-select term when exact match found (for inline display only)
  useEffect(() => {
    if (filter && searchResults.length > 0) {
      const exactMatch = searchResults.find(r => r.matchType === 'exact');
      if (exactMatch) {
        setSelectedTerm(exactMatch.item.term);
        setShowModal(false); // Don't show modal on auto-select
      }
    } else if (!filter) {
      setSelectedTerm(null);
      setShowModal(false);
    }
  }, [filter, searchResults]);

  // Close modal on Escape key and prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowModal(false);
        }
      };

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showModal]);

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
              {searchResults.length} / {lexiqueData.length} termes
            </p>
          </div>
        </div>
        <p className="text-gray-400">
          Glossaire des termes techniques et définitions utilisés dans ce rapport.
        </p>
      </div>

      {/* Fuzzy Search Input */}
      <div className="mb-6">
        <SearchInput
          value={filter}
          onChange={setFilter}
          onClear={() => {
            setFilter('');
            setSelectedTerm(null);
            setShowModal(false);
          }}
          placeholder="Rechercher un terme..."
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputRef={inputRef}
          resultCount={searchResults.length}
          totalCount={lexiqueData.length}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && suggestion && suggestion !== filter) {
              e.preventDefault();
              setFilter(suggestion);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              // Open modal if exact match is auto-selected
              if (selectedTerm && searchResults.some(r => r.matchType === 'exact')) {
                setShowModal(true);
              }
            } else if (e.key === 'Escape') {
              e.preventDefault();
              if (showModal) {
                // First ESC: Close modal only
                setShowModal(false);
              } else if (filter) {
                // Second ESC: Clear search and reset
                setFilter('');
                setSelectedTerm(null);
              }
            }
          }}
          autocompleteOverlay={
            suggestion && suggestion !== filter && filter ? (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none font-mono text-sm text-blue-200 z-20">
                <span className="invisible">{filter.trimStart()}</span>
                <span>{suggestion.slice(filter.trimStart().length)}</span>
              </div>
            ) : null
          }
        />
      </div>

      {/* Main Content: List Only */}
      <div className="space-y-4">
        {/* Terms List */}
        {searchResults.length > 0 ? (
          <div className="bg-karmine-surface rounded-xl border border-blue-900/30 overflow-hidden">
            <div className="divide-y divide-blue-900/20">
              {searchResults.map(({ item, matchIndices, matchType }) => {
                const cleanTerm = removeParentheses(item.term);
                const termIndices = matchIndices.get(cleanTerm) || [];
                const isSelected = selectedTerm === item.term;

                return (
                  <button
                    key={item.term}
                    onClick={() => {
                      setSelectedTerm(item.term);
                      setShowModal(true);
                    }}
                    className={`
                      w-full text-left px-5 py-4 transition-all duration-200
                      flex items-center justify-between gap-3 group
                      ${isSelected
                        ? 'bg-blue-500/20 border-l-4 border-blue-500'
                        : 'hover:bg-blue-900/10 border-l-4 border-transparent hover:border-blue-500/30'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Term with highlighting */}
                      <h4 className={`font-bold text-base leading-tight ${isSelected ? 'text-blue-300' : 'text-white group-hover:text-blue-200'}`}>
                        {filter && termIndices.length > 0 && matchType !== 'exact'
                          ? highlightMatches(cleanTerm, termIndices, matchType)
                          : cleanTerm}
                      </h4>

                      {/* Category badge (subtle) */}
                      {item.category && (
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Click indicator */}
                    <ChevronRight size={18} className="text-gray-500 group-hover:text-blue-200 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-karmine-surface rounded-xl border border-blue-900/30">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
              <BookText className="text-blue-500" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun résultat
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter
                ? `Aucun terme ne correspond à "${filter}"`
                : 'Aucun terme disponible'}
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
      </div>

      {/* Inline Definition Display - Shows when term is auto-selected (not clicked) */}
      {selectedTerm && !showModal && (() => {
        const entry = lexiqueData.find(e => e.term === selectedTerm);
        if (!entry) return null;

        return (
          <div className="mt-6 bg-karmine-surface rounded-xl border-2 border-blue-500/30 p-6 animate-fade-in">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{removeParentheses(entry.term)}</h3>
                {entry.category && (
                  <span className="inline-block text-xs text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-full">
                    {entry.category}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {entry.definition}
            </p>
          </div>
        );
      })()}

      {/* Modal - Shows when term is clicked */}
      {selectedTerm && showModal && (() => {
        const entry = lexiqueData.find(e => e.term === selectedTerm);
        if (!entry) return null;

        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-karmine-surface rounded-2xl border-2 border-blue-500/50 p-8 max-w-2xl w-full shadow-2xl shadow-blue-500/20 animate-scale-in pointer-events-auto max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{removeParentheses(entry.term)}</h3>
                    {entry.category && (
                      <span className="inline-block text-sm text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                        {entry.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
                    title="Fermer (Esc)"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Definition */}
                <p className="text-gray-300 leading-relaxed text-lg">
                  {entry.definition}
                </p>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
