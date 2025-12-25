import { useState, useRef, useMemo } from 'react';
import { Images, Expand } from 'lucide-react';
import { ReportSection, ReportImage } from '../types';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { SearchInput } from '../components/SearchInput';
import { normalizeString } from '../utils/normalizeString';

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique sections for filters
  const uniqueSections = ['all', ...sections.map(s => s.title)];

  // Flatten all images with section info
  const allImages = sections.flatMap((s) =>
    s.images.map((img) => ({ ...img, sectionTitle: s.title }))
  );

  // Autocomplétion à 2 niveaux : afficher le KEYWORD, Tab remplace par le TITRE
  const suggestionData = useMemo((): { matchedKeyword: string; imageTitle: string } | null => {
    const trimmed = filter.trimStart();
    // Minimum 2 caractères pour l'autocomplétion
    if (!trimmed || trimmed.length < 2 || filter.trimEnd() !== filter) return null;

    const normalizedQuery = normalizeString(trimmed);

    // Collecter les matchs avec keyword + titre + score
    const matches: { keyword: string; title: string; score: number }[] = [];

    for (const img of allImages) {
      const normalizedTitle = normalizeString(img.title);
      const keywords = img.searchKeywords || [];

      // Chercher le meilleur keyword qui commence par la query
      for (const kw of keywords) {
        const normalizedKw = normalizeString(kw);

        // Le keyword doit commencer par la query
        if (!normalizedKw.startsWith(normalizedQuery)) continue;

        // Ignorer les keywords trop longs (> 15 chars) sauf match exact
        if (kw.length > 15 && normalizedKw !== normalizedQuery) continue;

        // Calculer le score
        let score = 0;

        if (normalizedKw === normalizedQuery) {
          // Keyword exact : score max
          score = 200;
          // Bonus si le titre contient le mot
          if (normalizedTitle.includes(normalizedQuery)) score += 50;
        } else {
          // Keyword commence par query : score basé sur précision
          const precision = normalizedQuery.length / normalizedKw.length;
          score = 50 + Math.round(precision * 100); // Score entre 50 et 150

          // Bonus si le titre contient un mot qui commence par la query
          const titleWords = normalizedTitle.split(/\s+/);
          if (titleWords.some(w => w.startsWith(normalizedQuery))) {
            score += 30;
          }
        }

        matches.push({ keyword: kw, title: img.title, score });
      }

      // Aussi matcher sur le titre directement
      if (normalizedTitle.startsWith(normalizedQuery)) {
        const precision = normalizedQuery.length / normalizedTitle.length;
        const score = 100 + Math.round(precision * 50); // Score entre 100 et 150
        matches.push({ keyword: img.title, title: img.title, score });
      }
    }

    // Trier par score décroissant, puis par longueur de keyword (plus court = mieux)
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.keyword.length - b.keyword.length;
    });

    if (matches.length === 0) return null;

    return {
      matchedKeyword: matches[0].keyword,
      imageTitle: matches[0].title
    };
  }, [allImages, filter]);

  // Pour Tab : le TITRE de l'image
  const titleForTab = suggestionData?.imageTitle || '';

  // Pour l'affichage : calculer la partie restante du TITRE (pas du keyword)
  const displayRemainder = useMemo(() => {
    if (!suggestionData || !filter.trim()) return '';

    const normalizedFilter = normalizeString(filter.trimStart());
    const normalizedTitle = normalizeString(suggestionData.imageTitle);

    // Si le titre normalisé commence par le filtre normalisé
    if (normalizedTitle.startsWith(normalizedFilter)) {
      // Retourner la partie du titre après la longueur du filtre
      return suggestionData.imageTitle.slice(filter.trimStart().length);
    }

    // Sinon, le keyword matche mais pas le titre → afficher le titre complet
    return suggestionData.imageTitle;
  }, [suggestionData, filter]);

  // Filtrage: mot complet uniquement (keyword exact ou mot exact du titre)
  const filteredImages = useMemo(() => {
    const trimmed = filter.trim();

    // Si pas de filtre, afficher toutes les images (avec filtre section)
    if (!trimmed) {
      return allImages.filter(img => selectedSection === 'all' || img.sectionTitle === selectedSection);
    }

    const normalizedFilter = normalizeString(trimmed);

    const matched = allImages.filter(img => {
      // Match exact keyword
      const keywordMatch = img.searchKeywords?.some(kw =>
        normalizeString(kw) === normalizedFilter
      );
      // Match mot exact dans titre (chaque mot séparément)
      const titleWords = img.title.split(/\s+/);
      const titleWordMatch = titleWords.some(word =>
        normalizeString(word) === normalizedFilter
      );
      // Match titre complet
      const fullTitleMatch = normalizeString(img.title) === normalizedFilter;

      return keywordMatch || titleWordMatch || fullTitleMatch;
    });

    // Si aucun match mot complet → afficher toutes les images
    const baseImages = matched.length > 0 ? matched : allImages;

    // Appliquer le filtre de section
    return baseImages.filter(img => selectedSection === 'all' || img.sectionTitle === selectedSection);
  }, [allImages, filter, selectedSection]);


  // Count images per section for badges
  const sectionCounts = sections.reduce((acc, section) => {
    acc[section.title] = section.images.length;
    return acc;
  }, {} as Record<string, number>);

  // Keyboard event handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && titleForTab && titleForTab !== filter) {
      e.preventDefault();
      setFilter(titleForTab);
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
        <div className="max-w-lg mb-6">
          <SearchInput
            value={filter}
            onChange={setFilter}
            onClear={() => {
              setFilter('');
              inputRef.current?.focus();
            }}
            placeholder="Rechercher un graphique..."
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
              displayRemainder ? (
                <div className="absolute left-14 top-4 pointer-events-none font-mono text-sm text-gray-500 z-20">
                  <span className="invisible">{filter.trimStart()}</span>
                  <span>{displayRemainder}</span>
                </div>
              ) : null
            }
          />
        </div>

        {/* Section Filters - Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {uniqueSections.map((section) => {
            const count = section === 'all' ? allImages.length : sectionCounts[section] || 0;
            const isActive = selectedSection === section;

            return (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap
                  transition-all duration-200 font-mono text-xs uppercase tracking-wider
                  outline-none
                  ${isActive
                    ? 'bg-blue-500/15 text-blue-200 border border-blue-400/40'
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
