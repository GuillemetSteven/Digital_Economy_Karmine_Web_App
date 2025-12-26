import { Maximize2, Play } from 'lucide-react';
import { ReportImage } from '../types';
import { PlaceholderImage } from './PlaceholderImage';
import { Badge } from './Badge';

interface ImageCardProps {
  img: ReportImage;
  onClick: (img: ReportImage, imagesContext?: ReportImage[]) => void;
  showSectionTitle?: boolean;
  sectionTitle?: string;
  loading?: 'lazy' | 'eager';  // Performance optimization: control image loading strategy
}

export function ImageCard({ img, onClick, showSectionTitle, sectionTitle, loading = 'lazy' }: ImageCardProps) {
  return (
    <div
      onClick={() => onClick(img)}
      className="group cursor-pointer bg-karmine-surface rounded-xl overflow-hidden border border-blue-900/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col h-full"
    >
      <div className="aspect-[21/9] relative overflow-hidden bg-black/20">
        {img.src ? (
          <>
            <img
              src={img.mediaType === 'video' && img.videoThumbnail ? img.videoThumbnail : img.src}
              alt={img.title}
              loading={loading}
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {img.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <PlaceholderImage title={img.title} />
        )}

        {img.pageNumber && (
          <div className="absolute top-3 right-3 z-10">
            <Badge pageNumber={img.pageNumber} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Maximize2 size={16} />
            <span className="text-sm font-bold">Agrandir</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {showSectionTitle && sectionTitle && (
          <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">{sectionTitle}</p>
        )}
        <h3 className="text-gray-200 font-semibold leading-tight">{img.title}</h3>
      </div>
    </div>
  );
}
