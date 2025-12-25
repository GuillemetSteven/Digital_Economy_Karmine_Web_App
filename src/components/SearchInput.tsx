import { RefObject, useState, useEffect } from 'react';
import { X, CornerDownLeft, Terminal, ChevronRight } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  showCounter?: boolean;
  showPrompt?: boolean;
  showClearButton?: boolean;
  showChevron?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autocompleteOverlay?: React.ReactNode;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Rechercher...',
  resultCount,
  totalCount,
  isFocused = false,
  onFocus,
  onBlur,
  inputRef,
  showCounter = true,
  showPrompt = true,
  showClearButton = true,
  showChevron = false,
  onKeyDown,
  autocompleteOverlay,
}: SearchInputProps) {
  // Detect Mac vs Windows
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // État pour suivre quelles touches sont enfoncées
  const [activeKeys, setActiveKeys] = useState({
    Enter: false,
    Tab: false,
    Escape: false
  });

  // Event listeners globaux pour les animations de badges et raccourci Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setActiveKeys(prev => ({ ...prev, Enter: true }));
      if (e.key === 'Tab') setActiveKeys(prev => ({ ...prev, Tab: true }));
      if (e.key === 'Escape') setActiveKeys(prev => ({ ...prev, Escape: true }));

      // Ctrl+K / Cmd+K pour focus l'input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef?.current?.focus();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setActiveKeys(prev => ({ ...prev, Enter: false }));
      if (e.key === 'Tab') setActiveKeys(prev => ({ ...prev, Tab: false }));
      if (e.key === 'Escape') setActiveKeys(prev => ({ ...prev, Escape: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [inputRef]);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef?.current?.focus();
  };

  return (
    <div className="w-full">
      {/* Status bar - DÉTACHÉE avec mb-4 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-blue-200 font-bold uppercase tracking-widest font-mono flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse-dot"></div>
          {isFocused ? 'ACTIVE' : 'SYSTEM_READY'}
        </div>
      </div>

      {/* Input + Progress bar */}
      <div className="relative z-10 group">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`
            w-full px-5 py-4
            bg-karmine-surface/90 backdrop-blur-md
            border-t border-l border-r
            ${isFocused ? 'border-blue-200/70' : 'border-blue-200/30'}
            rounded-t-sm
            text-blue-200 placeholder:text-blue-200/40
            outline-none
            transition-colors duration-300
            font-mono text-sm
            ${showPrompt ? (showChevron ? 'pl-14' : 'pl-10') : ''}
            relative z-10
          `}
        />

        {/* Terminal-style prompt with optional chevron */}
        {showPrompt && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
            {showChevron && (
              <ChevronRight
                size={16}
                className="text-blue-200/70 transition-colors"
              />
            )}
            <span className="text-blue-200 font-mono font-bold text-lg">&gt;</span>
          </div>
        )}

        {/* Autocomplete overlay */}
        {autocompleteOverlay}

        {/* Clear button + Keyboard shortcut + Counter */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20">
          {/* Clear button */}
          {showClearButton && value && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
              title="Effacer (Esc)"
            >
              <X size={14} />
            </button>
          )}
          {/* Keyboard shortcut badge - dimensions fixes */}
          <kbd className={`px-2.5 py-1.5 rounded border border-blue-200/20 bg-[#080c16] font-mono text-blue-200/40 whitespace-nowrap h-7 flex items-center justify-center gap-1 ${isMac ? 'w-[75px]' : 'w-[70px]'}`}>
            <span className={isMac ? 'text-[13px] leading-none' : 'text-[10px]'}>
              {isMac ? '⌘' : 'Ctrl'}
            </span>
            <span className="text-[10px]">+ K</span>
          </kbd>
          {/* Counter - dimensions fixes */}
          {showCounter && resultCount !== undefined && totalCount !== undefined && (
            <span className="text-sm font-mono font-bold text-blue-300 w-[60px] h-7 flex items-center justify-end">
              {resultCount}/{totalCount}
            </span>
          )}
        </div>

        {/* Animated border bottom - progressive de gauche à droite */}
        <div
          className={`
            absolute bottom-0 left-0
            h-[2px]
            ${isFocused ? 'w-full' : 'w-0'}
            bg-blue-200
            transition-all duration-500
          `}
        />
      </div>

      {/* Barre de raccourcis - RATTACHÉE à l'input */}
      <div className="bg-[#050914] border border-blue-200/30 rounded-b-sm p-2.5 flex items-center justify-between text-xs select-none shadow-[0_10px_30px_rgba(0,0,0,0.7)] relative overflow-hidden">

        {/* Effet scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>

        <div className="flex items-center gap-6 relative z-10">

          {/* Badge Enter */}
          {resultCount !== undefined && resultCount > 0 && (
            <div
              className={`
                flex items-center gap-2
                transition-all duration-100
                cursor-pointer group/item
                ${activeKeys.Enter
                  ? 'text-blue-200 scale-105'
                  : 'text-blue-200/50 hover:text-blue-200'
                }
              `}
            >
              <CornerDownLeft
                size={14}
                className={activeKeys.Enter ? 'text-blue-200' : 'text-blue-200/50'}
              />
              <span className="font-mono font-bold text-[10px] tracking-wider">
                ENTER
              </span>
            </div>
          )}

          {/* Séparateur */}
          {resultCount !== undefined && resultCount > 0 && (
            <div className="w-[1px] h-3 bg-gray-700/50"></div>
          )}

          {/* Badge Tab */}
          <div
            className={`
              flex items-center gap-2
              transition-all duration-100
              cursor-pointer group/item
              ${activeKeys.Tab
                ? 'text-blue-200 scale-105'
                : 'text-blue-200/50 hover:text-blue-200'
              }
            `}
          >
            <span
              className={`
                font-mono text-[9px]
                border rounded-sm
                px-1.5 py-0.5
                transition-all
                ${activeKeys.Tab
                  ? 'border-blue-200 bg-blue-200/20 text-blue-100'
                  : 'border-blue-200/50 bg-[#080c16] text-blue-200/50 group-hover/item:border-blue-200/70'
                }
              `}
            >
              TAB
            </span>
            <span className={`font-mono font-bold text-[10px] tracking-wider ${activeKeys.Tab ? 'animate-text-pulse' : ''}`}>
              AUTOCOMPLETE
            </span>
          </div>

          {/* Séparateur */}
          {value && (
            <div className="w-[1px] h-3 bg-gray-700/50"></div>
          )}

          {/* Badge Escape */}
          {value && (
            <div
              className={`
                flex items-center gap-2
                transition-all duration-100
                cursor-pointer group/item
                ${activeKeys.Escape
                  ? 'text-blue-200 scale-105'
                  : 'text-blue-200/50 hover:text-blue-200'
                }
              `}
            >
              <span
                className={`
                  font-mono text-[9px]
                  border rounded-sm
                  px-1.5 py-0.5
                  transition-all
                  ${activeKeys.Escape
                    ? 'border-blue-200 bg-blue-200/20 text-blue-100'
                    : 'border-blue-200/50 bg-[#080c16] text-blue-200/50 group-hover/item:border-blue-200/70'
                  }
                `}
              >
                ESC
              </span>
              <span className={`font-mono font-bold text-[10px] tracking-wider ${activeKeys.Escape ? 'animate-text-pulse' : ''}`}>
                DELETE
              </span>
            </div>
          )}
        </div>

        {/* Décoration droite */}
        <div className="flex items-center gap-2 relative z-10 opacity-70">
          <Terminal size={12} className="text-blue-200" />
          <span className="text-blue-200 font-mono text-[9px]">CMD_LINE</span>
        </div>
      </div>
    </div>
  );
}
