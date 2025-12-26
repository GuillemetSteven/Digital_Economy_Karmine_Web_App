import { FileText, Image, BookA, Library } from 'lucide-react';
import { theme } from '../../config/theme';
import { ReportSection, ViewType } from '../../types';
import { LastUpdateBadge } from './LastUpdateBadge';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sections: ReportSection[];
  student: string;
  year: string;
  lastUpdate: string;
  isOpen: boolean;
  onClose: () => void;
}

// Style unifié pour les boutons de navigation
const navButtonBase = 'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300';
const navButtonActive = 'text-blue-400';
const navButtonInactive = 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10';

export function Sidebar({
  currentView,
  setCurrentView,
  sections,
  student,
  year,
  lastUpdate,
  isOpen,
  onClose,
}: SidebarProps) {
  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    onClose();
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-karmine-surfaceAlt border-r border-blue-900/30 z-40 transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Branding */}
        <div className="mb-10 mt-12 md:mt-0">
          <h1 className="text-2xl font-black italic tracking-tighter text-white leading-none mb-1">
            {theme.branding.title}
          </h1>
          <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">
            {theme.branding.subtitle}
          </p>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-1">
          <button
            onClick={() => handleNavClick('sections')}
            className={`${navButtonBase} ${
              currentView === 'sections' ? navButtonActive : navButtonInactive
            }`}
          >
            <FileText size={18} />
            <span className="font-medium">Rapport</span>
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`${navButtonBase} ${
              currentView === 'gallery' ? navButtonActive : navButtonInactive
            }`}
          >
            <Image size={18} />
            <span className="font-medium">Galerie</span>
          </button>

          <button
            onClick={() => handleNavClick('lexique')}
            className={`${navButtonBase} ${
              currentView === 'lexique' ? navButtonActive : navButtonInactive
            }`}
          >
            <BookA size={18} />
            <span className="font-medium">Lexique</span>
          </button>

          <button
            onClick={() => handleNavClick('biblio')}
            className={`${navButtonBase} ${
              currentView === 'biblio' ? navButtonActive : navButtonInactive
            }`}
          >
            <Library size={18} />
            <span className="font-medium">Bibliographie</span>
          </button>
        </nav>

        {/* Navigation sections (uniquement visible en vue Sections) */}
        {currentView === 'sections' && (
          <div className="mt-8 pt-8 border-t border-blue-900/20">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">
              Sections
            </h3>
            <div className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-4 py-2 text-sm text-gray-500 hover:text-blue-400 hover:bg-blue-900/10 rounded transition-colors truncate"
                  onClick={onClose}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* User info */}
        <div className="mt-auto pt-6 border-t border-blue-900/30">
          {/* Last Update Badge */}
          <LastUpdateBadge lastUpdate={lastUpdate} />

          <div className="flex items-center space-x-3 bg-karmine-surface p-3 rounded-lg border border-blue-900/20">
            <img
              src="imgs/kaiki_webp.webp"
              alt="Profile"
              className="w-8 h-8 rounded object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{student}</p>
              <p className="text-xs text-gray-500 truncate">{year}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
