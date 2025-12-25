/**
 * Normalize a string by removing accents and converting to lowercase
 * Used for accent-insensitive comparison in autocomplete
 *
 * @example
 * normalizeString("présentation") // "presentation"
 * normalizeString("économique") // "economique"
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
