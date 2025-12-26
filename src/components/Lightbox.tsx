import { useEffect, useCallback } from 'react';
import { X, Maximize2, Minimize2, Download } from 'lucide-react';
import { ReportImage } from '../types';
import { PlaceholderImage } from './PlaceholderImage';
import { useLightboxState } from '../hooks/useLightboxState';
import { ZoomControls } from './ZoomControls';
import { NavigationButton } from './NavigationButton';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  content: ReportImage | null;
  // Navigation props (optional - enables navigation mode)
  images?: ReportImage[];
  currentIndex?: number;
  onNavigate?: (newIndex: number) => void;
}

export function Lightbox({
  isOpen,
  onClose,
  content,
  images = [],
  currentIndex = 0,
  onNavigate
}: LightboxProps) {
  // Use custom hook for all state management
  const {
    zoomLevel,
    isFullscreen,
    panPosition,
    isDragging,
    isVideo,
    isLightImage,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleFullscreen,
    setIsFullscreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDownload,
  } = useLightboxState({ isOpen, content });

  // Navigation enabled when images array provided
  const hasNavigation = images.length > 1 && onNavigate !== undefined;

  // Navigation handlers with circular logic
  const handlePrevious = useCallback(() => {
    if (!hasNavigation) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [hasNavigation, currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (!hasNavigation) return;
    const newIndex = (currentIndex + 1) % images.length;
    onNavigate(newIndex);
  }, [hasNavigation, currentIndex, images.length, onNavigate]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose, handlePrevious, handleNext, zoomIn, zoomOut, resetZoom, toggleFullscreen, setIsFullscreen]);

  if (!isOpen || !content) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
      onClick={isFullscreen ? undefined : onClose}
      style={{
        animation: 'lightboxFadeIn 0.3s ease-out'
      }}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className={`absolute top-6 right-6 p-3 ${
          isLightImage
            ? 'text-gray-800 bg-white/80 hover:bg-white border-gray-300'
            : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border-white/10'
        } backdrop-blur-md rounded-full transition-all duration-300 z-50 hover:scale-110 hover:shadow-lg border`}
        title="Fermer (Échap)"
      >
        <X size={24} />
      </button>

      {/* Conteneur principal */}
      <div
        className={`relative w-full shadow-2xl transition-all duration-300 overflow-hidden ${
          isFullscreen
            ? 'h-screen max-w-full rounded-none border-0 flex flex-col bg-karmine-surface'
            : 'max-w-[95vw] rounded-2xl border border-blue-900/30 flex flex-col md:flex-row bg-karmine-surface'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex-1 bg-black flex items-center justify-center relative group overflow-hidden ${
            isFullscreen ? 'p-0 h-screen' : 'p-4 min-h-[50vh] md:min-h-[85vh]'
          }`}
        >
          <button
            onClick={toggleFullscreen}
            className={`absolute top-6 left-6 p-3 ${
              isLightImage
                ? 'text-gray-800 bg-white/80 hover:bg-white border-gray-300'
                : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border-white/10'
            } backdrop-blur-md rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-lg border`}
            title={isFullscreen ? 'Quitter le plein écran (F)' : 'Plein écran (F)'}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>

          {/* Navigation */}
          {hasNavigation && (
            <>
              <NavigationButton
                direction="previous"
                onClick={handlePrevious}
                isLightImage={isLightImage}
                isFullscreen={isFullscreen}
              />
              <NavigationButton
                direction="next"
                onClick={handleNext}
                isLightImage={isLightImage}
                isFullscreen={isFullscreen}
              />
            </>
          )}

          {hasNavigation && (
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 ${
              isLightImage
                ? 'text-gray-800 bg-white/80 border-gray-300'
                : 'text-white bg-white/10 border-white/20'
            } backdrop-blur-md rounded-full text-sm font-bold border z-20 shadow-lg`}>
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {content.src ? (
            isVideo ? (
              <div className="w-full h-full flex items-center justify-center px-8">
                <video
                  src={content.src}
                  controls
                  className="max-w-[90vw] max-h-[82vh] w-auto h-auto object-contain shadow-2xl"
                  autoPlay
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            ) : (
              <div
                className="relative w-full h-full flex items-center justify-center px-8"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'zoom-in',
                }}
              >
                <img
                  src={content.src}
                  alt={content.title}
                  className={`${content.src?.includes('swot_consolide') ? 'max-w-[80vw]' : 'max-w-[90vw]'} max-h-[82vh] w-auto h-auto object-contain shadow-2xl select-none`}
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    pointerEvents: zoomLevel > 1 ? 'none' : 'auto',
                  }}
                  onClick={(e) => {
                    if (!isDragging && zoomLevel === 1) {
                      e.stopPropagation();
                      zoomIn();
                    }
                  }}
                  draggable={false}
                />
              </div>
            )
          ) : (
            <div className="w-full max-w-md">
              <PlaceholderImage title={content.title} />
            </div>
          )}

          {content.src && !isVideo && (
            <ZoomControls
              zoomLevel={zoomLevel}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetZoom={resetZoom}
              isLightImage={isLightImage}
            />
          )}
        </div>

        {/* Panneau lat\u00e9ral (cach\u00e9 en plein \u00e9cran) */}
        {!isFullscreen && (
          <div className="w-full md:w-80 bg-gradient-to-b from-karmine-surface to-karmine-darker p-8 border-l border-blue-900/30 flex flex-col transition-all duration-300">
            <div className="mb-auto">
              <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{content.title}</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-8"></div>

              <div className="space-y-6">
                {content.pageNumber && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">
                      Page
                    </h4>
                    <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-900/30 text-center">
                      <span className="text-5xl font-bold text-blue-400">
                        {content.pageNumber}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-blue-900/40 mt-6">
              <button
                onClick={handleDownload}
                disabled={!content.src}
                className="w-full py-3.5 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
              >
                <Download size={18} />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
