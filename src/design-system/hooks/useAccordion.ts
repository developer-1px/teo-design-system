import { useCallback, useMemo } from "react";
import { useControlledState } from "./utils/useControlledState";
import { useId } from "./utils/useId";

/**
 * Options for useAccordion hook
 */
export interface UseAccordionOptions {
  /** Array of item IDs */
  items: string[];
  /** Default expanded item IDs (uncontrolled mode) */
  defaultExpanded?: string[];
  /** Controlled expanded item IDs */
  expandedIds?: string[];
  /** Allow multiple items to be expanded simultaneously */
  allowMultiple?: boolean;
  /** Callback when expanded state changes */
  onChange?: (expandedIds: string[]) => void;
}

/**
 * Props for accordion item trigger element
 */
export interface AccordionItemProps {
  /** Whether the item is expanded */
  expanded: boolean;
  /** Toggle the expanded state */
  onToggle: () => void;
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** ARIA role */
  role: "button";
  /** ARIA expanded state */
  "aria-expanded": boolean;
  /** ARIA controls (panel ID) */
  "aria-controls": string;
  /** Tab index for keyboard navigation */
  tabIndex: number;
  /** Unique ID for the trigger */
  id: string;
}

/**
 * Props for accordion item panel element
 */
export interface AccordionPanelProps {
  /** Whether the panel is hidden */
  hidden: boolean;
  /** ARIA role */
  role: "region";
  /** ARIA labelledby (trigger ID) */
  "aria-labelledby": string;
  /** Unique ID for the panel */
  id: string;
}

/**
 * Return value from useAccordion hook
 */
export interface UseAccordionReturn {
  /** Set of currently expanded item IDs */
  expandedIds: Set<string>;
  /** Get props for accordion item trigger */
  getItemProps: (id: string) => AccordionItemProps;
  /** Get props for accordion item panel */
  getPanelProps: (id: string) => AccordionPanelProps;
  /** Toggle a specific item */
  toggle: (id: string) => void;
  /** Expand a specific item */
  expand: (id: string) => void;
  /** Collapse a specific item */
  collapse: (id: string) => void;
  /** Expand all items (only if allowMultiple is true) */
  expandAll: () => void;
  /** Collapse all items */
  collapseAll: () => void;
}

/**
 * Headless accordion hook with full ARIA support
 * Follows WAI-ARIA Accordion Pattern
 *
 * @param options - Configuration options
 * @returns Accordion state and prop getters
 *
 * @example
 * ```tsx
 * function MyAccordion() {
 *   const { expandedIds, getItemProps, getPanelProps } = useAccordion({
 *     items: ["item-1", "item-2", "item-3"],
 *     defaultExpanded: ["item-1"],
 *     allowMultiple: true,
 *   });
 *
 *   return (
 *     <div>
 *       {items.map((item) => (
 *         <div key={item.id}>
 *           <button {...getItemProps(item.id)}>
 *             {item.title}
 *           </button>
 *           <div {...getPanelProps(item.id)}>
 *             {item.content}
 *           </div>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccordion(options: UseAccordionOptions): UseAccordionReturn {
  const {
    items,
    defaultExpanded = [],
    expandedIds: controlledExpandedIds,
    allowMultiple = false,
    onChange,
  } = options;

  const baseId = useId("accordion");

  // Convert controlled array to Set for internal state
  const controlledSet = useMemo(
    () => (controlledExpandedIds ? new Set(controlledExpandedIds) : undefined),
    [controlledExpandedIds],
  );

  // Use controlled state pattern
  const [expandedSet, setExpandedSet] = useControlledState<Set<string>>(
    controlledSet,
    new Set(defaultExpanded),
    (newSet) => onChange?.(Array.from(newSet)),
  );

  /**
   * Toggle an item's expanded state
   */
  const toggle = useCallback(
    (id: string) => {
      setExpandedSet((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          // Collapse
          next.delete(id);
        } else {
          // Expand
          if (!allowMultiple) {
            // Single mode: close all others
            next.clear();
          }
          next.add(id);
        }

        return next;
      });
    },
    [allowMultiple, setExpandedSet],
  );

  /**
   * Expand a specific item
   */
  const expand = useCallback(
    (id: string) => {
      setExpandedSet((prev) => {
        if (prev.has(id)) return prev;

        const next = allowMultiple ? new Set(prev) : new Set<string>();
        next.add(id);
        return next;
      });
    },
    [allowMultiple, setExpandedSet],
  );

  /**
   * Collapse a specific item
   */
  const collapse = useCallback(
    (id: string) => {
      setExpandedSet((prev) => {
        if (!prev.has(id)) return prev;

        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [setExpandedSet],
  );

  /**
   * Expand all items (only if allowMultiple)
   */
  const expandAll = useCallback(() => {
    if (allowMultiple) {
      setExpandedSet(new Set(items));
    }
  }, [allowMultiple, items, setExpandedSet]);

  /**
   * Collapse all items
   */
  const collapseAll = useCallback(() => {
    setExpandedSet(new Set());
  }, [setExpandedSet]);

  /**
   * Get props for accordion item trigger
   */
  const getItemProps = useCallback(
    (id: string): AccordionItemProps => {
      const triggerId = `${baseId}-trigger-${id}`;
      const panelId = `${baseId}-panel-${id}`;
      const expanded = expandedSet.has(id);

      return {
        expanded,
        onToggle: () => toggle(id),
        onKeyDown: (e: React.KeyboardEvent) => {
          // Space and Enter keys toggle
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle(id);
          }
        },
        role: "button",
        "aria-expanded": expanded,
        "aria-controls": panelId,
        tabIndex: 0,
        id: triggerId,
      };
    },
    [baseId, expandedSet, toggle],
  );

  /**
   * Get props for accordion item panel
   */
  const getPanelProps = useCallback(
    (id: string): AccordionPanelProps => {
      const triggerId = `${baseId}-trigger-${id}`;
      const panelId = `${baseId}-panel-${id}`;
      const expanded = expandedSet.has(id);

      return {
        hidden: !expanded,
        role: "region",
        "aria-labelledby": triggerId,
        id: panelId,
      };
    },
    [baseId, expandedSet],
  );

  return {
    expandedIds: expandedSet,
    getItemProps,
    getPanelProps,
    toggle,
    expand,
    collapse,
    expandAll,
    collapseAll,
  };
}
