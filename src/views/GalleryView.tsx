import { useState, useRef, useEffect, useMemo } from 'react';
import { Images, Expand } from 'lucide-react';
import { ReportSection, ReportImage } from '../types';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { SearchInput } from '../components/SearchInput';
import { fuzzySearch } from '../utils/fuzzySearch';

interface GalleryViewProps {
  sections: ReportSection[];
  onImageClick: (img: ReportImage, imagesContext?: ReportImage[]) => void;
}

// Bento Grid size pattern (repeating every 8 items)
const getBentoSize = (index: number): string => {
  const pattern = ['large', 'medium', 'medium', 'medium', 'wide', 'medium', 'tall', 'medium'];
  return pattern[index % pattern.length];
};

export function GalleryView({ sections, onImageClick }: GalleryViewProps) {
  const [filter, setFilter] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique sections for filters
  const uniqueSections = ['all', ...sections.map(s => s.title)];

  // Flatten all images with section info
  const allImages = sections.flatMap((s) =>
    s.images.map((img) => ({ ...img, sectionTitle: s.title }))
  );

  // Fuzzy search on images - search in title, sectionTitle, and searchKeywords
  const searchResults = useMemo(() => {
    return fuzzySearch(allImages, filter, (img: ReportImage & { sectionTitle: string }) => [
      img.title,
      img.sectionTitle,
      ...(img.searchKeywords || [])
    ]);
  }, [allImages, filter]);

  // Apply section filter
  const filteredImages = useMemo(() => {
    return searchResults
      .map(result => result.item)
      .filter(img => selectedSection === 'all' || img.sectionTitle === selectedSection);
  }, [searchResults, selectedSection]);

  // Calculate autocomplete suggestion
  useEffect(() => {
    const filterNoLeading = filter.trimStart();

    if (!filterNoLeading || filter.trimEnd() !== filter || searchResults.length === 0) {
      setSuggestion('');
      return;
    }

    const firstResult = searchResults[0];
    const firstImageTitle = firstResult.item.title;
    const isPhraseSearch = filterNoLeading.includes(' ');

    if (isPhraseSearch) {
      // For phrase searches, only suggest if high-quality match
      if (
        (firstResult.matchType === 'exact' ||
         firstResult.matchType === 'contains' ||
         firstResult.matchType === 'starts-with') &&
        firstImageTitle.toLowerCase().startsWith(filterNoLeading.toLowerCase())
      ) {
        setSuggestion(firstImageTitle);
      } else {
        setSuggestion('');
      }
    } else {
      // Single word: suggest if title starts with the search
      if (firstImageTitle.toLowerCase().startsWith(filterNoLeading.toLowerCase())) {
        setSuggestion(firstImageTitle);
      } else {
        setSuggestion('');
      }
    }
  }, [filter, searchResults]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Count images per section for badges
  const sectionCounts = sections.reduce((acc, section) => {
    acc[section.title] = section.images.length;
    return acc;
  }, {} as Record<string, number>);

  // Keyboard event handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion && suggestion !== filter) {
      e.preventDefault();
      setFilter(suggestion);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredImages.length > 0) {
        onImageClick(filteredImages[0], allImages);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFilter('');
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Images className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Galerie</h2>
            <p className="text-gray-500 text-sm">{filteredImages.length} / {allImages.length} oeuvres</p>
          </div>
        </div>

        {/* Search Input with Fuzzy Search */}
        <div className="max-w-md mb-6">
          <SearchInput
            value={filter}
            onChange={setFilter}
            onClear={() => {
              setFilter('');
              inputRef.current?.focus();
            }}
            placeholder="Rechercher une oeuvre..."
            isFocused={isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            inputRef={inputRef}
            resultCount={filteredImages.length}
            totalCount={allImages.length}
            showCounter={true}
            showPrompt={true}
            showClearButton={true}
            showChevron={filteredImages.length > 0}
            onKeyDown={handleKeyDown}
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

        {/* Section Filters - Pills */}
        <div className="flex items-center gap-3 overflow-x-auto p-2 scrollbar-hide">
          {uniqueSections.map((section) => {
            const count = section === 'all' ? allImages.length : sectionCounts[section] || 0;
            const isActive = selectedSection === section;

            return (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
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
                <span className="font-bold">
                  {section === 'all' ? 'Toutes' : section}
                </span>
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

      {/* Bento Grid */}
      {filteredImages.length > 0 ? (
        <div className="bento-grid">
          {filteredImages.map((img, index) => {
            const bentoSize = getBentoSize(index);

            return (
              <div
                key={img.id}
                className={`
                  bento-item-${bentoSize}
                  group relative rounded-2xl overflow-hidden cursor-pointer
                  bg-karmine-surface border-2 border-blue-900/20
                  hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20
                  transition-all duration-500 hover:scale-[1.02]
                  animate-fade-in
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => onImageClick(img, allImages)}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  {img.src ? (
                    <img
                      src={img.mediaType === 'video' && img.videoThumbnail ? img.videoThumbnail : img.src}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full">
                      <PlaceholderImage title={img.title} />
                    </div>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Expand Icon - Top Right */}
                <div className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-white/20 hover:scale-110">
                  <Expand size={18} className="text-white" />
                </div>

                {/* Content Overlay - Bottom with Glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-md bg-white/5 border-t border-white/10">
                  <h4 className="text-white text-base font-bold line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {img.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
            <Images className="text-blue-500" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter ? 'Aucune oeuvre trouvée' : 'Galerie vide'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filter
              ? `Aucune oeuvre ne correspond à "${filter}"`
              : 'Les oeuvres seront ajoutées prochainement.'}
          </p>
        </div>
      )}

      {/* Inline styles for Bento Grid */}
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          grid-auto-rows: 280px;
          grid-auto-flow: dense;
        }

        .bento-item-large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .bento-item-wide {
          grid-column: span 2;
          grid-row: span 1;
        }

        .bento-item-tall {
          grid-column: span 1;
          grid-row: span 2;
        }

        .bento-item-medium {
          grid-column: span 1;
          grid-row: span 1;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            grid-auto-rows: 250px;
          }

          .bento-item-large,
          .bento-item-wide {
            grid-column: span 2;
          }
        }

        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 300px;
          }

          .bento-item-large,
          .bento-item-wide,
          .bento-item-tall,
          .bento-item-medium {
            grid-column: span 1;
            grid-row: span 1;
          }
        }

        /* Hide scrollbar for pills */
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
