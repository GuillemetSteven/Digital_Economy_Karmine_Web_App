import { MatchType } from '../types/search';

interface MatchTypeBadgeProps {
  type: MatchType;
  compact?: boolean;
}

/**
 * Badge showing match quality - Arc/Spotlight style
 * Visual indicator of how well the search matched
 */
export function MatchTypeBadge({ type, compact = false }: MatchTypeBadgeProps) {
  const configs = {
    'exact': {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'Exact',
      icon: '✓'
    },
    'word-exact': {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Mot',
      icon: '◆'
    },
    'starts-with': {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      label: 'Début',
      icon: '▶'
    },
    'contains': {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      label: 'Contient',
      icon: '●'
    },
    'fuzzy': {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: 'Approx',
      icon: '~'
    },
  };

  const config = configs[type];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${config.bg} ${config.text} ${config.border} border text-xs font-bold`}
        title={config.label}
      >
        {config.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-xs font-medium`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
