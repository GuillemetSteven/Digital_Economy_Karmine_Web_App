import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ZOOM, LIGHTBOX } from '../constants/ui';

interface ZoomControlsProps {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  isLightImage: boolean;
}

export function ZoomControls({
  zoomLevel,
  zoomIn,
  zoomOut,
  resetZoom,
  isLightImage
}: ZoomControlsProps) {
  return (
    <div
      className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 ${
        isLightImage
          ? 'bg-white/80 border-gray-300 text-gray-800'
          : 'bg-white/10 border-white/20 text-white'
      } backdrop-blur-xl px-3 py-2 rounded-full border opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-xl shadow-black/50`}
    >
      {/* Zoom Out */}
      <button
        onClick={zoomOut}
        disabled={zoomLevel <= ZOOM.MIN}
        className={`p-1.5 ${
          isLightImage ? 'hover:text-blue-600' : 'hover:text-blue-400'
        } disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110`}
        title="Zoom arrière (-)"
      >
        <ZoomOut size={LIGHTBOX.ZOOM_ICON_SIZE} />
      </button>

      {/* Zoom Level Display */}
      <button
        onClick={resetZoom}
        className={`px-3 py-0.5 text-xs font-bold ${
          isLightImage ? 'hover:text-blue-600' : 'hover:text-blue-400'
        } transition-all hover:scale-105`}
        title="Réinitialiser (0)"
      >
        {Math.round(zoomLevel * 100)}%
      </button>

      {/* Zoom In */}
      <button
        onClick={zoomIn}
        disabled={zoomLevel >= ZOOM.MAX}
        className={`p-1.5 ${
          isLightImage ? 'hover:text-blue-600' : 'hover:text-blue-400'
        } disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110`}
        title="Zoom avant (+)"
      >
        <ZoomIn size={LIGHTBOX.ZOOM_ICON_SIZE} />
      </button>

      {/* Reset Button (shown when zoomed) */}
      {zoomLevel > ZOOM.MIN && (
        <>
          <div
            className={`w-px h-5 ${
              isLightImage ? 'bg-gray-400' : 'bg-white/30'
            } mx-0.5`}
          ></div>
          <button
            onClick={resetZoom}
            className={`p-1.5 ${
              isLightImage
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-blue-400 hover:text-blue-300'
            } transition-all hover:scale-110`}
            title="Réinitialiser le zoom"
          >
            <RotateCcw size={LIGHTBOX.ZOOM_ICON_SIZE} />
          </button>
        </>
      )}
    </div>
  );
}
