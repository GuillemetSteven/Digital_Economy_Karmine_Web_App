import { Menu, X } from 'lucide-react';
import { theme } from '../../config/theme';

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <div className="md:hidden fixed top-0 w-full bg-karmine-bg/90 backdrop-blur border-b border-blue-900/50 z-40 p-4 flex justify-between items-center">
      <div className="font-black text-xl italic text-white">{theme.branding.title}</div>
      <button onClick={onToggle} className="text-white p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}
