import { useState } from 'react';
import { Search, Images, Expand } from 'lucide-react';
import { ReportSection, ReportImage } from '../types';
import { PlaceholderImage } from '../components/PlaceholderImage';

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

  // Get unique sections for filters
  const uniqueSections = ['all', ...sections.map(s => s.title)];

  // Flatten all images with section info
  const allImages = sections.flatMap((s) =>
    s.images.map((img) => ({ ...img, sectionTitle: s.title }))
  );

  // Filter images by search and section
  const filteredImages = allImages.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(filter.toLowerCase());
    const matchesSection = selectedSection === 'all' || img.sectionTitle === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Count images per section for badges
  const sectionCounts = sections.reduce((acc, section) => {
    acc[section.title] = section.images.length;
    return acc;
  }, {} as Record<string, number>);

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

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher une oeuvre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-karmine-surface border border-blue-900/30 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Section Filters - Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {uniqueSections.map((section) => {
            const count = section === 'all' ? allImages.length : sectionCounts[section] || 0;
            const isActive = selectedSection === section;

            return (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
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
                <span className="text-sm font-medium">
                  {section === 'all' ? 'Toutes' : section}
                </span>
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
                onClick={() => onImageClick(img, filteredImages)}
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
