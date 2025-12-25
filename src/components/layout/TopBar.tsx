import { ChevronRight } from 'lucide-react';
import { ViewType } from '../../types';

interface TopBarProps {
  currentView: ViewType;
}

const viewLabels: Record<ViewType, string> = {
  sections: 'Rapport',
  gallery: 'Galerie',
  biblio: 'Bibliographie',
  lexique: 'Lexique',
};

export function TopBar({ currentView }: TopBarProps) {
  return (
    <div className="hidden md:flex absolute top-0 left-0 right-0 h-16 items-center justify-end px-12 border-b border-blue-900/30 bg-karmine-bg/50 backdrop-blur z-30">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Karmine Corp</span>
        <ChevronRight size={14} />
        <span className="text-blue-400 font-medium">{viewLabels[currentView]}</span>
      </div>
    </div>
  );
}
