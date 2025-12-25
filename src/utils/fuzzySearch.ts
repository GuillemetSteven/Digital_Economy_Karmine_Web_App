import React from 'react';
import { MatchType, FuzzyMatchResult } from '../types/search';

/**
 * Scoring constants - Arc/Spotlight style
 * Hierarchical scoring ensures better matches always appear first
 */
const SCORING = {
  EXACT_MATCH: 10000,        // "lol" matches "lol" exactly
  WORD_EXACT: 1000,          // "lol" matches word "lol" in "Team lol Gaming"
  STARTS_WITH: 500,          // "lea" matches "League of Legends"
  CONTAINS: 100,             // "leg" in "League of Legends"
  FUZZY_CHAR: 1,             // Each fuzzy character match
  CONSECUTIVE_BONUS: 5,      // Bonus for consecutive matches
  WORD_START_BONUS: 10,      // Bonus for matching at word start
} as const;

/**
 * Determines the type of match between text and pattern
 * Returns the highest-priority match type found
 */
function calculateMatchType(text: string, pattern: string): MatchType | null {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();

  // 1. Exact match - highest priority
  if (textLower === patternLower) {
    return 'exact';
  }

  // 2. Word exact - pattern matches a complete word
  // Split by spaces, hyphens, underscores
  const words = textLower.split(/[\s\-_]+/);
  if (words.includes(patternLower)) {
    return 'word-exact';
  }

  // 3. Starts with
  if (textLower.startsWith(patternLower)) {
    return 'starts-with';
  }

  // 4. Contains (substring)
  if (textLower.includes(patternLower)) {
    return 'contains';
  }

  // 5. Fuzzy match (characters in order, not necessarily consecutive)
  // Check if all pattern characters exist in text in order
  let patternIdx = 0;
  for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      patternIdx++;
    }
  }

  if (patternIdx === patternLower.length) {
    return 'fuzzy';
  }

  return null; // No match
}

/**
 * Calculate score based on match type and quality
 */
function calculateScore(text: string, pattern: string, matchType: MatchType, indices: number[]): number {
  let score = 0;

  // Base score from match type
  switch (matchType) {
    case 'exact':
      score = SCORING.EXACT_MATCH;
      break;
    case 'word-exact':
      score = SCORING.WORD_EXACT;
      break;
    case 'starts-with':
      score = SCORING.STARTS_WITH;
      break;
    case 'contains':
      score = SCORING.CONTAINS;
      break;
    case 'fuzzy':
      score = SCORING.FUZZY_CHAR * pattern.length;
      break;
  }

  // Additional scoring for fuzzy matches
  if (matchType === 'fuzzy') {
    let consecutiveBonus = 0;
    for (let i = 0; i < indices.length; i++) {
      // Consecutive character bonus
      if (i > 0 && indices[i] - indices[i - 1] === 1) {
        consecutiveBonus += SCORING.CONSECUTIVE_BONUS;
      } else {
        consecutiveBonus = 0;
      }

      // Word start bonus
      if (indices[i] === 0 || text[indices[i] - 1] === ' ' || text[indices[i] - 1] === '-') {
        score += SCORING.WORD_START_BONUS;
      }

      score += consecutiveBonus;
    }
  }

  // Penalty for longer texts (prefer shorter, more relevant matches)
  // But only for non-exact matches
  if (matchType !== 'exact') {
    score = score * (pattern.length / text.length);
  }

  return score;
}

/**
 * Find indices of matched characters in text
 */
function findMatchIndices(text: string, pattern: string, matchType: MatchType): number[] {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();
  const indices: number[] = [];

  if (matchType === 'exact' || matchType === 'starts-with') {
    // All characters from start
    for (let i = 0; i < pattern.length; i++) {
      indices.push(i);
    }
  } else if (matchType === 'word-exact') {
    // Find the word and highlight it
    const words = textLower.split(/[\s\-_]+/);
    let charCount = 0;
    for (const word of words) {
      if (word === patternLower) {
        for (let i = 0; i < word.length; i++) {
          indices.push(charCount + i);
        }
        break;
      }
      charCount += word.length + 1; // +1 for separator
    }
  } else if (matchType === 'contains') {
    // Find substring position
    const startIdx = textLower.indexOf(patternLower);
    for (let i = 0; i < pattern.length; i++) {
      indices.push(startIdx + i);
    }
  } else if (matchType === 'fuzzy') {
    // Find each character position
    let patternIdx = 0;
    for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
      if (textLower[i] === patternLower[patternIdx]) {
        indices.push(i);
        patternIdx++;
      }
    }
  }

  return indices;
}

/**
 * Enhanced fuzzy matching - Arc/Spotlight style
 * Prioritizes exact matches, then word matches, then fuzzy
 */
export function fuzzyMatch(text: string, pattern: string): FuzzyMatchResult {
  if (!pattern) {
    return { matches: true, score: 0, indices: [], matchType: 'fuzzy' };
  }

  const matchType = calculateMatchType(text, pattern);

  if (!matchType) {
    return { matches: false, score: 0, indices: [], matchType: 'fuzzy' };
  }

  const indices = findMatchIndices(text, pattern, matchType);
  const score = calculateScore(text, pattern, matchType, indices);

  return { matches: true, score, indices, matchType };
}

/**
 * Highlight matched characters with color based on match type
 * For exact matches, no highlighting - the badge indicates the match
 */
export function highlightMatches(
  text: string,
  indices: number[],
  matchType: MatchType = 'fuzzy'
): React.ReactNode {
  // For exact matches, don't highlight - the green badge is enough
  if (matchType === 'exact' || indices.length === 0) {
    return text;
  }

  // Uniform orange highlighting for all match types
  const highlightClasses = {
    'exact': '', // Never used since we return early
    'word-exact': 'bg-orange-500/40 text-orange-100 font-medium px-0.5',
    'starts-with': 'bg-orange-500/40 text-orange-100 font-medium px-0.5',
    'contains': 'bg-orange-500/40 text-orange-100 font-medium px-0.5',
    'fuzzy': 'bg-orange-500/40 text-orange-100 font-medium px-0.5',
  };

  const highlightClass = highlightClasses[matchType];

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  const indexSet = new Set(indices);

  // Group consecutive indices for better highlighting
  let i = 0;
  while (i < text.length) {
    if (indexSet.has(i)) {
      // Add text before the match
      if (i > lastIndex) {
        result.push(text.slice(lastIndex, i));
      }

      // Find the end of consecutive matches
      let end = i;
      while (indexSet.has(end + 1)) {
        end++;
      }

      // Add subtle highlighted match
      result.push(
        React.createElement(
          'mark',
          {
            key: `match-${i}`,
            className: highlightClass
          },
          text.slice(i, end + 1)
        )
      );

      lastIndex = end + 1;
      i = end + 1;
    } else {
      i++;
    }
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

/**
 * Search and sort items by fuzzy match score - Arc/Spotlight style
 * Supports phrase search (patterns with spaces treated as exact phrases)
 */
export function fuzzySearch<T>(
  items: T[],
  pattern: string,
  getSearchableText: (item: T) => string[]
): Array<{ item: T; score: number; matchIndices: Map<string, number[]>; matchType: MatchType }> {
  if (!pattern.trim()) {
    return items.map(item => ({
      item,
      score: 0,
      matchIndices: new Map(),
      matchType: 'fuzzy' as MatchType
    }));
  }

  const trimmedPattern = pattern.trim();

  // If pattern contains spaces, treat as exact phrase (not multi-token)
  if (trimmedPattern.includes(' ')) {
    // Phrase search: only exact or contains matches
    const results: Array<{ item: T; score: number; matchIndices: Map<string, number[]>; matchType: MatchType }> = [];

    for (const item of items) {
      const texts = getSearchableText(item);
      let totalScore = 0;
      const matchIndices = new Map<string, number[]>();
      let hasMatch = false;
      let bestMatchType: MatchType = 'contains';

      for (const text of texts) {
        const textLower = text.toLowerCase();
        const patternLower = trimmedPattern.toLowerCase();

        // Check for exact match
        if (textLower === patternLower) {
          hasMatch = true;
          bestMatchType = 'exact';
          totalScore += SCORING.EXACT_MATCH;
          const indices: number[] = [];
          for (let i = 0; i < trimmedPattern.length; i++) {
            indices.push(i);
          }
          matchIndices.set(text, indices);
        }
        // Check for contains match
        else if (textLower.includes(patternLower)) {
          hasMatch = true;
          if (bestMatchType !== 'exact') {
            bestMatchType = 'contains';
          }
          totalScore += SCORING.CONTAINS;
          const startIdx = textLower.indexOf(patternLower);
          const indices: number[] = [];
          for (let i = 0; i < trimmedPattern.length; i++) {
            indices.push(startIdx + i);
          }
          matchIndices.set(text, indices);
        }
      }

      if (hasMatch) {
        results.push({ item, score: totalScore, matchIndices, matchType: bestMatchType });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  // Single token search
  const results: Array<{ item: T; score: number; matchIndices: Map<string, number[]>; matchType: MatchType }> = [];

  for (const item of items) {
    const texts = getSearchableText(item);
    let totalScore = 0;
    const matchIndices = new Map<string, number[]>();
    let hasMatch = false;
    let bestMatchType: MatchType = 'fuzzy';

    for (const text of texts) {
      const result = fuzzyMatch(text, trimmedPattern);
      if (result.matches) {
        hasMatch = true;
        totalScore += result.score;
        matchIndices.set(text, result.indices);

        // Track best match type for this item
        const typeRank = { 'exact': 5, 'word-exact': 4, 'starts-with': 3, 'contains': 2, 'fuzzy': 1 };
        if (typeRank[result.matchType] > typeRank[bestMatchType]) {
          bestMatchType = result.matchType;
        }
      }
    }

    if (hasMatch) {
      results.push({ item, score: totalScore, matchIndices, matchType: bestMatchType });
    }
  }

  // Sort by score descending
  const sorted = results.sort((a, b) => b.score - a.score);

  // Smart filtering: if we have exact or word-exact matches, hide fuzzy/contains results
  const hasExactMatch = sorted.some(r => r.matchType === 'exact');
  const hasWordExactMatch = sorted.some(r => r.matchType === 'word-exact');
  const hasStartsWithMatch = sorted.some(r => r.matchType === 'starts-with');

  if (hasExactMatch) {
    // Only show exact matches
    return sorted.filter(r => r.matchType === 'exact');
  } else if (hasWordExactMatch) {
    // Only show word-exact and exact matches
    return sorted.filter(r => r.matchType === 'exact' || r.matchType === 'word-exact');
  } else if (hasStartsWithMatch) {
    // Show starts-with, word-exact, and exact
    return sorted.filter(r =>
      r.matchType === 'exact' ||
      r.matchType === 'word-exact' ||
      r.matchType === 'starts-with'
    );
  }

  // Otherwise, show all results
  return sorted;
}
