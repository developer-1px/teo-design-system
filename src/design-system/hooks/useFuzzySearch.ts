import { useMemo } from "react";

/**
 * Fuzzy search match result
 */
export interface FuzzyMatch<T> {
  /** The matched item */
  item: T;
  /** Match score (0-1, higher is better) */
  score: number;
  /** Matched character indices */
  indices: number[];
}

/**
 * Options for fuzzy search
 */
export interface UseFuzzySearchOptions<T> {
  /** Items to search through */
  items: T[];
  /** Search query */
  query: string;
  /** Function to extract searchable string from item */
  getText: (item: T) => string;
  /** Minimum score threshold (0-1, default: 0.3) */
  threshold?: number;
  /** Maximum results to return (default: unlimited) */
  limit?: number;
  /** Case sensitive search (default: false) */
  caseSensitive?: boolean;
}

/**
 * Calculate fuzzy match score and indices
 *
 * Algorithm:
 * - Sequential character matching
 * - Bonus for consecutive matches
 * - Bonus for word boundary matches
 * - Penalty for gaps between matches
 *
 * @param text - Text to search in
 * @param query - Search query
 * @param caseSensitive - Whether to match case
 * @returns Match score and character indices
 */
function calculateFuzzyScore(
  text: string,
  query: string,
  caseSensitive: boolean = false
): { score: number; indices: number[] } {
  if (!query) {
    return { score: 1, indices: [] };
  }

  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchQuery = caseSensitive ? query : query.toLowerCase();

  const indices: number[] = [];
  let textIndex = 0;
  let queryIndex = 0;
  let consecutiveMatches = 0;
  let totalGap = 0;

  // Find all matching characters
  while (queryIndex < searchQuery.length && textIndex < searchText.length) {
    if (searchText[textIndex] === searchQuery[queryIndex]) {
      indices.push(textIndex);
      queryIndex++;
      consecutiveMatches++;
    } else {
      if (consecutiveMatches > 0) {
        totalGap += 1;
      }
      consecutiveMatches = 0;
    }
    textIndex++;
  }

  // Not all query characters found
  if (queryIndex < searchQuery.length) {
    return { score: 0, indices: [] };
  }

  // Calculate base score (matched chars / total chars)
  const baseScore = searchQuery.length / searchText.length;

  // Calculate bonus scores
  let bonusScore = 0;

  // Bonus for consecutive matches
  let currentConsecutive = 1;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      currentConsecutive++;
    } else {
      bonusScore += currentConsecutive * 0.05;
      currentConsecutive = 1;
    }
  }
  bonusScore += currentConsecutive * 0.05;

  // Bonus for word boundary matches
  for (const index of indices) {
    if (index === 0) {
      bonusScore += 0.1; // Start of string
    } else if (/\s/.test(searchText[index - 1])) {
      bonusScore += 0.08; // After space
    } else if (/[A-Z]/.test(text[index]) && /[a-z]/.test(text[index - 1])) {
      bonusScore += 0.06; // CamelCase boundary
    } else if (/[^a-zA-Z0-9]/.test(searchText[index - 1])) {
      bonusScore += 0.05; // After special char
    }
  }

  // Penalty for gaps
  const gapPenalty = totalGap * 0.03;

  // Final score (clamped to 0-1)
  const finalScore = Math.min(1, Math.max(0, baseScore + bonusScore - gapPenalty));

  return { score: finalScore, indices };
}

/**
 * Fuzzy search hook
 *
 * Performs intelligent fuzzy matching on a list of items.
 *
 * Features:
 * - Sequential character matching (order matters)
 * - Smart scoring with bonuses for:
 *   - Consecutive matches
 *   - Word boundary matches
 *   - CamelCase matches
 * - Configurable threshold and limit
 * - Memoized for performance
 *
 * @example
 * ```tsx
 * const commands = [
 *   { id: 1, label: "Go to File" },
 *   { id: 2, label: "Git Fetch" },
 *   { id: 3, label: "Save File" },
 * ];
 *
 * const results = useFuzzySearch({
 *   items: commands,
 *   query: "gf",
 *   getText: (item) => item.label,
 *   threshold: 0.3,
 * });
 *
 * // Results: [
 * //   { item: { id: 1, label: "Go to File" }, score: 0.85, indices: [0, 6] },
 * //   { item: { id: 2, label: "Git Fetch" }, score: 0.72, indices: [0, 4] }
 * // ]
 * ```
 */
export function useFuzzySearch<T>({
  items,
  query,
  getText,
  threshold = 0.3,
  limit,
  caseSensitive = false,
}: UseFuzzySearchOptions<T>): FuzzyMatch<T>[] {
  return useMemo(() => {
    // Empty query returns all items with score 1
    if (!query.trim()) {
      const allMatches = items.map((item) => ({
        item,
        score: 1,
        indices: [],
      }));
      return limit ? allMatches.slice(0, limit) : allMatches;
    }

    // Calculate scores for all items
    const matches: FuzzyMatch<T>[] = [];

    for (const item of items) {
      const text = getText(item);
      const { score, indices } = calculateFuzzyScore(text, query, caseSensitive);

      // Only include matches above threshold
      if (score >= threshold) {
        matches.push({ item, score, indices });
      }
    }

    // Sort by score (descending)
    matches.sort((a, b) => b.score - a.score);

    // Apply limit if specified
    return limit ? matches.slice(0, limit) : matches;
  }, [items, query, getText, threshold, limit, caseSensitive]);
}

/**
 * Simple fuzzy match utility (non-hook version)
 *
 * Useful for one-off fuzzy matching without React hooks.
 *
 * @param text - Text to search in
 * @param query - Search query
 * @param options - Match options
 * @returns Whether text matches query
 */
export function fuzzyMatch(
  text: string,
  query: string,
  options?: { caseSensitive?: boolean; threshold?: number }
): boolean {
  const { score } = calculateFuzzyScore(
    text,
    query,
    options?.caseSensitive ?? false
  );
  return score >= (options?.threshold ?? 0.3);
}

/**
 * Get highlighted parts of text for rendering
 *
 * Splits text into parts: matched (highlight) and unmatched (normal)
 *
 * @param text - Original text
 * @param indices - Matched character indices
 * @returns Array of text parts with highlight flag
 *
 * @example
 * ```tsx
 * const parts = getHighlightedParts("Go to File", [0, 6]);
 * // [
 * //   { text: "G", highlight: true },
 * //   { text: "o to ", highlight: false },
 * //   { text: "F", highlight: true },
 * //   { text: "ile", highlight: false }
 * // ]
 * ```
 */
export function getHighlightedParts(
  text: string,
  indices: number[]
): Array<{ text: string; highlight: boolean }> {
  if (indices.length === 0) {
    return [{ text, highlight: false }];
  }

  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;

  for (let i = 0; i < indices.length; i++) {
    const currentIndex = indices[i];

    // Add unmatched part before this match
    if (currentIndex > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, currentIndex),
        highlight: false,
      });
    }

    // Add matched character
    parts.push({
      text: text[currentIndex],
      highlight: true,
    });

    lastIndex = currentIndex + 1;
  }

  // Add remaining unmatched part
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return parts;
}
