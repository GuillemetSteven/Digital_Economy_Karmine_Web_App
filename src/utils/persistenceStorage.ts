/**
 * Utilitaire de stockage persistant via localStorage
 * Simple et fiable sur tous les navigateurs (Chrome, Safari, Firefox, Arc)
 *
 * Avantages par rapport aux cookies :
 * - Aucune restriction liée à HTTPS/HTTP
 * - Pas de problème avec les sous-chemins (GitHub Pages)
 * - Fonctionne identiquement sur Mac et Windows
 */

/**
 * Récupère une valeur depuis localStorage
 * @param key - Clé de la valeur à récupérer
 * @returns La valeur stockée ou null si non trouvée
 */
export const getPersistentValue = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(key);
  } catch {
    // localStorage peut être désactivé (navigation privée sur certains navigateurs)
    return null;
  }
};

/**
 * Stocke une valeur dans localStorage
 * @param key - Clé de la valeur à stocker
 * @param value - Valeur à stocker
 */
export const setPersistentValue = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage unavailable (private browsing)
  }
};
