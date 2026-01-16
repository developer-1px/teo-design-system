import {useCallback, useRef} from "react"
import {useControlledState} from "./utils/useControlledState"
import {useId} from "./utils/useId"

/**
 * Options for useDropdown hook
 */
export interface UseDropdownOptions<T> {
  /** Array of items */
  items: T[];
  /** Function to convert item to string (for display) */
  itemToString?: (item: T | null) => string;
  /** Controlled selected item */
  selectedItem?: T | null;
  /** Default selected item (uncontrolled mode) */
  defaultSelectedItem?: T | null;
  /** Callback when selected item changes */
  onSelectedItemChange?: (item: T | null) => void;
  /** Controlled open state */
  isOpen?: boolean;
  /** Default open state (uncontrolled mode) */
  defaultIsOpen?: boolean;
  /** Callback when open state changes */
  onIsOpenChange?: (isOpen: boolean) => void;
  /** Callback when highlighted index changes */
  onHighlightedIndexChange?: (index: number) => void;
}

/**
 * Props for dropdown toggle button
 */
export interface ToggleButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** ARIA expanded state */
  "aria-expanded": boolean;
  /** ARIA haspopup */
  "aria-haspopup": "listbox";
  /** ARIA labelledby */
  "aria-labelledby"?: string;
  /** ARIA role */
  role: "combobox";
  /** ARIA controls (menu ID) */
  "aria-controls": string;
  /** Unique ID */
  id: string;
}

/**
 * Props for dropdown label
 */
export interface LabelProps {
  /** Unique ID */
  id: string;
}

/**
 * Props for dropdown menu
 */
export interface MenuProps {
  /** ARIA role */
  role: "listbox";
  /** ARIA labelledby */
  "aria-labelledby": string;
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Blur event handler */
  onBlur: () => void;
  /** Unique ID */
  id: string;
}

/**
 * Props for dropdown menu item
 */
export interface ItemProps {
  /** ARIA role */
  role: "option";
  /** ARIA selected state */
  "aria-selected": boolean;
  /** Whether the item is highlighted */
  highlighted: boolean;
  /** Click handler */
  onClick: () => void;
  /** Mouse move handler */
  onMouseMove: () => void;
  /** Unique ID */
  id: string;
}

/**
 * Return value from useDropdown hook
 */
export interface UseDropdownReturn<T> {
  // State
  /** Whether the menu is open */
  isOpen: boolean;
  /** Currently selected item */
  selectedItem: T | null;
  /** Currently highlighted item index */
  highlightedIndex: number;

  // Prop Getters
  /** Get props for toggle button */
  getToggleButtonProps: (options?: { disabled?: boolean }) => ToggleButtonProps;
  /** Get props for label */
  getLabelProps: () => LabelProps;
  /** Get props for menu */
  getMenuProps: () => MenuProps;
  /** Get props for menu item */
  getItemProps: (options: {
    item: T;
    index: number;
    disabled?: boolean;
  }) => ItemProps;

  // Actions
  /** Toggle menu open/close */
  toggleMenu: () => void;
  /** Open menu */
  openMenu: () => void;
  /** Close menu */
  closeMenu: () => void;
  /** Select an item */
  selectItem: (item: T | null) => void;
  /** Set highlighted index */
  setHighlightedIndex: (index: number) => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Headless dropdown hook following Downshift API patterns
 * Provides complete keyboard navigation and ARIA support
 *
 * Features:
 * - Arrow key navigation (↑↓)
 * - Enter to select
 * - Escape to close
 * - Home/End navigation
 * - Full ARIA attributes
 * - Controlled/Uncontrolled modes
 *
 * @param options - Configuration options
 * @returns Dropdown state and prop getters
 *
 * @example
 * ```tsx
 * function MyDropdown() {
 *   const items = ["Apple", "Banana", "Cherry"];
 *   const {
 *     isOpen,
 *     selectedItem,
 *     getToggleButtonProps,
 *     getMenuProps,
 *     getItemProps,
 *   } = useDropdown({ items });
 *
 *   return (
 *     <div>
 *       <button {...getToggleButtonProps()}>
 *         {selectedItem ?? "Select item"}
 *       </button>
 *       {isOpen && (
 *         <ul {...getMenuProps()}>
 *           {items.map((item, index) => (
 *             <li key={index} {...getItemProps({ item, index })}>
 *               {item}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDropdown<T>(
  options: UseDropdownOptions<T>,
): UseDropdownReturn<T> {
  const {
    items,
    itemToString: _itemToString = (item) => (item == null ? "" : String(item)),
    selectedItem: controlledSelectedItem,
    defaultSelectedItem = null,
    onSelectedItemChange,
    isOpen: controlledIsOpen,
    defaultIsOpen = false,
    onIsOpenChange,
    onHighlightedIndexChange,
  } = options;

  const baseId = useId("dropdown");
  const highlightedIndexRef = useRef(-1);

  // Controlled state for selected item
  const [selectedItem, setSelectedItem] = useControlledState(
    controlledSelectedItem,
    defaultSelectedItem,
    onSelectedItemChange,
  );

  // Controlled state for open/close
  const [isOpen, setIsOpen] = useControlledState(
    controlledIsOpen,
    defaultIsOpen,
    onIsOpenChange,
  );

  /**
   * Set highlighted index with callback
   */
  const setHighlightedIndex = useCallback(
    (index: number) => {
      highlightedIndexRef.current = index;
      onHighlightedIndexChange?.(index);
    },
    [onHighlightedIndexChange],
  );

  /**
   * Toggle menu open/close
   */
  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Opening: highlight selected item or first item
      const selectedIndex = selectedItem ? items.indexOf(selectedItem) : -1;
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, setIsOpen, items, selectedItem, setHighlightedIndex]);

  /**
   * Open menu
   */
  const openMenu = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      const selectedIndex = selectedItem ? items.indexOf(selectedItem) : -1;
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, setIsOpen, items, selectedItem, setHighlightedIndex]);

  /**
   * Close menu
   */
  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [isOpen, setIsOpen, setHighlightedIndex]);

  /**
   * Select an item
   */
  const selectItem = useCallback(
    (item: T | null) => {
      setSelectedItem(item);
      closeMenu();
    },
    [setSelectedItem, closeMenu],
  );

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setSelectedItem(defaultSelectedItem);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [defaultSelectedItem, setSelectedItem, setIsOpen, setHighlightedIndex]);

  /**
   * Move highlighted index
   */
  const moveHighlight = useCallback(
    (delta: number) => {
      if (!isOpen || items.length === 0) return;

      let nextIndex = highlightedIndexRef.current + delta;

      // Wrap around
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;

      setHighlightedIndex(nextIndex);
    },
    [isOpen, items.length, setHighlightedIndex],
  );

  /**
   * Handle keyboard events for toggle button
   */
  const handleToggleButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveHighlight(1);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveHighlight(-1);
          }
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            const highlighted = items[highlightedIndexRef.current];
            if (highlighted !== undefined) {
              selectItem(highlighted);
            }
          }
          break;

        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
      }
    },
    [isOpen, items, openMenu, closeMenu, moveHighlight, selectItem],
  );

  /**
   * Handle keyboard events for menu
   */
  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveHighlight(1);
          break;

        case "ArrowUp":
          e.preventDefault();
          moveHighlight(-1);
          break;

        case "Home":
          e.preventDefault();
          setHighlightedIndex(0);
          break;

        case "End":
          e.preventDefault();
          setHighlightedIndex(items.length - 1);
          break;

        case "Enter":
        case " ": {
          e.preventDefault();
          const highlighted = items[highlightedIndexRef.current];
          if (highlighted !== undefined) {
            selectItem(highlighted);
          }
          break;
        }

        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
      }
    },
    [items, moveHighlight, setHighlightedIndex, selectItem, closeMenu],
  );

  /**
   * Get props for toggle button
   */
  const getToggleButtonProps = useCallback(
    (userOptions?: { disabled?: boolean }): ToggleButtonProps => {
      const labelId = `${baseId}-label`;
      const menuId = `${baseId}-menu`;
      const toggleId = `${baseId}-toggle`;

      return {
        onClick: userOptions?.disabled ? () => {} : toggleMenu,
        onKeyDown: userOptions?.disabled ? () => {} : handleToggleButtonKeyDown,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        "aria-labelledby": labelId,
        role: "combobox",
        "aria-controls": menuId,
        id: toggleId,
      };
    },
    [baseId, isOpen, toggleMenu, handleToggleButtonKeyDown],
  );

  /**
   * Get props for label
   */
  const getLabelProps = useCallback(
    (): LabelProps => ({
      id: `${baseId}-label`,
    }),
    [baseId],
  );

  /**
   * Get props for menu
   */
  const getMenuProps = useCallback(
    (): MenuProps => ({
      role: "listbox",
      "aria-labelledby": `${baseId}-label`,
      onKeyDown: handleMenuKeyDown,
      onBlur: closeMenu,
      id: `${baseId}-menu`,
    }),
    [baseId, handleMenuKeyDown, closeMenu],
  );

  /**
   * Get props for menu item
   */
  const getItemProps = useCallback(
    (userOptions: {
      item: T;
      index: number;
      disabled?: boolean;
    }): ItemProps => {
      const { item, index, disabled } = userOptions;
      const isSelected = selectedItem === item;
      const isHighlighted = highlightedIndexRef.current === index;

      return {
        role: "option",
        "aria-selected": isSelected,
        highlighted: isHighlighted,
        onClick: disabled ? () => {} : () => selectItem(item),
        onMouseMove: disabled ? () => {} : () => setHighlightedIndex(index),
        id: `${baseId}-item-${index}`,
      };
    },
    [baseId, selectedItem, selectItem, setHighlightedIndex],
  );

  return {
    // State
    isOpen,
    selectedItem,
    highlightedIndex: highlightedIndexRef.current,

    // Prop Getters
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,

    // Actions
    toggleMenu,
    openMenu,
    closeMenu,
    selectItem,
    setHighlightedIndex,
    reset,
  };
}
