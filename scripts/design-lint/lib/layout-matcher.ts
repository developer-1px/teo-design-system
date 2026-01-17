/**
 * Layout preset matcher
 * Finds matching Layout presets for given override properties
 */

import { Layout } from "../../../src/design-system/Frame/Layout/Layout";
import { isEqual } from "./utils";

/**
 * Flattened layout preset with path
 */
export interface LayoutPreset {
  path: string; // e.g., "Layout.Stack.Content.Default"
  preset: Record<string, any>;
}

/**
 * Flatten Layout object to list of presets with paths
 */
export function flattenLayoutPresets(): LayoutPreset[] {
  const presets: LayoutPreset[] = [];

  function traverse(obj: any, path: string[]) {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = [...path, key];

      // Check if this is a preset (has properties like gap, align, etc.)
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (value.gap !== undefined ||
          value.align !== undefined ||
          value.p !== undefined ||
          value.row !== undefined ||
          value.grid !== undefined)
      ) {
        // This is a preset
        presets.push({
          path: currentPath.join("."),
          preset: value,
        });
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        // Recurse into nested objects
        traverse(value, currentPath);
      }
    }
  }

  traverse(Layout, ["Layout"]);
  return presets;
}

/**
 * Match result with preset path and matched/unmatched keys
 */
export interface MatchResult {
  path: string;
  preset: Record<string, any>;
  matchedKeys: string[];
  unmatchedKeys: string[]; // Keys in override but not in preset
  extraKeys: string[]; // Keys in preset but not in override
  score: number; // Higher is better (percentage of matched keys)
}

/**
 * Find Layout presets that match the given override properties
 * Returns matches sorted by score (best match first)
 *
 * @param override - Override properties to match
 * @returns Array of match results, sorted by score
 */
export function findMatchingPresets(
  override: Record<string, any>,
): MatchResult[] {
  const allPresets = flattenLayoutPresets();
  const matches: MatchResult[] = [];

  for (const { path, preset } of allPresets) {
    const matchedKeys: string[] = [];
    const unmatchedKeys: string[] = [];
    const extraKeys: string[] = [];

    // Check each key in override
    for (const key in override) {
      if (key in preset && isEqual(override[key], preset[key])) {
        matchedKeys.push(key);
      } else {
        unmatchedKeys.push(key);
      }
    }

    // Check for extra keys in preset (not in override)
    for (const key in preset) {
      if (!(key in override)) {
        extraKeys.push(key);
      }
    }

    // Calculate score: matched / total override keys
    const score = override
      ? matchedKeys.length / Object.keys(override).length
      : 0;

    // Only include if there's at least one match
    if (matchedKeys.length > 0) {
      matches.push({
        path,
        preset,
        matchedKeys,
        unmatchedKeys,
        extraKeys,
        score,
      });
    }
  }

  // Sort by score (descending), then by fewer extra keys
  return matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.extraKeys.length - b.extraKeys.length;
  });
}

/**
 * Find perfect match: all override keys match preset exactly
 * Returns the best preset path or null
 */
export function findPerfectMatch(override: Record<string, any>): string | null {
  const matches = findMatchingPresets(override);

  // Perfect match: score = 1.0 (all keys matched)
  const perfectMatch = matches.find((m) => m.score === 1.0);

  return perfectMatch ? perfectMatch.path : null;
}
