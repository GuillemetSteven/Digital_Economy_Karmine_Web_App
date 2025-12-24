import { useState, useCallback, useEffect } from 'react';

/**
 * Hook pour gérer l'animation "Last Update" avec cookie
 * L'animation ne se joue qu'une seule fois par date de mise à jour
 */

const COOKIE_NAME = 'karmine_last_update_seen';

/**
 * Récupère un cookie par son nom
 */
const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * Définit un cookie persistant (expire après 60 jours)
 * 60 jours = 60 * 24 * 60 * 60 = 5184000 secondes
 */
const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=5184000; SameSite=Lax`;
};

interface UseLastUpdateAnimationReturn {
  shouldAnimate: boolean;
  markAnimationSeen: () => void;
}

/**
 * Hook personnalisé pour gérer l'animation de mise à jour
 * @param updateDate - Date de mise à jour au format ISO (YYYY-MM-DD)
 * @returns Un objet contenant shouldAnimate (boolean) et markAnimationSeen (fonction callback)
 */
export const useLastUpdateAnimation = (updateDate: string): UseLastUpdateAnimationReturn => {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si l'animation a déjà été vue pour cette date
    const seenDate = getCookie(COOKIE_NAME);

    // L'animation doit être jouée si :
    // 1. Aucun cookie n'existe (première visite)
    // 2. La date dans le cookie est différente de la date actuelle
    if (seenDate !== updateDate) {
      setShouldAnimate(true);
    }
  }, [updateDate]);

  /**
   * Callback pour marquer l'animation comme vue
   * À appeler dans onAnimationEnd de l'animation spotlight
   */
  const markAnimationSeen = useCallback(() => {
    setCookie(COOKIE_NAME, updateDate);
    setShouldAnimate(false);
  }, [updateDate]);

  return {
    shouldAnimate,
    markAnimationSeen,
  };
};
