import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Info,
  Layers,
  Mail,
  MapPin,
  Tag,
  User,
} from "lucide-react";

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
 * Category configuration for automatic grouping
 */
const CATEGORY_CONFIG: Record<
  string,
  { keywords: string[]; icon: LucideIcon; isPrimary: boolean }
> = {
  contact: {
    keywords: ["email", "phone", "mobile", "fax", "contact"],
    icon: Mail,
    isPrimary: true,
  },
  address: {
    keywords: [
      "address",
      "location",
      "street",
      "city",
      "country",
      "postal",
      "zip",
    ],
    icon: MapPin,
    isPrimary: false,
  },
  company: {
    keywords: ["company", "organization", "business"],
    icon: Building2,
    isPrimary: true,
  },
  financial: {
    keywords: ["revenue", "budget", "price", "cost", "salary", "payment"],
    icon: DollarSign,
    isPrimary: false,
  },
  metadata: {
    keywords: ["metadata", "meta", "data", "info", "details"],
    icon: Info,
    isPrimary: false,
  },
  profile: {
    keywords: ["profile", "bio", "about", "avatar"],
    icon: User,
    isPrimary: true,
  },
  dates: {
    keywords: [
      "date",
      "created",
      "updated",
      "modified",
      "founded",
      "start",
      "end",
    ],
    icon: Calendar,
    isPrimary: false,
  },
  tags: {
    keywords: ["tag", "label", "category", "type", "status"],
    icon: Tag,
    isPrimary: true,
  },
  description: {
    keywords: ["description", "note", "comment", "summary"],
    icon: FileText,
    isPrimary: false,
  },
};

/**
 * Detect category from key name
 */
function detectCategory(key: string): keyof typeof CATEGORY_CONFIG | null {
  const lowerKey = key.toLowerCase();

  for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
    if (config.keywords.some((keyword) => lowerKey.includes(keyword))) {
      return category as keyof typeof CATEGORY_CONFIG;
    }
  }

  return null;
}

/**
 * Get icon for field key
 */
export function getFieldIcon(key: string): LucideIcon {
  const category = detectCategory(key);
  return category ? CATEGORY_CONFIG[category].icon : Layers;
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
      const category = detectCategory(key);
      const config = category ? CATEGORY_CONFIG[category] : null;

      groups.push({
        title: formatGroupTitle(key),
        icon: config?.icon || Layers,
        entries: Object.entries(value).map(([nestedKey, nestedValue]) => ({
          key: nestedKey,
          value: nestedValue,
          isNested: isNestedObject(nestedValue),
          isPrimary: isPrimaryField(nestedKey),
        })),
        isNested: true,
        isPrimary: config?.isPrimary ?? false,
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

  // Second pass: group flat entries by category
  const categorizedGroups = new Map<string, PropertyEntry[]>();

  for (const entry of ungroupedEntries) {
    const category = detectCategory(entry.key);

    if (category) {
      if (!categorizedGroups.has(category)) {
        categorizedGroups.set(category, []);
      }
      categorizedGroups.get(category)!.push(entry);
    } else {
      // Uncategorized entries go to "General" group
      if (!categorizedGroups.has("general")) {
        categorizedGroups.set("general", []);
      }
      categorizedGroups.get("general")!.push(entry);
    }
  }

  // Convert categorized groups to PropertyGroupData
  for (const [category, entries] of categorizedGroups.entries()) {
    const config =
      category === "general"
        ? { icon: Layers, isPrimary: true }
        : CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];

    groups.push({
      title: category === "general" ? "Properties" : formatGroupTitle(category),
      icon: config.icon,
      entries,
      isNested: false,
      isPrimary: config.isPrimary,
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
