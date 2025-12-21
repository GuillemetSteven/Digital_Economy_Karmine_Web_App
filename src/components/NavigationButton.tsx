import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LIGHTBOX } from '../constants/ui';

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  onClick: () => void;
  isLightImage: boolean;
  isFullscreen: boolean;
}

export function NavigationButton({
  direction,
  onClick,
  isLightImage,
  isFullscreen
}: NavigationButtonProps) {
  const isPrevious = direction === 'previous';
  const Icon = isPrevious ? ChevronLeft : ChevronRight;
  const positionClass = isPrevious ? 'left-6' : 'right-6';
  const title = isPrevious ? 'Image précédente (←)' : 'Image suivante (→)';

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 p-4 ${
        isLightImage
          ? 'text-gray-800 bg-white/80 hover:bg-white border-gray-300'
          : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border-white/10'
      } backdrop-blur-md rounded-full transition-all duration-300 z-20 ${
        isFullscreen ? 'opacity-100' : 'md:opacity-0 md:group-hover:opacity-100 opacity-100'
      } hover:scale-110 hover:shadow-lg border`}
      title={title}
    >
      <Icon size={LIGHTBOX.NAV_BUTTON_SIZE} />
    </button>
  );
}
