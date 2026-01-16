import {JsonPropertyGrid} from "./JsonPropertyGrid"
import {JsonTable} from "./JsonTable"
import {JsonTree} from "./JsonTree"

interface JsonSmartViewProps {
  data: unknown;
}

export function JsonSmartView({ data }: JsonSmartViewProps) {
  // 1. Check for Array of Uniform Objects -> Smart Table
  if (Array.isArray(data)) {
    // Empty array or primtiive array -> standard handling (Chips or Tree in ExpandableValue)
    // But if passed here, it's "Complex".

    // Check if it's an array of objects
    const isArrayOfObjects =
      data.length > 0 &&
      data.every(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      );

    if (isArrayOfObjects) {
      return <JsonTable data={data as Record<string, any>[]} />;
    }

    // Fallback for mixed arrays or primitive arrays handled by generic Tree if ExpandableValue passes them here
    return <JsonTree data={data} />;
  }

  // 2. Check for "Flat" Object -> Property Grid
  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    const isFlatish = keys.every((k) => {
      const val = (data as any)[k];
      // Allow primitives or simple arrays of primitives
      return (
        typeof val !== "object" ||
        val === null ||
        (Array.isArray(val) && val.every((v) => typeof v !== "object"))
      );
    });

    if (isFlatish && keys.length > 0) {
      return <JsonPropertyGrid data={data as Record<string, any>} />;
    }

    // Deep nesting -> Tree View
    return <JsonTree data={data} />;
  }

  return <JsonTree data={data} />;
}
