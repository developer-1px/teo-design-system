import { useState } from "react";
// Action removed
import { JsonSmartView } from "./JsonSmartView";
import * as styles from "./ExpandableValue.css";

interface ExpandableValueProps {
  value: string;
  rawValue?: unknown;
  primary?: boolean;
  empty?: boolean;
}

export function ExpandableValue({
  value,
  rawValue,
  empty,
}: ExpandableValueProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle null/undefined
  if (empty || rawValue === null || rawValue === undefined) {
    return (
      <span className={styles.emptyText}>—</span>
    );
  }

  // If it's an array
  if (Array.isArray(rawValue)) {
    // Check if it's a complex array (contains objects)
    const isComplex = rawValue.some(
      (item) => typeof item === "object" && item !== null,
    );

    if (isComplex) {
      return <JsonSmartView data={rawValue} />;
    }

    // Simple arrays: show tags
    const threshold = 10;
    const visibleItems = isExpanded ? rawValue : rawValue.slice(0, threshold);
    const hasMore = rawValue.length > threshold;

    return (
      <div className={styles.tagContainer}>
        {visibleItems.map((item, i) => (
          <div key={i} className={styles.tag}>
            <span className={styles.textValue} style={{ fontSize: "12px" }}>
              {String(item)}
            </span>
          </div>
        ))}
        {hasMore && (
          <button
            className={styles.showMoreButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded
              ? "Show Less"
              : `+${rawValue.length - threshold} more`}
          </button>
        )}
      </div>
    );
  }

  // Handle objects (Render as JsonSmartView)
  if (typeof rawValue === "object" && rawValue !== null) {
    return <JsonSmartView data={rawValue} />;
  }

  // Handle long strings (e.g. description)
  const isLong = value.length > 60;
  const displayValue =
    isExpanded || !isLong ? value : `${value.slice(0, 60)}...`;

  return (
    <div className={styles.container}>
      <span className={styles.textValue}>
        {displayValue}
      </span>
      {isLong && (
        <button
          className={styles.showMoreButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

export function parseValueIntoParts(value: string, _rawValue: unknown) {
  return [{ type: "text" as const, content: value }];
}
