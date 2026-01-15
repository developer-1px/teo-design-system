import type { DataRow, DatasetMeta } from "./types";

// Load all JSON files from data/crm directory using Vite's import.meta.glob
const dataFiles = import.meta.glob<{ default: DataRow[] }>(
  "/src/data/crm/*.json",
  {
    eager: false,
  }
);

// Icon mapping for different dataset types
const ICON_MAP: Record<string, string> = {
  deals: "LayoutGrid",
  companies: "Building2",
  people: "Users",
  projects: "FolderKanban",
  tasks: "CheckSquare",
  // Default fallback
  default: "Database",
};

/**
 * Get icon for dataset name
 */
function getDatasetIcon(name: string): string {
  return ICON_MAP[name] || ICON_MAP.default;
}

/**
 * Format dataset name to label
 * @param name - Dataset name (e.g., "deals", "서비스 관리")
 * @returns Formatted label (e.g., "Deals", "서비스 관리")
 */
function formatDatasetLabel(name: string): string {
  // If the name contains Korean characters or spaces, return as-is
  if (/[\u3131-\uD79D]/.test(name) || name.includes(" ")) {
    return name;
  }
  // Otherwise, capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Get available datasets metadata from import.meta.glob
 * @returns Array of dataset metadata
 */
export function getDatasetsMeta(): DatasetMeta[] {
  return Object.keys(dataFiles)
    .map((path) => {
      // Extract filename without path and extension
      // "/src/data/crm/deals.json" -> "deals"
      const match = path.match(/\/([^/]+)\.json$/);
      const name = match?.[1];

      if (!name) return null;

      return {
        name,
        label: formatDatasetLabel(name),
        icon: getDatasetIcon(name),
        path,
      };
    })
    .filter((meta): meta is DatasetMeta => meta !== null)
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
}

/**
 * Load dataset by name and auto-assign unique row IDs
 * @param datasetName - The name of the dataset (e.g., "deals", "companies")
 * @returns Promise resolving to the dataset array with __rowId added
 */
export async function loadDataset(datasetName: string): Promise<DataRow[]> {
  const path = `/src/data/crm/${datasetName}.json`;

  const loader = dataFiles[path];

  if (!loader) {
    console.error(`Dataset not found: ${datasetName}`);
    return [];
  }

  try {
    const module = await loader();
    const data = module.default;

    // Auto-assign unique row IDs to handle missing or duplicate IDs
    return data.map((row, index) => ({
      ...row,
      __rowId: `${datasetName}-${index}`,
    }));
  } catch (error) {
    console.error(`Error loading dataset ${datasetName}:`, error);
    return [];
  }
}

/**
 * Format column name for display
 * @param key - Column key (e.g., "closeDate")
 * @returns Formatted label (e.g., "Close Date")
 */
export function formatColumnLabel(key: string): string {
  return key
    // Insert space before capital letters
    .replace(/([A-Z])/g, " $1")
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
