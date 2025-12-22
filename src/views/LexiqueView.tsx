import { BookText, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { lexiqueData, LexiqueEntry } from '../data/lexiqueData';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { MatchTypeBadge } from '../components/MatchTypeBadge';

export function LexiqueView() {
  const [filter, setFilter] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fuzzy search - search only in term and category (NOT definition)
  const searchResults = useMemo(() => {
    const results = fuzzySearch(lexiqueData, filter, (entry: LexiqueEntry) => [
      entry.term,
      entry.category || ''
    ]);

    return results;
  }, [filter]);

  // Auto-select term when exact match found
  useEffect(() => {
    if (filter && searchResults.length > 0) {
      const exactMatch = searchResults.find(r => r.matchType === 'exact');
      if (exactMatch) {
        setSelectedTerm(exactMatch.item.term);
      }
    } else if (!filter) {
      setSelectedTerm(null);
    }
  }, [filter, searchResults]);

  // Close modal on Escape key and prevent body scroll when modal is open
  useEffect(() => {
    if (selectedTerm) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedTerm(null);
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
  }, [selectedTerm]);

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
            placeholder="Rechercher un terme... (espaces = phrase exacte)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && filter) {
                e.preventDefault();
                setFilter('');
                setSelectedTerm(null);
              }
            }}
            className="w-full pl-10 pr-28 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
          />

          {/* Right side controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear button (X) */}
            {filter && (
              <button
                onClick={() => {
                  setFilter('');
                  setSelectedTerm(null);
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
          <span>🔍 Recherche • Espaces = phrase exacte • Esc effacer</span>
        </div>
      </div>

      {/* Main Content: List Only */}
      <div className="space-y-4">
        {/* Terms List */}
        {searchResults.length > 0 ? (
          <div className="bg-karmine-surface rounded-xl border border-blue-900/30 overflow-hidden">
            <div className="divide-y divide-blue-900/20">
              {searchResults.map(({ item, matchIndices, matchType }) => {
                const termIndices = matchIndices.get(item.term) || [];
                const isSelected = selectedTerm === item.term;

                return (
                  <button
                    key={item.term}
                    onClick={() => setSelectedTerm(item.term)}
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
                          ? highlightMatches(item.term, termIndices, matchType)
                          : item.term}
                      </h4>

                      {/* Category badge (subtle) */}
                      {item.category && (
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      )}

                      {/* Match type badge */}
                      {filter && <MatchTypeBadge type={matchType} compact />}
                    </div>

                    {/* Click indicator */}
                    <div className="text-gray-500">
                      ▶
                    </div>
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

      {/* Modal - Shows when term is selected */}
      {selectedTerm && (() => {
        const entry = lexiqueData.find(e => e.term === selectedTerm);
        if (!entry) return null;

        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
              onClick={() => setSelectedTerm(null)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-karmine-surface rounded-2xl border-2 border-blue-500/50 p-8 max-w-2xl w-full shadow-2xl shadow-blue-500/20 animate-scale-in pointer-events-auto max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{entry.term}</h3>
                    {entry.category && (
                      <span className="inline-block text-sm text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                        {entry.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedTerm(null)}
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
