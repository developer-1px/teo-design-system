import type {LucideIcon} from "lucide-react"
import {Layers} from "lucide-react"

/**
 * Type guard to check if value is a nested object (not null, not array, not primitive)
 */
export function isNestedObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}

/**
 * Property entry with metadata
 */
export interface PropertyEntry {
  key: string;
  value: unknown;
  isNested: boolean;
  isPrimary?: boolean;
}

/**
 * Grouped properties for rendering
 */
export interface PropertyGroupData {
  title: string;
  icon: LucideIcon;
  entries: PropertyEntry[];
  isNested: boolean;
  isPrimary: boolean; // Should be expanded by default
  level: number;
}

/**
 * Get icon for field key
 */
export function getFieldIcon(_key: string): LucideIcon {
  return Layers;
}

/**
 * Check if key represents a primary field (should be visible by default)
 */
function isPrimaryField(key: string): boolean {
  const primaryKeys = [
    "name",
    "title",
    "email",
    "company",
    "status",
    "value",
    "id",
  ];
  return primaryKeys.includes(key.toLowerCase());
}

/**
 * Group entries by category and nesting level
 * @param entries - Array of [key, value] tuples
 * @param level - Current nesting level (for recursion)
 * @returns Grouped property data
 */
export function groupEntries(
  entries: [string, unknown][],
  level = 0,
): PropertyGroupData[] {
  const groups: PropertyGroupData[] = [];
  const ungroupedEntries: PropertyEntry[] = [];

  // First pass: identify nested objects and categorize flat entries
  for (const [key, value] of entries) {
    const isNested = isNestedObject(value);

    if (isNested) {
      // Create a dedicated section for nested objects
      groups.push({
        title: formatGroupTitle(key),
        icon: Layers,
        entries: Object.entries(value).map(([nestedKey, nestedValue]) => ({
          key: nestedKey,
          value: nestedValue,
          isNested: isNestedObject(nestedValue),
          isPrimary: isPrimaryField(nestedKey),
        })),
        isNested: true,
        isPrimary: false,
        level,
      });
    } else {
      // Collect flat entries for potential grouping
      ungroupedEntries.push({
        key,
        value,
        isNested: false,
        isPrimary: isPrimaryField(key),
      });
    }
  }

  // Second pass: put all flat entries into "Properties" group
  if (ungroupedEntries.length > 0) {
    groups.push({
      title: "Properties",
      icon: Layers,
      entries: ungroupedEntries,
      isNested: false,
      isPrimary: true, // Flat properties are usually primary
      level,
    });
  }

  // Sort: primary groups first, then alphabetically
  return groups.sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) {
      return a.isPrimary ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });
}

/**
 * Format group title for display
 * @param key - Raw key (e.g., "contactInfo", "address")
 * @returns Formatted title (e.g., "Contact Info", "Address")
 */
function formatGroupTitle(key: string): string {
  return (
    key
      // Insert space before capital letters
      .replace(/([A-Z])/g, " $1")
      // Capitalize first letter
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}
