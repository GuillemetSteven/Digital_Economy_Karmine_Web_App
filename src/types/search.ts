/**
 * Type de correspondance pour le fuzzy search
 * Hiérarchie (du meilleur au moins bon) :
 * exact > word-exact > starts-with > contains > fuzzy
 */
export type MatchType = 'exact' | 'word-exact' | 'starts-with' | 'contains' | 'fuzzy';

export interface FuzzyMatchResult {
  matches: boolean;
  score: number;
  indices: number[];
  matchType: MatchType;
}
