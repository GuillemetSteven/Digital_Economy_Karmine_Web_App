import { useState, useCallback, useEffect } from 'react';
import { getPersistentValue, setPersistentValue } from '../utils/persistenceStorage';

/**
 * Hook pour gérer l'animation "Last Update" avec stockage persistant
 * L'animation ne se joue qu'une seule fois par date de mise à jour
 * Utilise cookies avec fallback localStorage pour compatibilité Mac/HTTPS
 */

const COOKIE_NAME = 'karmine_last_update_seen';

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
    const seenDate = getPersistentValue(COOKIE_NAME);

    // L'animation doit être jouée si :
    // 1. Aucune valeur stockée n'existe (première visite)
    // 2. La date stockée est différente de la date actuelle
    if (seenDate !== updateDate) {
      setShouldAnimate(true);
    }
  }, [updateDate]);

  /**
   * Callback pour marquer l'animation comme vue
   * À appeler dans onAnimationEnd de l'animation spotlight
   */
  const markAnimationSeen = useCallback(() => {
    setPersistentValue(COOKIE_NAME, updateDate);
    setShouldAnimate(false);
  }, [updateDate]);

  return {
    shouldAnimate,
    markAnimationSeen,
  };
};
