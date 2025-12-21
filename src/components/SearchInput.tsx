import { RefObject } from 'react';
import { X } from 'lucide-react';

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
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef?.current?.focus();
  };

  const hasClearButton = showClearButton && value.length > 0;
  const hasCounter = showCounter && resultCount !== undefined && totalCount !== undefined;

  // Calculate padding based on what's shown on the right
  let rightPadding = 'pr-4';
  if (hasClearButton && hasCounter) {
    rightPadding = 'pr-24'; // Space for both X button and counter
  } else if (hasClearButton || hasCounter) {
    rightPadding = 'pr-12'; // Space for one element
  }

  return (
    <div
      className={`relative bg-karmine-surface rounded-xl border-2 transition-all duration-300 ${
        isFocused
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-blue-900/30 hover:border-blue-900/50'
      }`}
    >
      {/* Terminal-style prompt */}
      {showPrompt && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
          <span className="text-blue-500 font-mono font-bold text-lg">&gt;</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full ${showPrompt ? 'pl-10' : 'pl-4'} ${rightPadding} py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-sm`}
      />

      {/* Right side controls */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Clear button (X) - integrated inside input */}
        {hasClearButton && (
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
            title="Effacer (Esc)"
          >
            <X size={14} />
          </button>
        )}

        {/* Results counter */}
        {hasCounter && (
          <div className="px-2 py-0.5 bg-blue-900/20 rounded-full">
            <span className="text-xs font-mono text-gray-400 font-medium">
              {resultCount}/{totalCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
