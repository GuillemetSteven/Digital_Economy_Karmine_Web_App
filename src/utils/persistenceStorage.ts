/**
 * Utilitaire de stockage persistant hybride
 * Gère les cookies avec détection HTTPS et fallback localStorage
 *
 * Sur HTTPS (GitHub Pages) : utilise cookies avec flag Secure
 * Sur HTTP (localhost) : utilise cookies sans flag Secure
 * Fallback : localStorage si les cookies échouent
 */

/**
 * Détecte si l'application tourne sur HTTPS
 */
const isHttps = (): boolean => {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
};

/**
 * Récupère un cookie par son nom
 */
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * Définit un cookie avec configuration adaptée au protocole
 * @returns true si le cookie a été défini avec succès, false sinon
 */
const setCookie = (name: string, value: string): boolean => {
  if (typeof document === 'undefined') return false;

  try {
    // Ajouter le flag Secure uniquement sur HTTPS
    const secure = isHttps() ? 'Secure;' : '';

    // 60 jours = 60 * 24 * 60 * 60 = 5184000 secondes
    const cookieString = `${name}=${encodeURIComponent(value)}; path=/; max-age=5184000; ${secure}SameSite=Lax`;
    document.cookie = cookieString;

    // Vérifier que le cookie a bien été défini
    return getCookie(name) === value;
  } catch (error) {
    // Échec silencieux (cookies peuvent être désactivés)
    return false;
  }
};

/**
 * Récupère une valeur depuis localStorage
 */
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    // localStorage peut être désactivé (navigation privée)
    return null;
  }
};

/**
 * Définit une valeur dans localStorage
 * @returns true si la valeur a été définie avec succès, false sinon
 */
const setLocalStorage = (key: string, value: string): boolean => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;

  try {
    localStorage.setItem(key, value);
    return localStorage.getItem(key) === value;
  } catch (error) {
    // localStorage peut être plein ou désactivé
    return false;
  }
};

/**
 * Récupère une valeur persistante
 * Essaie d'abord les cookies, puis localStorage en fallback
 *
 * @param key - Clé de la valeur à récupérer
 * @returns La valeur stockée ou null si non trouvée
 */
export const getPersistentValue = (key: string): string | null => {
  // Priorité 1 : cookies
  let value = getCookie(key);

  // Fallback : localStorage
  if (value === null) {
    value = getLocalStorage(key);
  }

  return value;
};

/**
 * Définit une valeur persistante
 * Essaie d'abord les cookies, puis localStorage en fallback
 *
 * @param key - Clé de la valeur à stocker
 * @param value - Valeur à stocker
 */
export const setPersistentValue = (key: string, value: string): void => {
  // Tentative 1 : cookies
  const cookieSet = setCookie(key, value);

  // Fallback : localStorage si le cookie a échoué
  if (!cookieSet) {
    setLocalStorage(key, value);
  }
};
