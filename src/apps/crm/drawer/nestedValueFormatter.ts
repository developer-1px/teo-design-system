/**
 * Comprehensive nested value formatter for CRM data display
 * Handles: primitives, objects, arrays, arrays of objects, deep nesting, mixed types
 */

export interface FormatOptions {
  maxDepth?: number; // Maximum nesting depth to display
  maxArrayItems?: number; // Maximum array items to show before truncating
  maxStringLength?: number; // Maximum string length before truncating
  arrayOfObjectsStrategy?: "count" | "first" | "summary"; // How to display array of objects
}

const DEFAULT_OPTIONS: Required<FormatOptions> = {
  maxDepth: 1,
  maxArrayItems: 3,
  maxStringLength: 50,
  arrayOfObjectsStrategy: "count",
};

/**
 * Type guards
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function isArrayOfObjects(
  value: unknown[],
): value is Record<string, unknown>[] {
  return value.length > 0 && value.every((item) => isObject(item));
}

function isArrayOfPrimitives(value: unknown[]): boolean {
  return (
    value.length > 0 &&
    value.every((item) => !isObject(item) && !Array.isArray(item))
  );
}

/**
 * Format value for table cell display (compact summary)
 */
export function formatForTable(
  value: unknown,
  options: FormatOptions = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options, maxDepth: 0 };
  return formatValueRecursive(value, opts, 0);
}

/**
 * Format value for drawer property display (more detail)
 */
export function formatForDrawer(
  value: unknown,
  options: FormatOptions = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options, maxDepth: 1 };
  return formatValueRecursive(value, opts, 0);
}

/**
 * Recursive formatter with depth tracking
 */
function formatValueRecursive(
  value: unknown,
  options: Required<FormatOptions>,
  currentDepth: number,
): string {
  // Null/undefined
  if (value === null || value === undefined) return "-";

  // Boolean
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // Number
  if (typeof value === "number") {
    // Currency formatting for large numbers
    if (value > 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  }

  // String
  if (typeof value === "string") {
    // Color hex codes - return as-is
    if (value.startsWith("#")) return value;

    // Truncate long strings
    if (value.length > options.maxStringLength) {
      return `${value.substring(0, options.maxStringLength)}...`;
    }
    return value;
  }

  // Date
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // Array
  if (Array.isArray(value)) {
    return formatArray(value, options, currentDepth);
  }

  // Object
  if (isObject(value)) {
    return formatObject(value, options, currentDepth);
  }

  // Fallback
  return String(value);
}

/**
 * Format array based on content type
 */
function formatArray(
  value: unknown[],
  options: Required<FormatOptions>,
  currentDepth: number,
): string {
  // Empty array
  if (value.length === 0) return "-";

  // Max depth reached - just show count
  if (currentDepth >= options.maxDepth) {
    return `${value.length} items`;
  }

  // Array of objects
  if (isArrayOfObjects(value)) {
    return formatArrayOfObjects(value, options, currentDepth);
  }

  // Array of primitives
  if (isArrayOfPrimitives(value)) {
    return formatArrayOfPrimitives(value, options);
  }

  // Mixed array - show count
  return `${value.length} items`;
}

/**
 * Format array of objects
 */
function formatArrayOfObjects(
  value: Record<string, unknown>[],
  options: Required<FormatOptions>,
  currentDepth: number,
): string {
  const count = value.length;

  switch (options.arrayOfObjectsStrategy) {
    case "count":
      return `${count} ${count === 1 ? "item" : "items"}`;

    case "first": {
      // Show first item's primary field
      const firstItem = value[0];
      const primaryField = findPrimaryField(firstItem);
      if (primaryField) {
        const formattedFirst = formatValueRecursive(
          primaryField,
          options,
          currentDepth + 1,
        );
        return count > 1
          ? `${formattedFirst}, +${count - 1} more`
          : formattedFirst;
      }
      return `${count} items`;
    }

    case "summary": {
      // Show summary of all items' primary fields
      const primaryValues = value
        .slice(0, options.maxArrayItems)
        .map((item) => findPrimaryField(item))
        .filter((v) => v !== null && v !== undefined)
        .map((v) => formatValueRecursive(v, options, currentDepth + 1));

      if (primaryValues.length === 0) return `${count} items`;

      const summary = primaryValues.join(", ");
      return count > options.maxArrayItems
        ? `${summary}, +${count - options.maxArrayItems} more`
        : summary;
    }

    default:
      return `${count} items`;
  }
}

/**
 * Format array of primitives
 */
function formatArrayOfPrimitives(
  value: unknown[],
  options: Required<FormatOptions>,
): string {
  const count = value.length;

  // Show first few items
  if (count <= options.maxArrayItems) {
    return value.map((v) => String(v)).join(", ");
  }

  // Truncate and show "X more"
  const shown = value
    .slice(0, options.maxArrayItems)
    .map((v) => String(v))
    .join(", ");
  return `${shown}, +${count - options.maxArrayItems} more`;
}

/**
 * Format object
 */
function formatObject(
  value: Record<string, unknown>,
  options: Required<FormatOptions>,
  currentDepth: number,
): string {
  const entries = Object.entries(value);

  // Empty object
  if (entries.length === 0) return "-";

  // Max depth reached - show field count
  if (currentDepth >= options.maxDepth) {
    if (entries.length === 0) return "Empty";
    // Simplified specific return for table tone matching
    return `${entries.length} Fields`;
  }

  // Find and show primary field
  const primaryField = findPrimaryField(value);
  if (primaryField !== null && primaryField !== undefined) {
    const formatted = formatValueRecursive(
      primaryField,
      options,
      currentDepth + 1,
    );
    return entries.length > 1 ? `${formatted}...` : formatted;
  }

  // Show all non-null values joined
  const nonNullEntries = entries.filter(
    ([_, v]) => v !== null && v !== undefined,
  );
  if (nonNullEntries.length === 0) return "-";

  const values = nonNullEntries
    .slice(0, options.maxArrayItems)
    .map(([_, v]) => formatValueRecursive(v, options, currentDepth + 1))
    .filter((s) => s !== "-");

  if (values.length === 0) return "-";

  const joined = values.join(", ");
  return nonNullEntries.length > options.maxArrayItems
    ? `${joined}...`
    : joined;
}

/**
 * Find primary field in object (name, title, email, id, etc.)
 */
function findPrimaryField(obj: Record<string, unknown>): unknown {
  const primaryKeys = [
    "name",
    "title",
    "label",
    "email",
    "value",
    "displayName",
    "id",
  ];

  for (const key of primaryKeys) {
    if (key in obj && obj[key] !== null && obj[key] !== undefined) {
      return obj[key];
    }
  }

  // Fallback: return first non-null value
  const firstEntry = Object.entries(obj).find(
    ([_, v]) => v !== null && v !== undefined,
  );
  return firstEntry ? firstEntry[1] : null;
}

/**
 * Get human-readable type description
 */
export function getValueTypeDescription(value: unknown): string {
  if (value === null || value === undefined) return "Empty";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number") return "Number";
  if (typeof value === "string") return "Text";
  if (value instanceof Date) return "Date";

  if (Array.isArray(value)) {
    if (value.length === 0) return "Empty Array";
    if (isArrayOfObjects(value)) return `${value.length} Objects`;
    if (isArrayOfPrimitives(value)) return `${value.length} Items`;
    return `${value.length} Mixed Items`;
  }

  if (isObject(value)) {
    const count = Object.keys(value).length;
    return count === 0 ? "Empty Object" : `${count} Fields`;
  }

  return "Unknown";
}
