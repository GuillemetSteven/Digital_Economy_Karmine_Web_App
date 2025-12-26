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
 * L'animation ne se joue qu'une fois par date de mise à jour grâce au localStorage
 * L'animation est délayée de 3500ms pour attendre que le Loader soit complètement fini
 * (3000ms loader + 500ms buffer)
 *
 * Gestion de prefers-reduced-motion:
 * - Si activé → simple flash bleu (600ms) au lieu du spotlight
 * - Si désactivé → animation spotlight complète (2.5s)
 */
export const LastUpdateBadge: React.FC<LastUpdateBadgeProps> = ({ lastUpdate }) => {
  const { shouldAnimate, markAnimationSeen } = useLastUpdateAnimation(lastUpdate);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Détecter prefers-reduced-motion au montage
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // Délayer l'animation jusqu'à ce que le loader soit complètement fini
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        if (prefersReducedMotion) {
          // Animation réduite : simple flash
          setShowFlash(true);
          setTimeout(() => {
            setShowFlash(false);
            markAnimationSeen();
          }, 600);
        } else {
          // Animation complète : spotlight
          setShowSpotlight(true);
        }
      }, 3500);  // Synchronized with loader: 3000ms + 500ms buffer
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, prefersReducedMotion, markAnimationSeen]);

  // Handler pour la fin de l'animation spotlight
  const handleAnimationEnd = () => {
    markAnimationSeen();
    setShowSpotlight(false);
  };

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

      {/* Flash simple pour prefers-reduced-motion */}
      {showFlash && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none bg-blue-400/40 animate-pulse"
        />
      )}

      {/* Overlay spotlight - animation complète */}
      {showSpotlight && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div
            className="absolute inset-0 animate-spotlight-sweep"
            onAnimationEnd={handleAnimationEnd}
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
