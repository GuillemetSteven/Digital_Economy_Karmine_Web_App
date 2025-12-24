import React, { useState, useEffect } from 'react';
import { useLastUpdateAnimation } from '../../hooks/useLastUpdateAnimation';

interface LastUpdateBadgeProps {
  lastUpdate: string; // Format ISO: YYYY-MM-DD
}

/**
 * Formate une date ISO (YYYY-MM-DD) au format français (DD/MM/YYYY)
 */
const formatDate = (isoDate: string): string => {
  try {
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) {
      return 'N/A';
    }
    return `${day}/${month}/${year}`;
  } catch {
    return 'N/A';
  }
};

/**
 * Badge "Last Update" avec animation spotlight cinématographique
 * L'animation ne se joue qu'une fois par date de mise à jour grâce au système de cookie
 * L'animation est délayée de 4500ms pour attendre que le Loader soit complètement fini
 */
export const LastUpdateBadge: React.FC<LastUpdateBadgeProps> = ({ lastUpdate }) => {
  const { shouldAnimate, markAnimationSeen } = useLastUpdateAnimation(lastUpdate);
  const [showSpotlight, setShowSpotlight] = useState(false);

  // Délayer l'animation spotlight jusqu'à ce que le loader soit complètement fini
  useEffect(() => {
    if (shouldAnimate) {
      // Attendre 4500ms (loader 4000ms + fade 300ms + marge 200ms)
      const timer = setTimeout(() => {
        setShowSpotlight(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  return (
    <div className="relative mb-3 animate-badge-fade-in">
      {/* Badge principal - SANS blur ni shadow */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg px-3 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
            Last Update
          </span>
          <span className="text-xs text-gray-300 font-normal">
            {formatDate(lastUpdate)}
          </span>
        </div>
      </div>

      {/* Overlay spotlight - UNIQUEMENT si showSpotlight est true */}
      {showSpotlight && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div
            className="absolute inset-0 animate-spotlight-sweep"
            onAnimationEnd={markAnimationSeen}
            style={{
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, rgba(59,130,246,0.5) 30%, transparent 70%)',
              width: '150%',
              height: '200%',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
      )}
    </div>
  );
};
